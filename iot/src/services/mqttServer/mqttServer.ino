#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

#define DHTPIN 2        // GPIO2 tương ứng với D4
#define DHTTYPE DHT11  // Chọn loại cảm biến DHT11
DHT dht(DHTPIN, DHTTYPE);

int ldrPin = A0;      // Chân analog A0 để kết nối với LDR
int ldrValue = 0;     // Biến để lưu giá trị đọc từ LDR

// Define pin connections for the three devices
#define LIGHT1_PIN 14   // GPIO14 tương ứng với D5 (Đèn)
#define LIGHT2_PIN 12   // GPIO12 tương ứng với D6 (Quạt)

#define LIGHT3_PIN 13   // GPIO13 tương ứng với D7 (Điều hòa)
// #define SPEAKER_PIN 15 // Chọn GPIO15 cho loa



bool ledState = LOW;  // Trạng thái hiện tại của đèn nhấp nháy

// bool manualControl = false;  // To track manual control of the light
// bool manualControl2 = false;

// Wi-Fi and MQTT information
const char* ssid = "Saddd"; 
const char* password = "Dangcap.";
const char* mqtt_server = "192.168.198.41";  // Change this to your MQTT broker IP
const char* mqtt_username = "B21DCAT149";
const char* mqtt_password = "123";

// Initialize WiFi and MQTT clients
WiFiClient espClient;
PubSubClient client(espClient);

// Function to connect to WiFi
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

// Function to handle incoming MQTT messages
void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  Serial.println(message);

  // Control devices based on received MQTT message
  if (strcmp(topic, "home/devices/den") == 0) {
    // manualControl = true;  // Turn on manual control when receiving MQTT command
    if (message == "ON") {
      digitalWrite(LIGHT1_PIN, HIGH);
      Serial.println("LED turned ON");
      client.publish("home/devices/den/status", "ON");
    } else if (message == "OFF") {
      digitalWrite(LIGHT1_PIN, LOW);
      Serial.println("LED turned OFF");
      client.publish("home/devices/den/status", "OFF");
    }
  }
  if (strcmp(topic, "home/devices/quat") == 0) {
    if (message == "ON") {
      digitalWrite(LIGHT2_PIN, HIGH);
      Serial.println("Fan turned ON");
      client.publish("home/devices/quat/status", "ON");
    } else if (message == "OFF") {
      digitalWrite(LIGHT2_PIN, LOW);
      Serial.println("Fan turned OFF");
      client.publish("home/devices/quat/status", "OFF");
    }
  }
  if (strcmp(topic, "home/devices/dieuhoa") == 0) {
    // manualControl2 = true;
    if (message == "ON") {
      digitalWrite(LIGHT3_PIN, HIGH);
      Serial.println("Air Conditioner turned ON");
      client.publish("home/devices/dieuhoa/status", "ON");
    } else if (message == "OFF") {
      digitalWrite(LIGHT3_PIN, LOW);
      Serial.println("Air Conditioner turned OFF");
      client.publish("home/devices/dieuhoa/status", "OFF");
    }
  }
  // if (strcmp(topic, "home/devices/loa") == 0) {
  //   if (message == "ON") {
  //     digitalWrite(SPEAKER_PIN, HIGH);
  //     Serial.println("Louder Speaker turned ON");
  //     client.publish("home/devices/loa/status", "ON");
  //   } else if (message == "OFF") {
  //     digitalWrite(SPEAKER_PIN, LOW);
  //     Serial.println("Louder Speaker turned OFF");
  //     client.publish("home/devices/loa/status", "OFF");
  //   }
  // }
  // if (strcmp(topic, "home/devices/all") == 0) {
  //   if (message == "ON") {
  //     digitalWrite(LIGHT1_PIN, HIGH);
  //     digitalWrite(LIGHT2_PIN, HIGH);
  //     digitalWrite(LIGHT3_PIN, HIGH);
  //     client.publish("home/devices/den/status", "ON");
  //     client.publish("home/devices/quat/status", "ON");
  //     client.publish("home/devices/dieuhoa/status", "ON");
  //   } else if (message == "OFF") {
  //     digitalWrite(LIGHT1_PIN, LOW);
  //     digitalWrite(LIGHT2_PIN, LOW);
  //     digitalWrite(LIGHT3_PIN, LOW);
  //     client.publish("home/devices/den/status", "OFF");
  //     client.publish("home/devices/quat/status", "OFF");
  //     client.publish("home/devices/dieuhoa/status", "OFF");
  //   }
  // }
}

// Function to reconnect to the MQTT broker
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP8266Client", mqtt_username, mqtt_password)) {
      Serial.println("connected");

      // Subscribe to the topics for controlling devices
      client.subscribe("home/devices/den");
      client.subscribe("home/devices/quat");
      client.subscribe("home/devices/dieuhoa");
      client.subscribe("home/devices/loa");
      client.subscribe("home/devices/all");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1888);
  client.setCallback(callback);

  // Initialize DHT sensor
  dht.begin();

  // Set pin modes for the devices
  pinMode(LIGHT1_PIN, OUTPUT);  // Đèn
  pinMode(LIGHT2_PIN, OUTPUT);  // Quạt
  pinMode(LIGHT3_PIN, OUTPUT);  // Điều hòa
  // pinMode(SPEAKER_PIN, OUTPUT); // Loa
}

void loop() {
  if (!client.connected()) {
    reconnect();  // Kết nối lại nếu cần
  }
  client.loop();  // Kiểm tra và xử lý các tin nhắn MQTT
  // Read sensor data
  ldrValue = analogRead(ldrPin);
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  float dash = random(0,1000);
  // Check if any reading failed
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // if (dash > 800) {
  //   ledState = !ledState;  // Chuyển đổi trạng thái LED nhấp nháy
  //   digitalWrite(SPEAKER_PIN, ledState);

  //   // Gửi trạng thái MQTT
  //   if (ledState) {
  //     client.publish("home/devices/loa/status", "ON");
  //     Serial.println("Cảnh báo nhấp nháy - Trạng thái: ON");
  //   } else {
  //     client.publish("home/devices/loa/status", "OFF");
  //     Serial.println("Cảnh báo nhấp nháy - Trạng thái: OFF");
  //   }
  // } else {
  //   digitalWrite(SPEAKER_PIN, LOW);  // Tắt LED nếu ánh sáng < 500
  //   client.publish("home/devices/loa/status", "OFF");
  //   Serial.println("Cảnh báo nhấp nháy - Trạng thái: OFF");
  // }

  // if (!manualControl && ldrValue > 500) {
  //   ledState = !ledState;  // Chuyển đổi trạng thái LED nhấp nháy
  //   digitalWrite(LIGHT1_PIN, ledState);

  //   // Gửi trạng thái MQTT
  //   if (ledState) {
  //     client.publish("home/devices/den/status", "ON");
  //     Serial.println("LED nhấp nháy - Trạng thái: ON");
  //   } else {
  //     client.publish("home/devices/den/status", "OFF");
  //     Serial.println("LED nhấp nháy - Trạng thái: OFF");
  //   }
  // } else if (!manualControl) {
  //   digitalWrite(LIGHT1_PIN, LOW);  // Tắt LED nếu ánh sáng < 500
  //   client.publish("home/devices/den/status", "OFF");
  //   Serial.println("LED nhấp nháy - Trạng thái: OFF");
  // }

  // if (!manualControl2){
  //   if (ldrValue > 700) {
  //     digitalWrite(SPEAKER_PIN, HIGH);  // Bật loa
  //     Serial.println("Loa đã được bật do ánh sáng lớn hơn 700.");
  //     client.publish("home/devices/loa/status", "ON");
  //   } else {
  //     digitalWrite(SPEAKER_PIN, LOW);   // Tắt loa
  //     Serial.println("Loa đã tắt do ánh sáng thấp hơn 700.");
  //     client.publish("home/devices/loa/status", "OFF");
  //   }
  // }

  // Prepare JSON payload
  String payload = "{\"light\":";
  payload += String(ldrValue);
  payload += ",\"humidity\":";
  payload += String(humidity);
  payload += ",\"temperature\":";
  payload += String(temperature);
  // payload += ",\"Dash\":";
  // payload += String(dash);
  payload += "}";

  // Publish the sensor data to MQTT topic
  client.publish("home/sensors", payload.c_str());
  Serial.print("Published data: ");
  Serial.println(payload);

  // Delay between readings
  delay(2000);
}
