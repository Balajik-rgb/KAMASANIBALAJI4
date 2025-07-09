import React from 'react';
import { Thermometer, Monitor, Cpu, Zap, Clock, Database } from 'lucide-react';

export const SystemOverview = () => {
  const features = [
    {
      icon: Thermometer,
      title: 'DHT22 Sensor',
      description: 'High-precision temperature and humidity sensor with ±0.5°C accuracy',
      color: 'bg-red-500'
    },
    {
      icon: Monitor,
      title: 'LCD Display',
      description: '16x2 character display with I2C interface for real-time readings',
      color: 'bg-green-500'
    },
    {
      icon: Cpu,
      title: 'Arduino Control',
      description: 'Arduino Uno microcontroller for sensor data processing and display',
      color: 'bg-blue-500'
    },
    {
      icon: Database,
      title: 'Serial Monitoring',
      description: 'Real-time data logging via serial communication to computer',
      color: 'bg-purple-500'
    },
    {
      icon: Clock,
      title: 'Continuous Reading',
      description: 'Automatic sensor readings every 2 seconds with timestamp logging',
      color: 'bg-orange-500'
    },
    {
      icon: Zap,
      title: 'Low Power',
      description: 'Energy-efficient design suitable for continuous operation',
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">System Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <IconComponent size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Technical Specifications */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Technical Specifications</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex justify-between"><span>Microcontroller:</span><span>Arduino Uno R3</span></li>
            <li className="flex justify-between"><span>Sensor:</span><span>DHT22 (AM2302)</span></li>
            <li className="flex justify-between"><span>Display:</span><span>16x2 LCD with I2C</span></li>
            <li className="flex justify-between"><span>Temperature Range:</span><span>-40°C to +80°C</span></li>
            <li className="flex justify-between"><span>Humidity Range:</span><span>0% to 100% RH</span></li>
            <li className="flex justify-between"><span>Accuracy:</span><span>±0.5°C, ±2% RH</span></li>
            <li className="flex justify-between"><span>Update Rate:</span><span>2 seconds</span></li>
            <li className="flex justify-between"><span>Power Supply:</span><span>5V DC via USB</span></li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Key Features</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Real-time temperature monitoring</li>
            <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Humidity measurement and display</li>
            <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>LCD display with backlight</li>
            <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Serial monitor data logging</li>
            <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Heat index calculation</li>
            <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Comfort level indicators</li>
            <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Error detection and handling</li>
            <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Calibration support</li>
          </ul>
        </div>
      </div>

      {/* Applications */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3">Applications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium mb-2">Indoor Monitoring:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Home climate control</li>
              <li>• Office environment monitoring</li>
              <li>• Server room temperature tracking</li>
              <li>• Greenhouse automation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Industrial Applications:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Manufacturing process control</li>
              <li>• Storage facility monitoring</li>
              <li>• Laboratory conditions</li>
              <li>• HVAC system feedback</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};