import React from 'react';
import { Cpu, Thermometer, Monitor, Zap, Cable } from 'lucide-react';

export const CircuitDiagram = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Circuit Diagram</h2>
      <div className="relative bg-gray-50 rounded-lg p-8 min-h-96">
        
        {/* Arduino/Microcontroller */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Cpu size={24} />
            <span className="font-semibold">Arduino Uno</span>
          </div>
          <div className="text-xs mt-1">Microcontroller</div>
        </div>

        {/* DHT22 Sensor */}
        <div className="absolute top-8 left-8 bg-red-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Thermometer size={24} />
            <span className="font-semibold">DHT22</span>
          </div>
          <div className="text-xs mt-1">Temp & Humidity</div>
        </div>

        {/* LCD Display */}
        <div className="absolute top-8 right-8 bg-green-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Monitor size={24} />
            <span className="font-semibold">LCD 16x2</span>
          </div>
          <div className="text-xs mt-1">I2C Display</div>
        </div>

        {/* Power Supply */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Zap size={20} />
            <span className="text-sm">5V Power</span>
          </div>
        </div>

        {/* Connection Lines */}
        {/* DHT22 to Arduino */}
        <div className="absolute top-16 left-32 w-40 h-0.5 bg-red-400"></div>
        <div className="absolute top-16 left-72 w-0.5 h-8 bg-red-400"></div>

        {/* LCD to Arduino */}
        <div className="absolute top-16 right-32 w-40 h-0.5 bg-green-400"></div>
        <div className="absolute top-16 right-72 w-0.5 h-8 bg-green-400"></div>

        {/* Power connections */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-0.5 h-20 bg-gray-400"></div>

        {/* Pin Labels */}
        <div className="absolute top-32 left-12 bg-white p-2 rounded shadow text-xs">
          <div className="font-semibold text-red-600">DHT22 Pins:</div>
          <div>VCC → 5V</div>
          <div>GND → GND</div>
          <div>DATA → Pin 2</div>
        </div>

        <div className="absolute top-32 right-12 bg-white p-2 rounded shadow text-xs">
          <div className="font-semibold text-green-600">LCD Pins:</div>
          <div>VCC → 5V</div>
          <div>GND → GND</div>
          <div>SDA → A4</div>
          <div>SCL → A5</div>
        </div>

        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow text-xs">
          <div className="font-semibold text-blue-600">Arduino Pins:</div>
          <div>Pin 2 → DHT22 Data</div>
          <div>A4 → LCD SDA</div>
          <div>A5 → LCD SCL</div>
          <div>5V → Power Rail</div>
          <div>GND → Ground Rail</div>
        </div>

        {/* Components List */}
        <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">Required Components</h3>
          <ul className="text-xs space-y-1 text-gray-600">
            <li>• Arduino Uno R3</li>
            <li>• DHT22 Temperature Sensor</li>
            <li>• 16x2 LCD with I2C Module</li>
            <li>• Breadboard</li>
            <li>• Jumper Wires</li>
            <li>• 10kΩ Pull-up Resistor</li>
            <li>• USB Cable</li>
          </ul>
        </div>

        {/* Wiring Instructions */}
        <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">Wiring Guide</h3>
          <ul className="text-xs space-y-1 text-gray-600">
            <li>1. Connect DHT22 VCC to Arduino 5V</li>
            <li>2. Connect DHT22 GND to Arduino GND</li>
            <li>3. Connect DHT22 Data to Arduino Pin 2</li>
            <li>4. Connect LCD VCC to Arduino 5V</li>
            <li>5. Connect LCD GND to Arduino GND</li>
            <li>6. Connect LCD SDA to Arduino A4</li>
            <li>7. Connect LCD SCL to Arduino A5</li>
          </ul>
        </div>
      </div>
    </div>
  );
};