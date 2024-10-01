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
#define BLINK_LED_PIN 16 // GPIO16 tương ứng với D0 (Đèn nhấp nháy khi ánh sáng > 500)


bool ledState = LOW;  // Trạng thái hiện tại của đèn nhấp nháy

// bool manualControl = false;  // To track manual control of the light

// Wi-Fi and MQTT information
const char* ssid = "hellocacban"; 
const char* password = "hicacban";
const char* mqtt_server = "192.168.1.211";  // Change this to your MQTT broker IP
const char* mqtt_username = "B21DCAT205";
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
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  // Initialize DHT sensor
  dht.begin();

  // Set pin modes for the devices
  pinMode(LIGHT1_PIN, OUTPUT);  // Đèn
  pinMode(LIGHT2_PIN, OUTPUT);  // Quạt
  pinMode(LIGHT3_PIN, OUTPUT);  // Điều hòa
  pinMode(BLINK_LED_PIN, OUTPUT); // Đèn nhấp nháy khi ánh sáng > 500
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
  // Check if any reading failed
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

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
  //   delay(500); // Tốc độ nhấp nháy 500ms
  // } else if (!manualControl) {
  //   digitalWrite(LIGHT1_PIN, LOW);  // Tắt LED nếu ánh sáng < 500
  // }


  // Prepare JSON payload
  String payload = "{\"light\":";
  payload += String(ldrValue);
  payload += ",\"humidity\":";
  payload += String(humidity);
  payload += ",\"temperature\":";
  payload += String(temperature);
  // payload += ",\"Dash\":";
  // payload += String(random(0,200));
  payload += "}";

  // Publish the sensor data to MQTT topic
  client.publish("home/sensors", payload.c_str());
  Serial.print("Published data: ");
  Serial.println(payload);

  // Delay between readings
  delay(2000);
}
