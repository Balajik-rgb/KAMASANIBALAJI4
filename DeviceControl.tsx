import React, { useState } from 'react';
import { Lightbulb, Wind, Tv, Zap, Bluetooth, BluetoothOff } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  status: boolean;
  room: string;
  color: string;
}

export const DeviceControl = () => {
  const [bluetoothConnected, setBluetoothConnected] = useState(false);
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Living Room Light', type: 'light', icon: Lightbulb, status: false, room: 'Living Room', color: 'bg-yellow-500' },
    { id: '2', name: 'Bedroom Fan', type: 'fan', icon: Wind, status: false, room: 'Bedroom', color: 'bg-blue-500' },
    { id: '3', name: 'Kitchen Light', type: 'light', icon: Lightbulb, status: false, room: 'Kitchen', color: 'bg-yellow-500' },
    { id: '4', name: 'TV', type: 'tv', icon: Tv, status: false, room: 'Living Room', color: 'bg-purple-500' },
  ]);

  const toggleDevice = (id: string) => {
    if (!bluetoothConnected) {
      alert('Please connect to Bluetooth first!');
      return;
    }
    
    setDevices(prev => 
      prev.map(device => 
        device.id === id ? { ...device, status: !device.status } : device
      )
    );
  };

  const toggleBluetooth = () => {
    setBluetoothConnected(!bluetoothConnected);
  };

  const toggleAllDevices = (on: boolean) => {
    if (!bluetoothConnected) {
      alert('Please connect to Bluetooth first!');
      return;
    }
    
    setDevices(prev => 
      prev.map(device => ({ ...device, status: on }))
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Device Control</h2>
        <button
          onClick={toggleBluetooth}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            bluetoothConnected 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          {bluetoothConnected ? <Bluetooth size={20} /> : <BluetoothOff size={20} />}
          <span>{bluetoothConnected ? 'Connected' : 'Disconnected'}</span>
        </button>
      </div>

      {/* Master Controls */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => toggleAllDevices(true)}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          disabled={!bluetoothConnected}
        >
          Turn All ON
        </button>
        <button
          onClick={() => toggleAllDevices(false)}
          className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          disabled={!bluetoothConnected}
        >
          Turn All OFF
        </button>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.map((device) => {
          const IconComponent = device.icon;
          return (
            <div
              key={device.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                device.status 
                  ? `${device.color} text-white border-transparent shadow-lg` 
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleDevice(device.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <IconComponent size={24} className={device.status ? 'text-white' : 'text-gray-600'} />
                  <div>
                    <h3 className="font-semibold">{device.name}</h3>
                    <p className={`text-sm ${device.status ? 'text-white/80' : 'text-gray-500'}`}>
                      {device.room}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap size={16} className={device.status ? 'text-white' : 'text-gray-400'} />
                  <span className={`text-sm font-medium ${device.status ? 'text-white' : 'text-gray-500'}`}>
                    {device.status ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connection Status */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${bluetoothConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium text-gray-700">
            {bluetoothConnected ? 'Connected to ESP32 Home Controller' : 'Disconnected from ESP32'}
          </span>
        </div>
      </div>
    </div>
  );
};