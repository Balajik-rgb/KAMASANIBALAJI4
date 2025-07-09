import React, { useState } from 'react';
import { Copy, Check, Code, Cpu, Wifi, Mic } from 'lucide-react';

export const CodeImplementation = () => {
  const [copiedCode, setCopiedCode] = useState('');
  const [activeTab, setActiveTab] = useState('esp32');

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const esp32Code = `#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <driver/i2s.h>
#include <HTTPClient.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Google Speech API
const char* speechAPI = "https://speech.googleapis.com/v1/speech:recognize";
const char* apiKey = "YOUR_GOOGLE_API_KEY";

// Device control pins
const int relayPins[] = {2, 4, 5, 18, 19, 21, 22, 23};
const int numDevices = 8;

// Device states
bool deviceStates[8] = {false};
String deviceNames[] = {
  "Living Room Light", "Bedroom Fan", "Kitchen Light", 
  "Air Conditioner", "TV", "Music System", "Garage Door", "Garden Light"
};

// I2S microphone configuration
#define I2S_WS 25
#define I2S_SD 33
#define I2S_SCK 32
#define I2S_PORT I2S_NUM_0
#define SAMPLE_RATE 16000
#define SAMPLE_BITS 16

WebServer server(80);
bool isListening = false;
String lastCommand = "";
float confidence = 0.0;

void setup() {
  Serial.begin(115200);
  
  // Initialize relay pins
  for (int i = 0; i < numDevices; i++) {
    pinMode(relayPins[i], OUTPUT);
    digitalWrite(relayPins[i], LOW);
  }
  
  // Initialize I2S microphone
  setupI2S();
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  // Setup web server routes
  setupWebServer();
  server.begin();
  
  Serial.println("Speech Recognition System Ready!");
}

void loop() {
  server.handleClient();
  
  if (isListening) {
    processAudio();
  }
  
  delay(10);
}

void setupI2S() {
  i2s_config_t i2s_config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = SAMPLE_RATE,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 4,
    .dma_buf_len = 1024,
    .use_apll = false,
    .tx_desc_auto_clear = false,
    .fixed_mclk = 0
  };
  
  i2s_pin_config_t pin_config = {
    .bck_io_num = I2S_SCK,
    .ws_io_num = I2S_WS,
    .data_out_num = I2S_PIN_NO_CHANGE,
    .data_in_num = I2S_SD
  };
  
  i2s_driver_install(I2S_PORT, &i2s_config, 0, NULL);
  i2s_set_pin(I2S_PORT, &pin_config);
}

void setupWebServer() {
  // Serve main page
  server.on("/", HTTP_GET, []() {
    String html = generateWebInterface();
    server.send(200, "text/html", html);
  });
  
  // Start/stop listening
  server.on("/listen", HTTP_POST, []() {
    isListening = !isListening;
    String response = "{\\"listening\\": " + String(isListening ? "true" : "false") + "}";
    server.send(200, "application/json", response);
  });
  
  // Get device status
  server.on("/status", HTTP_GET, []() {
    String json = generateStatusJSON();
    server.send(200, "application/json", json);
  });
  
  // Control device
  server.on("/control", HTTP_POST, []() {
    if (server.hasArg("device") && server.hasArg("state")) {
      int deviceId = server.arg("device").toInt();
      bool state = server.arg("state") == "true";
      
      if (deviceId >= 0 && deviceId < numDevices) {
        controlDevice(deviceId, state);
        server.send(200, "application/json", "{\\"success\\": true}");
      } else {
        server.send(400, "application/json", "{\\"error\\": \\"Invalid device ID\\"}");
      }
    } else {
      server.send(400, "application/json", "{\\"error\\": \\"Missing parameters\\"}");
    }
  });
}

void processAudio() {
  const int bufferSize = 1024;
  int16_t audioBuffer[bufferSize];
  size_t bytesRead;
  
  // Read audio data from I2S
  i2s_read(I2S_PORT, audioBuffer, bufferSize * sizeof(int16_t), &bytesRead, portMAX_DELAY);
  
  // Process audio for voice activity detection
  if (detectVoiceActivity(audioBuffer, bufferSize)) {
    // Record audio for speech recognition
    String audioData = recordAudio();
    
    // Send to speech recognition service
    String transcript = recognizeSpeech(audioData);
    
    if (transcript.length() > 0) {
      lastCommand = transcript;
      processVoiceCommand(transcript);
    }
  }
}

bool detectVoiceActivity(int16_t* buffer, int size) {
  long sum = 0;
  for (int i = 0; i < size; i++) {
    sum += abs(buffer[i]);
  }
  
  int average = sum / size;
  return average > 500; // Threshold for voice activity
}

String recordAudio() {
  // Record 3 seconds of audio
  const int recordDuration = 3000; // ms
  const int bufferSize = 1024;
  int16_t audioBuffer[bufferSize];
  size_t bytesRead;
  
  String audioData = "";
  unsigned long startTime = millis();
  
  while (millis() - startTime < recordDuration) {
    i2s_read(I2S_PORT, audioBuffer, bufferSize * sizeof(int16_t), &bytesRead, 100);
    
    // Convert to base64 or process as needed
    for (int i = 0; i < bufferSize; i++) {
      audioData += String(audioBuffer[i]) + ",";
    }
  }
  
  return audioData;
}

String recognizeSpeech(String audioData) {
  HTTPClient http;
  http.begin(speechAPI);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + String(apiKey));
  
  // Create JSON payload for Google Speech API
  DynamicJsonDocument doc(2048);
  doc["config"]["encoding"] = "LINEAR16";
  doc["config"]["sampleRateHertz"] = SAMPLE_RATE;
  doc["config"]["languageCode"] = "en-US";
  doc["audio"]["content"] = audioData; // Base64 encoded audio
  
  String payload;
  serializeJson(doc, payload);
  
  int httpResponseCode = http.POST(payload);
  String response = "";
  
  if (httpResponseCode == 200) {
    response = http.getString();
    
    // Parse response to extract transcript
    DynamicJsonDocument responseDoc(1024);
    deserializeJson(responseDoc, response);
    
    if (responseDoc["results"].size() > 0) {
      String transcript = responseDoc["results"][0]["alternatives"][0]["transcript"];
      confidence = responseDoc["results"][0]["alternatives"][0]["confidence"];
      return transcript;
    }
  }
  
  http.end();
  return "";
}

void processVoiceCommand(String command) {
  command.toLowerCase();
  command.trim();
  
  Serial.println("Processing command: " + command);
  
  // Parse command for action and device
  String action = "";
  int deviceId = -1;
  
  // Determine action
  if (command.indexOf("turn on") >= 0 || command.indexOf("switch on") >= 0) {
    action = "on";
  } else if (command.indexOf("turn off") >= 0 || command.indexOf("switch off") >= 0) {
    action = "off";
  } else if (command.indexOf("toggle") >= 0) {
    action = "toggle";
  }
  
  // Identify device
  for (int i = 0; i < numDevices; i++) {
    String deviceName = deviceNames[i];
    deviceName.toLowerCase();
    
    if (command.indexOf(deviceName.substring(deviceName.lastIndexOf(" ") + 1)) >= 0) {
      deviceId = i;
      break;
    }
  }
  
  // Execute command
  if (action != "" && deviceId >= 0) {
    bool newState;
    if (action == "on") {
      newState = true;
    } else if (action == "off") {
      newState = false;
    } else { // toggle
      newState = !deviceStates[deviceId];
    }
    
    controlDevice(deviceId, newState);
    
    // Provide voice feedback
    String feedback = deviceNames[deviceId] + " " + (newState ? "turned on" : "turned off");
    Serial.println("Feedback: " + feedback);
  } else {
    Serial.println("Command not recognized");
  }
}

void controlDevice(int deviceId, bool state) {
  if (deviceId >= 0 && deviceId < numDevices) {
    digitalWrite(relayPins[deviceId], state ? HIGH : LOW);
    deviceStates[deviceId] = state;
    
    Serial.println(deviceNames[deviceId] + " " + (state ? "ON" : "OFF"));
  }
}

String generateStatusJSON() {
  DynamicJsonDocument doc(1024);
  
  doc["listening"] = isListening;
  doc["lastCommand"] = lastCommand;
  doc["confidence"] = confidence;
  
  JsonArray devices = doc.createNestedArray("devices");
  for (int i = 0; i < numDevices; i++) {
    JsonObject device = devices.createNestedObject();
    device["id"] = i;
    device["name"] = deviceNames[i];
    device["state"] = deviceStates[i];
  }
  
  String json;
  serializeJson(doc, json);
  return json;
}

String generateWebInterface() {
  return R"(
<!DOCTYPE html>
<html>
<head>
    <title>Speech Recognition Control</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: Arial; margin: 20px; background: #f0f0f0; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        .device { padding: 10px; margin: 5px; border: 1px solid #ddd; border-radius: 5px; }
        .device.on { background: #d4edda; border-color: #c3e6cb; }
        .device.off { background: #f8d7da; border-color: #f5c6cb; }
        button { padding: 10px 20px; margin: 5px; border: none; border-radius: 5px; cursor: pointer; }
        .listen-btn { background: #007bff; color: white; font-size: 18px; }
        .listen-btn.active { background: #dc3545; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Speech Recognition Control System</h1>
        <button id="listenBtn" class="listen-btn" onclick="toggleListening()">Start Listening</button>
        <div id="status"></div>
        <div id="devices"></div>
    </div>
    
    <script>
        let isListening = false;
        
        function toggleListening() {
            fetch('/listen', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    isListening = data.listening;
                    updateUI();
                });
        }
        
        function updateStatus() {
            fetch('/status')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('status').innerHTML = 
                        '<p>Last Command: ' + data.lastCommand + '</p>' +
                        '<p>Confidence: ' + (data.confidence * 100).toFixed(1) + '%</p>';
                    
                    let devicesHTML = '';
                    data.devices.forEach(device => {
                        devicesHTML += '<div class="device ' + (device.state ? 'on' : 'off') + '">' +
                            device.name + ': ' + (device.state ? 'ON' : 'OFF') + '</div>';
                    });
                    document.getElementById('devices').innerHTML = devicesHTML;
                });
        }
        
        function updateUI() {
            const btn = document.getElementById('listenBtn');
            btn.textContent = isListening ? 'Stop Listening' : 'Start Listening';
            btn.className = 'listen-btn' + (isListening ? ' active' : '');
        }
        
        setInterval(updateStatus, 1000);
        updateStatus();
    </script>
</body>
</html>
  )";
}`;

  const pythonCode = `#!/usr/bin/env python3
import speech_recognition as sr
import pyttsx3
import json
import requests
import threading
import time
from flask import Flask, render_template, jsonify, request
import RPi.GPIO as GPIO

# Initialize Flask app
app = Flask(__name__)

# GPIO setup for Raspberry Pi
relay_pins = [18, 19, 20, 21, 22, 23, 24, 25]
device_names = [
    "Living Room Light", "Bedroom Fan", "Kitchen Light",
    "Air Conditioner", "TV", "Music System", "Garage Door", "Garden Light"
]
device_states = [False] * 8

# Initialize GPIO
GPIO.setmode(GPIO.BCM)
for pin in relay_pins:
    GPIO.setup(pin, GPIO.OUT)
    GPIO.output(pin, GPIO.LOW)

# Speech recognition setup
recognizer = sr.Recognizer()
microphone = sr.Microphone()
tts_engine = pyttsx3.init()

# Global variables
is_listening = False
last_command = ""
confidence = 0.0
command_history = []

class SpeechRecognitionSystem:
    def __init__(self):
        self.setup_speech_recognition()
        self.setup_tts()
        
    def setup_speech_recognition(self):
        # Adjust for ambient noise
        with microphone as source:
            recognizer.adjust_for_ambient_noise(source)
        
        # Set recognition parameters
        recognizer.energy_threshold = 300
        recognizer.dynamic_energy_threshold = True
        recognizer.pause_threshold = 0.8
        recognizer.operation_timeout = None
        recognizer.phrase_threshold = 0.3
        recognizer.non_speaking_duration = 0.5
        
    def setup_tts(self):
        # Configure text-to-speech
        voices = tts_engine.getProperty('voices')
        tts_engine.setProperty('voice', voices[0].id)  # Female voice
        tts_engine.setProperty('rate', 150)  # Speaking rate
        tts_engine.setProperty('volume', 0.8)  # Volume level
        
    def listen_continuously(self):
        global is_listening, last_command, confidence
        
        while True:
            if is_listening:
                try:
                    # Listen for audio input
                    with microphone as source:
                        print("Listening for commands...")
                        audio = recognizer.listen(source, timeout=1, phrase_time_limit=5)
                    
                    # Recognize speech
                    try:
                        command = recognizer.recognize_google(audio, show_all=True)
                        
                        if command and 'alternative' in command:
                            transcript = command['alternative'][0]['transcript']
                            confidence = command['alternative'][0].get('confidence', 0.0)
                            
                            last_command = transcript
                            print(f"Recognized: {transcript} (Confidence: {confidence:.2f})")
                            
                            # Process the command
                            self.process_voice_command(transcript)
                            
                            # Add to history
                            command_history.append({
                                'command': transcript,
                                'confidence': confidence,
                                'timestamp': time.time()
                            })
                            
                            # Keep only last 10 commands
                            if len(command_history) > 10:
                                command_history.pop(0)
                                
                    except sr.UnknownValueError:
                        print("Could not understand audio")
                    except sr.RequestError as e:
                        print(f"Error with speech recognition service: {e}")
                        
                except sr.WaitTimeoutError:
                    pass  # No speech detected, continue listening
                    
            else:
                time.sleep(0.1)  # Sleep when not listening
                
    def process_voice_command(self, command):
        command_lower = command.lower().strip()
        
        # Parse action
        action = None
        if any(phrase in command_lower for phrase in ['turn on', 'switch on', 'start']):
            action = 'on'
        elif any(phrase in command_lower for phrase in ['turn off', 'switch off', 'stop']):
            action = 'off'
        elif 'toggle' in command_lower:
            action = 'toggle'
        
        # Parse device
        device_id = self.identify_device(command_lower)
        
        if action and device_id is not None:
            # Execute command
            if action == 'on':
                new_state = True
            elif action == 'off':
                new_state = False
            else:  # toggle
                new_state = not device_states[device_id]
            
            self.control_device(device_id, new_state)
            
            # Provide voice feedback
            feedback = f"{device_names[device_id]} {action}"
            self.speak(feedback)
            
        else:
            self.speak("Sorry, I didn't understand that command")
            
    def identify_device(self, command):
        # Device keywords mapping
        device_keywords = {
            0: ['living room light', 'living light', 'main light'],
            1: ['bedroom fan', 'fan', 'ceiling fan'],
            2: ['kitchen light', 'kitchen'],
            3: ['air conditioner', 'ac', 'cooling'],
            4: ['tv', 'television', 'telly'],
            5: ['music system', 'music', 'speaker', 'audio'],
            6: ['garage door', 'garage'],
            7: ['garden light', 'garden', 'outdoor light']
        }
        
        for device_id, keywords in device_keywords.items():
            if any(keyword in command for keyword in keywords):
                return device_id
        
        return None
        
    def control_device(self, device_id, state):
        if 0 <= device_id < len(relay_pins):
            GPIO.output(relay_pins[device_id], GPIO.HIGH if state else GPIO.LOW)
            device_states[device_id] = state
            print(f"{device_names[device_id]} {'ON' if state else 'OFF'}")
            
    def speak(self, text):
        tts_engine.say(text)
        tts_engine.runAndWait()

# Initialize speech recognition system
speech_system = SpeechRecognitionSystem()

# Flask routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/listen', methods=['POST'])
def toggle_listening():
    global is_listening
    is_listening = not is_listening
    return jsonify({'listening': is_listening})

@app.route('/api/status')
def get_status():
    return jsonify({
        'listening': is_listening,
        'last_command': last_command,
        'confidence': confidence,
        'devices': [
            {
                'id': i,
                'name': device_names[i],
                'state': device_states[i]
            }
            for i in range(len(device_names))
        ],
        'history': command_history[-5:]  # Last 5 commands
    })

@app.route('/api/control', methods=['POST'])
def control_device():
    data = request.get_json()
    device_id = data.get('device_id')
    state = data.get('state')
    
    if device_id is not None and state is not None:
        speech_system.control_device(device_id, state)
        return jsonify({'success': True})
    
    return jsonify({'error': 'Invalid parameters'}), 400

@app.route('/api/speak', methods=['POST'])
def speak_text():
    data = request.get_json()
    text = data.get('text', '')
    
    if text:
        speech_system.speak(text)
        return jsonify({'success': True})
    
    return jsonify({'error': 'No text provided'}), 400

if __name__ == '__main__':
    # Start speech recognition in a separate thread
    speech_thread = threading.Thread(target=speech_system.listen_continuously)
    speech_thread.daemon = True
    speech_thread.start()
    
    try:
        # Start Flask web server
        app.run(host='0.0.0.0', port=5000, debug=False)
    except KeyboardInterrupt:
        print("Shutting down...")
    finally:
        GPIO.cleanup()`;

  const arduinoCode = `// Alternative Arduino implementation for basic speech recognition
#include <SoftwareSerial.h>
#include <ArduinoJson.h>

// Voice recognition module (e.g., DFRobot Voice Recognition Module)
SoftwareSerial voiceSerial(2, 3);

// Device control pins
const int relayPins[] = {4, 5, 6, 7, 8, 9, 10, 11};
const int numDevices = 8;
bool deviceStates[8] = {false};

// Voice commands (pre-trained)
const int CMD_LIGHT_ON = 1;
const int CMD_LIGHT_OFF = 2;
const int CMD_FAN_ON = 3;
const int CMD_FAN_OFF = 4;
const int CMD_ALL_ON = 5;
const int CMD_ALL_OFF = 6;

void setup() {
  Serial.begin(9600);
  voiceSerial.begin(9600);
  
  // Initialize relay pins
  for (int i = 0; i < numDevices; i++) {
    pinMode(relayPins[i], OUTPUT);
    digitalWrite(relayPins[i], LOW);
  }
  
  // Initialize voice recognition module
  delay(2000);
  voiceSerial.write(0xAA);  // Wake up command
  voiceSerial.write(0x37);  // Start recognition
  
  Serial.println("Voice Recognition System Ready!");
  Serial.println("Available commands:");
  Serial.println("1. Light On");
  Serial.println("2. Light Off");
  Serial.println("3. Fan On");
  Serial.println("4. Fan Off");
  Serial.println("5. All On");
  Serial.println("6. All Off");
}

void loop() {
  // Check for voice commands
  if (voiceSerial.available()) {
    int command = voiceSerial.read();
    processVoiceCommand(command);
  }
  
  // Check for serial commands (for testing)
  if (Serial.available()) {
    int command = Serial.parseInt();
    processVoiceCommand(command);
  }
  
  delay(100);
}

void processVoiceCommand(int command) {
  Serial.print("Received command: ");
  Serial.println(command);
  
  switch (command) {
    case CMD_LIGHT_ON:
      controlDevice(0, true);  // Living room light
      Serial.println("Light turned ON");
      break;
      
    case CMD_LIGHT_OFF:
      controlDevice(0, false);
      Serial.println("Light turned OFF");
      break;
      
    case CMD_FAN_ON:
      controlDevice(1, true);  // Bedroom fan
      Serial.println("Fan turned ON");
      break;
      
    case CMD_FAN_OFF:
      controlDevice(1, false);
      Serial.println("Fan turned OFF");
      break;
      
    case CMD_ALL_ON:
      for (int i = 0; i < numDevices; i++) {
        controlDevice(i, true);
      }
      Serial.println("All devices turned ON");
      break;
      
    case CMD_ALL_OFF:
      for (int i = 0; i < numDevices; i++) {
        controlDevice(i, false);
      }
      Serial.println("All devices turned OFF");
      break;
      
    default:
      Serial.println("Unknown command");
      break;
  }
}

void controlDevice(int deviceId, bool state) {
  if (deviceId >= 0 && deviceId < numDevices) {
    digitalWrite(relayPins[deviceId], state ? HIGH : LOW);
    deviceStates[deviceId] = state;
  }
}

// Function to train voice commands (call during setup)
void trainVoiceCommands() {
  Serial.println("Training voice commands...");
  
  // Train command 1: "Light On"
  voiceSerial.write(0xAA);
  voiceSerial.write(0x11);
  voiceSerial.write(0x01);
  delay(2000);
  
  // Train command 2: "Light Off"
  voiceSerial.write(0xAA);
  voiceSerial.write(0x11);
  voiceSerial.write(0x02);
  delay(2000);
  
  // Continue for other commands...
  
  Serial.println("Voice training complete!");
}`;

  const tabs = [
    { id: 'esp32', label: 'ESP32 Implementation', icon: Cpu, code: esp32Code },
    { id: 'python', label: 'Raspberry Pi Python', icon: Code, code: pythonCode },
    { id: 'arduino', label: 'Arduino Basic', icon: Mic, code: arduinoCode }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Code Implementation</h2>
      
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

      {/* Implementation Guide */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Implementation Steps:</h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Choose your platform (ESP32 for WiFi, Raspberry Pi for advanced features, Arduino for basic)</li>
          <li>Install required libraries and dependencies</li>
          <li>Set up hardware connections (microphone, relays, display)</li>
          <li>Configure WiFi credentials and API keys</li>
          <li>Upload/run the code on your chosen platform</li>
          <li>Train voice commands or configure speech recognition service</li>
          <li>Test device control through voice commands</li>
          <li>Set up web interface for monitoring and configuration</li>
        </ol>
      </div>

      {/* Platform Comparison */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">ESP32 Platform</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• WiFi connectivity built-in</li>
            <li>• Real-time speech processing</li>
            <li>• Google Speech API integration</li>
            <li>• Web server for remote control</li>
            <li>• Moderate complexity</li>
          </ul>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Raspberry Pi</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Full Linux environment</li>
            <li>• Advanced NLP capabilities</li>
            <li>• Multiple speech engines</li>
            <li>• Machine learning support</li>
            <li>• High complexity, high features</li>
          </ul>
        </div>
        
        <div className="p-4 bg-orange-50 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-2">Arduino Basic</h4>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Simple voice recognition module</li>
            <li>• Pre-trained commands</li>
            <li>• Low cost implementation</li>
            <li>• Easy to understand</li>
            <li>• Limited but functional</li>
          </ul>
        </div>
      </div>
    </div>
  );
};