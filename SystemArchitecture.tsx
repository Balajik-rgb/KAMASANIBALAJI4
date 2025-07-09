import React from 'react';
import { Cpu, Mic, Wifi, Zap, HardDrive, Monitor, Speaker } from 'lucide-react';

export const SystemArchitecture = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">System Architecture</h2>
      
      <div className="relative bg-gray-50 rounded-lg p-8 min-h-96 mb-6">
        {/* Microphone Input */}
        <div className="absolute top-8 left-8 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Mic size={24} />
            <span className="font-semibold">Microphone</span>
          </div>
          <div className="text-xs mt-1">Audio Input</div>
        </div>

        {/* Main Processing Unit */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Cpu size={24} />
            <span className="font-semibold">ESP32/Raspberry Pi</span>
          </div>
          <div className="text-xs mt-1">Main Controller</div>
        </div>

        {/* WiFi Module */}
        <div className="absolute top-8 right-8 bg-green-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Wifi size={24} />
            <span className="font-semibold">WiFi Module</span>
          </div>
          <div className="text-xs mt-1">Connectivity</div>
        </div>

        {/* Memory/Storage */}
        <div className="absolute top-32 left-16 bg-orange-600 text-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <HardDrive size={20} />
            <span className="text-sm">Memory</span>
          </div>
        </div>

        {/* Display */}
        <div className="absolute top-32 right-16 bg-teal-600 text-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Monitor size={20} />
            <span className="text-sm">Display</span>
          </div>
        </div>

        {/* Speaker Output */}
        <div className="absolute bottom-8 left-8 bg-red-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Speaker size={24} />
            <span className="font-semibold">Speaker</span>
          </div>
          <div className="text-xs mt-1">Audio Feedback</div>
        </div>

        {/* Device Control */}
        <div className="absolute bottom-8 right-8 bg-gray-700 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Zap size={24} />
            <span className="font-semibold">Relay Module</span>
          </div>
          <div className="text-xs mt-1">Device Control</div>
        </div>

        {/* Power Supply */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Zap size={20} />
            <span className="text-sm">5V/3.3V Power</span>
          </div>
        </div>

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Microphone to Controller */}
          <line x1="160" y1="60" x2="280" y2="60" stroke="#4F46E5" strokeWidth="2" />
          
          {/* Controller to WiFi */}
          <line x1="360" y1="60" x2="480" y2="60" stroke="#059669" strokeWidth="2" />
          
          {/* Controller to Memory */}
          <line x1="320" y1="90" x2="200" y2="150" stroke="#EA580C" strokeWidth="2" />
          
          {/* Controller to Display */}
          <line x1="320" y1="90" x2="440" y2="150" stroke="#0D9488" strokeWidth="2" />
          
          {/* Controller to Speaker */}
          <line x1="280" y1="90" x2="160" y2="200" stroke="#DC2626" strokeWidth="2" />
          
          {/* Controller to Relay */}
          <line x1="360" y1="90" x2="480" y2="200" stroke="#374151" strokeWidth="2" />
          
          {/* Power connections */}
          <line x1="320" y1="220" x2="320" y2="90" stroke="#D97706" strokeWidth="2" strokeDasharray="5,5" />
        </svg>

        {/* Data Flow Labels */}
        <div className="absolute top-16 left-48 bg-white px-2 py-1 rounded text-xs text-blue-600 font-medium">
          Audio Signal
        </div>
        <div className="absolute top-16 right-48 bg-white px-2 py-1 rounded text-xs text-green-600 font-medium">
          Network Data
        </div>
        <div className="absolute bottom-16 left-48 bg-white px-2 py-1 rounded text-xs text-red-600 font-medium">
          Voice Response
        </div>
        <div className="absolute bottom-16 right-48 bg-white px-2 py-1 rounded text-xs text-gray-600 font-medium">
          Device Control
        </div>
      </div>

      {/* Component Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Hardware Components</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex justify-between">
              <span>Microcontroller:</span>
              <span className="font-medium">ESP32 / Raspberry Pi 4</span>
            </li>
            <li className="flex justify-between">
              <span>Microphone:</span>
              <span className="font-medium">INMP441 I2S Digital Mic</span>
            </li>
            <li className="flex justify-between">
              <span>Speaker:</span>
              <span className="font-medium">3W 8Ω Speaker</span>
            </li>
            <li className="flex justify-between">
              <span>Display:</span>
              <span className="font-medium">0.96" OLED I2C</span>
            </li>
            <li className="flex justify-between">
              <span>Relay Module:</span>
              <span className="font-medium">8-Channel 5V Relay</span>
            </li>
            <li className="flex justify-between">
              <span>Power Supply:</span>
              <span className="font-medium">5V 3A Adapter</span>
            </li>
            <li className="flex justify-between">
              <span>Memory:</span>
              <span className="font-medium">32GB MicroSD Card</span>
            </li>
            <li className="flex justify-between">
              <span>Connectivity:</span>
              <span className="font-medium">WiFi 802.11 b/g/n</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Software Stack</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex justify-between">
              <span>Operating System:</span>
              <span className="font-medium">FreeRTOS / Raspbian</span>
            </li>
            <li className="flex justify-between">
              <span>Speech Recognition:</span>
              <span className="font-medium">Google Speech API</span>
            </li>
            <li className="flex justify-between">
              <span>Audio Processing:</span>
              <span className="font-medium">I2S Audio Library</span>
            </li>
            <li className="flex justify-between">
              <span>Network Protocol:</span>
              <span className="font-medium">HTTP/MQTT</span>
            </li>
            <li className="flex justify-between">
              <span>Device Control:</span>
              <span className="font-medium">GPIO Control</span>
            </li>
            <li className="flex justify-between">
              <span>Text-to-Speech:</span>
              <span className="font-medium">eSpeak/Festival</span>
            </li>
            <li className="flex justify-between">
              <span>Web Interface:</span>
              <span className="font-medium">AsyncWebServer</span>
            </li>
            <li className="flex justify-between">
              <span>Development:</span>
              <span className="font-medium">Arduino IDE/Python</span>
            </li>
          </ul>
        </div>
      </div>

      {/* System Features */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3">Key System Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium mb-2">Core Capabilities:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Real-time speech recognition</li>
              <li>• Natural language processing</li>
              <li>• Multi-device control</li>
              <li>• Voice feedback system</li>
              <li>• Web-based configuration</li>
              <li>• Mobile app integration</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Advanced Features:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Offline speech processing</li>
              <li>• Custom wake word detection</li>
              <li>• Multi-language support</li>
              <li>• Learning algorithms</li>
              <li>• Security authentication</li>
              <li>• Remote monitoring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};