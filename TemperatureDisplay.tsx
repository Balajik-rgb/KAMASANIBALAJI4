import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TemperatureReading {
  temperature: number;
  humidity: number;
  timestamp: Date;
}

export const TemperatureDisplay = () => {
  const [currentReading, setCurrentReading] = useState<TemperatureReading>({
    temperature: 24.5,
    humidity: 65.2,
    timestamp: new Date()
  });
  
  const [readings, setReadings] = useState<TemperatureReading[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Simulate real-time temperature readings
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const newReading: TemperatureReading = {
        temperature: 20 + Math.random() * 15 + Math.sin(Date.now() / 10000) * 5,
        humidity: 40 + Math.random() * 40 + Math.cos(Date.now() / 8000) * 10,
        timestamp: new Date()
      };
      
      setCurrentReading(newReading);
      setReadings(prev => [...prev.slice(-19), newReading]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getTempTrend = () => {
    if (readings.length < 2) return 'stable';
    const current = readings[readings.length - 1]?.temperature || 0;
    const previous = readings[readings.length - 2]?.temperature || 0;
    const diff = current - previous;
    
    if (diff > 0.5) return 'rising';
    if (diff < -0.5) return 'falling';
    return 'stable';
  };

  const getTrendIcon = () => {
    const trend = getTempTrend();
    switch (trend) {
      case 'rising': return <TrendingUp className="text-red-500" size={20} />;
      case 'falling': return <TrendingDown className="text-blue-500" size={20} />;
      default: return <Minus className="text-gray-500" size={20} />;
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 15) return 'text-blue-600';
    if (temp < 25) return 'text-green-600';
    if (temp < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHumidityColor = (humidity: number) => {
    if (humidity < 30) return 'text-orange-600';
    if (humidity < 70) return 'text-green-600';
    return 'text-blue-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Temperature Monitor</h2>
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            isMonitoring 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
      </div>

      {/* Current Readings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Temperature Card */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 border border-red-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500 p-3 rounded-lg">
                <Thermometer className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Temperature</h3>
                <p className="text-sm text-gray-600">Current Reading</p>
              </div>
            </div>
            {getTrendIcon()}
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${getTemperatureColor(currentReading.temperature)}`}>
              {currentReading.temperature.toFixed(1)}°C
            </div>
            <div className="text-sm text-gray-600">
              {(currentReading.temperature * 9/5 + 32).toFixed(1)}°F
            </div>
          </div>
        </div>

        {/* Humidity Card */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Droplets className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Humidity</h3>
                <p className="text-sm text-gray-600">Relative Humidity</p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${getHumidityColor(currentReading.humidity)}`}>
              {currentReading.humidity.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">
              RH at {currentReading.temperature.toFixed(1)}°C
            </div>
          </div>
        </div>
      </div>

      {/* LCD Display Simulation */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <h3 className="text-white font-semibold mb-4 flex items-center">
          <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
          LCD Display (16x2)
        </h3>
        <div className="bg-green-400 text-black p-4 rounded font-mono text-lg leading-relaxed">
          <div className="grid grid-cols-16 gap-1">
            {/* Line 1: Temperature */}
            <div className="col-span-16 border-b border-green-600 pb-1">
              Temp: {currentReading.temperature.toFixed(1)}°C
            </div>
            {/* Line 2: Humidity */}
            <div className="col-span-16 pt-1">
              Humidity: {currentReading.humidity.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Serial Monitor Simulation */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <h3 className="text-white font-semibold mb-4 flex items-center">
          <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
          Serial Monitor Output
        </h3>
        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-64 overflow-y-auto">
          <div className="text-yellow-400 mb-2">DHT22 Temperature & Humidity Sensor</div>
          <div className="text-cyan-400 mb-2">Initializing sensor...</div>
          <div className="text-green-400 mb-4">Sensor ready!</div>
          
          {readings.slice(-10).map((reading, index) => (
            <div key={index} className="mb-1">
              <span className="text-gray-400">
                [{reading.timestamp.toLocaleTimeString()}]
              </span>
              <span className="text-white ml-2">
                Temperature: {reading.temperature.toFixed(2)}°C, 
                Humidity: {reading.humidity.toFixed(2)}%
              </span>
            </div>
          ))}
          
          {isMonitoring && (
            <div className="text-green-400 animate-pulse">
              Reading sensor data...
            </div>
          )}
        </div>
      </div>

      {/* Status Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock size={16} className="text-gray-600" />
            <span className="font-semibold text-gray-800">Last Update</span>
          </div>
          <p className="text-sm text-gray-600">
            {currentReading.timestamp.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-semibold text-gray-800">Status</span>
          </div>
          <p className="text-sm text-gray-600">
            {isMonitoring ? 'Monitoring Active' : 'Monitoring Stopped'}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="font-semibold text-gray-800">Readings</span>
          </div>
          <p className="text-sm text-gray-600">
            {readings.length} data points
          </p>
        </div>
      </div>
    </div>
  );
};