
#include "DHT.h"
#include <WiFi.h>
#include "FirebaseESP32.h"
#include <string.h>
#include "MQ135.h" 

const char *ssid = "HoaTraicay";
const char *password = "77779999";

#define BUTTON1 32
#define BUTTON2 33
#define LED 2
#define QUAT 5
#define DHTPIN 4  
#define MQ2 35
#define DHTTYPE DHT11   

DHT dht(DHTPIN, DHTTYPE);

#define FIREBASE_HOST "smart-home-54e2a-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "OmVZWMoo4PvHxpgf1Sklarn6Jd0e45M7O2UrlvZ1"

float ND;
float DA;
int ppm;
int led_status = 0, fan_status = 0;
int key1 = 0, key2 = 0;

void Send(void *pvParameters);
void Sensor(void *pvParameters);
portMUX_TYPE mux = portMUX_INITIALIZER_UNLOCKED;
FirebaseData firebaseData;
FirebaseJson json;

void IRAM_ATTR isr()
{
  portENTER_CRITICAL_ISR(&mux);
  Serial.println("Button Pushed!!!");
  led_status = !led_status;
  // digitalWrite(LED, led_status);
  portEXIT_CRITICAL_ISR(&mux);//Cho phép tiếp tục chạy các task khác
}

void IRAM_ATTR isr1()
{
  portENTER_CRITICAL_ISR(&mux);
  Serial.println("Button1 Pushed!!!");
  fan_status = !fan_status;
  // digitalWrite(QUAT, fan_status);
  portEXIT_CRITICAL_ISR(&mux);//Cho phép tiếp tục chạy các task khác
}

void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.println("connect to AP...");
  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED);
  Serial.print("AP IP address: ");
  Serial.println(WiFi.localIP());
  dht.begin();
  pinMode(MQ2, INPUT);
  pinMode(QUAT, OUTPUT);
  pinMode(LED, OUTPUT);
  pinMode(BUTTON1, INPUT_PULLUP);
  pinMode(BUTTON2, INPUT_PULLUP);
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  attachInterrupt(digitalPinToInterrupt(BUTTON2), isr1, FALLING);
  attachInterrupt(digitalPinToInterrupt(BUTTON1), isr, FALLING);
}

void loop() {
  Sensor();
  delay(50);
  Get_data();
  delay(50);
  Send();
  delay(1000);  
}

void Sensor()
{
    DA = dht.readHumidity();
    ND = dht.readTemperature();
    ppm = analogRead(MQ2);
}

void Send()
{
      json.add("ND", ND);
      json.add("DA", DA);
      json.add("AIR", ppm);
      json.add("DEN", led_status);
      json.add("QUAT", fan_status);
      String path = "/SMART_HOME";
      delay(50);
      if (Firebase.set(firebaseData, path + "/PHONG_KHACH", json))
      {
        Serial.println("PUT JSON --------------------");
        Serial.println("PASSED");
        Serial.println("PATH: " + firebaseData.dataPath());
        Serial.println("TYPE: " + firebaseData.dataType());
        Serial.println("ETag: " + firebaseData.ETag());
        Serial.print(F("Humidity: "));
        Serial.print(DA);
        Serial.print(F("%  Temperature: "));
        Serial.print(ND);
        Serial.print(F("°C"));
        Serial.print(F("%  AIR: "));
        Serial.print(ppm);
        Serial.print(F("ppm \n"));
        Serial.print(led_status);
        Serial.print(fan_status);
      }
      else
      {
        Serial.println("FAILED");
        Serial.println("REASON: " + firebaseData.errorReason());
        Serial.println("------------------------------------");
        Serial.println();
      }
}

void Get_data(){
  String jsonRecvStr = "";
  String path = "/SMART_HOME";
  if (Firebase.getInt(firebaseData, path + "/PHONG_KHACH/DEN") == true){
        int st = firebaseData.to<int>();
        if(st == 1)
        {
          led_status = 1;
          digitalWrite(LED, led_status);
          
        }else
        {
          led_status = 0;
          digitalWrite(LED, led_status);
          
        }
  }
  delay(50);
  if (Firebase.getInt(firebaseData, path + "/PHONG_KHACH/QUAT") == true){
        int st1 = firebaseData.to<int>();
        if(st1 == 1)
        {
          fan_status = 1;
          digitalWrite(QUAT, fan_status);
          
        }else
        {
          fan_status = 0;
          digitalWrite(QUAT, fan_status);
        }
  }
}