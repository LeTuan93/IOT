#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <string.h>

#define DHTPIN 14
#define DHTTYPE DHT11
#define LED_PIN 12
#define FAN_PIN 13

const int lightpin = A0;
int ledState = LOW;
int fanState = LOW;
const char* ssid = "hellocacban";
const char* password = "hicacban";

const char* mqttServer = "192.168.1.211";
const int mqttPort = 1883;
const char* mqttUser = "B21DCAT205";           // Thêm username
const char* mqttPassword = "123"; // Thêm password

WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  delay(10);
  pinMode(LED_PIN, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  digitalWrite(FAN_PIN, LOW);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
    // Đã kết nối thành công, in ra địa chỉ IP
  Serial.println("Connected to WiFi");
  Serial.print("ESP8266 IP address: ");
  Serial.println(WiFi.localIP());

  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);

  while (!client.connected()) {
    Serial.println("Connecting to MQTT...");
    if (client.connect("", mqttUser, mqttPassword)) { // Thêm username và password ở đây
      Serial.println("Connected to MQTT");
      client.subscribe("button");
    } else {
      Serial.print("Failed with state ");
      Serial.println(client.state());
      delay(2000);
    }
  }
  dht.begin();
}

void loop() {
  client.loop();

  static unsigned long previousDHTReadTime = 0;
  unsigned long currentMillis = millis();
  const unsigned long DHTReadInterval = 1000;

  if (currentMillis - previousDHTReadTime >= DHTReadInterval) {
    previousDHTReadTime = currentMillis;

    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();
    int light = analogRead(lightpin);

    // Tạo chuỗi JSON
    String jsonData = "{";
    jsonData += "\"humidity\":" + String(humidity) + ",";
    jsonData += "\"temperature\":" + String(temperature) + ",";
    jsonData += "\"light\":" + String(light);
    jsonData += "}";

    Serial.println(jsonData);
    client.publish("Sensor_data", jsonData.c_str());
  }
}


void callback(char* topic, byte* payload, unsigned int length) {
  if (strcmp(topic, "button") == 0) {
    String s = "";
    for (int i = 0; i < length; i++) {
      s += (char)payload[i];
    }
    if (s.equalsIgnoreCase("led|on")) {
      ledState = HIGH;
    }
    if (s.equalsIgnoreCase("led|off")) {
      ledState = LOW;
    }
    if (s.equalsIgnoreCase("fan|on")) {
      fanState = HIGH;
    }
    if (s.equalsIgnoreCase("fan|off")) {
      fanState = LOW;
    }
    digitalWrite(LED_PIN, ledState);
    digitalWrite(FAN_PIN, fanState);
    Serial.println(s);
    client.publish("action", s.c_str());
  }
}
