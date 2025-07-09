import React, { useState } from 'react';
import { Copy, Check, Code, Monitor, Thermometer } from 'lucide-react';

export const CodeExample = () => {
  const [copiedCode, setCopiedCode] = useState('');
  const [activeTab, setActiveTab] = useState('arduino');

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const arduinoCode = `#include <DHT.h>
#include <LiquidCrystal_I2C.h>

// DHT22 sensor configuration
#define DHT_PIN 2
#define DHT_TYPE DHT22
DHT dht(DHT_PIN, DHT_TYPE);

// LCD configuration (I2C address, columns, rows)
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Variables for sensor readings
float temperature;
float humidity;
float heatIndex;

// Timing variables
unsigned long previousMillis = 0;
const long interval = 2000; // Read sensor every 2 seconds

void setup() {
  // Initialize serial communication
  Serial.begin(9600);
  Serial.println("DHT22 Temperature & Humidity Sensor");
  Serial.println("Initializing sensor...");
  
  // Initialize DHT sensor
  dht.begin();
  
  // Initialize LCD
  lcd.init();
  lcd.backlight();
  
  // Display startup message
  lcd.setCursor(0, 0);
  lcd.print("Temp Monitor");
  lcd.setCursor(0, 1);
  lcd.print("Starting...");
  
  delay(2000);
  lcd.clear();
  
  Serial.println("Sensor ready!");
  Serial.println("Temperature | Humidity | Heat Index");
  Serial.println("------------|----------|------------");
}

void loop() {
  unsigned long currentMillis = millis();
  
  // Read sensor every 2 seconds
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    
    // Read temperature and humidity
    humidity = dht.readHumidity();
    temperature = dht.readTemperature(); // Celsius
    
    // Check if readings are valid
    if (isnan(humidity) || isnan(temperature)) {
      Serial.println("Failed to read from DHT sensor!");
      
      // Display error on LCD
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Sensor Error!");
      lcd.setCursor(0, 1);
      lcd.print("Check wiring");
      
      return;
    }
    
    // Calculate heat index
    heatIndex = dht.computeHeatIndex(temperature, humidity, false);
    
    // Display on LCD
    updateLCD();
    
    // Print to Serial Monitor
    printToSerial();
  }
}

void updateLCD() {
  // Clear display
  lcd.clear();
  
  // Line 1: Temperature
  lcd.setCursor(0, 0);
  lcd.print("Temp: ");
  lcd.print(temperature, 1);
  lcd.print((char)223); // Degree symbol
  lcd.print("C");
  
  // Line 2: Humidity
  lcd.setCursor(0, 1);
  lcd.print("Humidity: ");
  lcd.print(humidity, 1);
  lcd.print("%");
}

void printToSerial() {
  // Print timestamp
  Serial.print("[");
  Serial.print(millis() / 1000);
  Serial.print("s] ");
  
  // Print temperature
  Serial.print("Temperature: ");
  Serial.print(temperature, 2);
  Serial.print("°C (");
  Serial.print(temperature * 9.0 / 5.0 + 32.0, 2);
  Serial.print("°F)");
  
  // Print humidity
  Serial.print(" | Humidity: ");
  Serial.print(humidity, 2);
  Serial.print("%");
  
  // Print heat index
  Serial.print(" | Heat Index: ");
  Serial.print(heatIndex, 2);
  Serial.println("°C");
  
  // Print comfort level
  printComfortLevel();
}

void printComfortLevel() {
  Serial.print("Status: ");
  
  if (temperature < 18) {
    Serial.println("Too Cold");
  } else if (temperature > 30) {
    Serial.println("Too Hot");
  } else if (humidity < 30) {
    Serial.println("Too Dry");
  } else if (humidity > 70) {
    Serial.println("Too Humid");
  } else {
    Serial.println("Comfortable");
  }
  
  Serial.println("------------------------");
}

// Function to convert Celsius to Fahrenheit
float celsiusToFahrenheit(float celsius) {
  return (celsius * 9.0 / 5.0) + 32.0;
}

// Function to calculate dew point
float calculateDewPoint(float temp, float hum) {
  float a = 17.27;
  float b = 237.7;
  float alpha = ((a * temp) / (b + temp)) + log(hum / 100.0);
  float dewPoint = (b * alpha) / (a - alpha);
  return dewPoint;
}`;

  const libraryCode = `/*
  Required Libraries Installation:
  
  1. DHT sensor library by Adafruit
     - Go to Tools > Manage Libraries
     - Search for "DHT sensor library"
     - Install "DHT sensor library" by Adafruit
     - Also install "Adafruit Unified Sensor" dependency
  
  2. LiquidCrystal I2C library
     - Search for "LiquidCrystal I2C"
     - Install "LiquidCrystal I2C" by Frank de Brabander
*/

// Alternative LCD code without I2C (direct connection)
#include <LiquidCrystal.h>

// LCD pins: RS, Enable, D4, D5, D6, D7
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

void setup() {
  // Set up LCD's columns and rows
  lcd.begin(16, 2);
  lcd.print("Temperature");
  lcd.setCursor(0, 1);
  lcd.print("Monitor v1.0");
  delay(2000);
  lcd.clear();
}

// Pin connections for direct LCD connection:
// VSS → GND
// VDD → 5V
// V0 → 10kΩ potentiometer (contrast)
// RS → Pin 12
// Enable → Pin 11
// D4 → Pin 5
// D5 → Pin 4
// D6 → Pin 3
// D7 → Pin 2
// A → 5V (backlight)
// K → GND (backlight)`;

  const calibrationCode = `// Advanced features and calibration

// Calibration offsets (adjust based on your sensor)
const float TEMP_OFFSET = 0.0;  // Temperature correction
const float HUM_OFFSET = 0.0;   // Humidity correction

// Moving average for stable readings
const int SAMPLES = 5;
float tempReadings[SAMPLES];
float humReadings[SAMPLES];
int readIndex = 0;

void setup() {
  // Initialize arrays
  for (int i = 0; i < SAMPLES; i++) {
    tempReadings[i] = 0;
    humReadings[i] = 0;
  }
}

float getAverageTemp() {
  float total = 0;
  for (int i = 0; i < SAMPLES; i++) {
    total += tempReadings[i];
  }
  return total / SAMPLES;
}

float getAverageHum() {
  float total = 0;
  for (int i = 0; i < SAMPLES; i++) {
    total += humReadings[i];
  }
  return total / SAMPLES;
}

void updateReadings() {
  // Read new values
  float newTemp = dht.readTemperature() + TEMP_OFFSET;
  float newHum = dht.readHumidity() + HUM_OFFSET;
  
  // Add to moving average
  tempReadings[readIndex] = newTemp;
  humReadings[readIndex] = newHum;
  
  readIndex = (readIndex + 1) % SAMPLES;
  
  // Use averaged values
  temperature = getAverageTemp();
  humidity = getAverageHum();
}

// Data logging to EEPROM
#include <EEPROM.h>

void logData() {
  // Simple data logging example
  int address = 0;
  EEPROM.put(address, temperature);
  EEPROM.put(address + 4, humidity);
  EEPROM.put(address + 8, millis());
}`;

  const tabs = [
    { id: 'arduino', label: 'Main Arduino Code', icon: Code, code: arduinoCode },
    { id: 'library', label: 'Library Setup', icon: Monitor, code: libraryCode },
    { id: 'advanced', label: 'Advanced Features', icon: Thermometer, code: calibrationCode }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Implementation Code</h2>
      
      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <IconComponent size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Code Display */}
      {tabs.map((tab) => (
        <div key={tab.id} className={activeTab === tab.id ? 'block' : 'hidden'}>
          <div className="relative">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => copyToClipboard(tab.code, tab.id)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {copiedCode === tab.id ? (
                  <>
                    <Check size={16} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            
            <pre className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto text-sm font-mono">
              <code>{tab.code}</code>
            </pre>
          </div>
        </div>
      ))}

      {/* Implementation Steps */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Implementation Steps:</h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Install required libraries (DHT sensor library, LiquidCrystal I2C)</li>
          <li>Wire the DHT22 sensor to Arduino pin 2 with pull-up resistor</li>
          <li>Connect LCD display via I2C (SDA to A4, SCL to A5)</li>
          <li>Upload the main Arduino code to your board</li>
          <li>Open Serial Monitor (9600 baud) to view readings</li>
          <li>Calibrate sensor readings if necessary using offset values</li>
        </ol>
      </div>
    </div>
  );
};