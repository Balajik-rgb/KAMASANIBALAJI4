import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Activity, CheckCircle, XCircle } from 'lucide-react';

interface Command {
  phrase: string;
  action: string;
  device: string;
  confidence: number;
  timestamp: Date;
}

interface Device {
  id: string;
  name: string;
  status: boolean;
  type: string;
}

export const SpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<Command[]>([]);
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Living Room Light', status: false, type: 'light' },
    { id: '2', name: 'Bedroom Fan', status: false, type: 'fan' },
    { id: '3', name: 'Kitchen Light', status: false, type: 'light' },
    { id: '4', name: 'Air Conditioner', status: false, type: 'ac' },
    { id: '5', name: 'TV', status: false, type: 'tv' },
    { id: '6', name: 'Music System', status: false, type: 'audio' }
  ]);
  
  const recognitionRef = useRef<any>(null);
  const [feedback, setFeedback] = useState('');
  const [processingCommand, setProcessingCommand] = useState(false);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      // Configure speech recognition
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            setCurrentCommand(transcript);
          }
        }
        
        if (finalTranscript) {
          processCommand(finalTranscript, event.results[event.results.length - 1][0].confidence);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setFeedback(`Error: ${event.error}`);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        setCurrentCommand('');
      };
    }
  }, []);

  const processCommand = (transcript: string, confidence: number) => {
    setProcessingCommand(true);
    const command = transcript.toLowerCase().trim();
    setCurrentCommand(command);
    
    // Command parsing logic
    let action = '';
    let deviceName = '';
    let success = false;
    
    // Parse turn on/off commands
    if (command.includes('turn on') || command.includes('switch on')) {
      action = 'turn_on';
    } else if (command.includes('turn off') || command.includes('switch off')) {
      action = 'turn_off';
    } else if (command.includes('toggle')) {
      action = 'toggle';
    }
    
    // Device identification
    const deviceKeywords = {
      'light': ['light', 'lamp', 'bulb'],
      'fan': ['fan', 'ceiling fan'],
      'ac': ['air conditioner', 'ac', 'cooling'],
      'tv': ['tv', 'television', 'telly'],
      'audio': ['music', 'speaker', 'audio', 'sound']
    };
    
    // Room identification
    const roomKeywords = {
      'living room': ['living room', 'living', 'hall'],
      'bedroom': ['bedroom', 'bed room', 'room'],
      'kitchen': ['kitchen', 'dining']
    };
    
    // Find matching device
    for (const [deviceType, keywords] of Object.entries(deviceKeywords)) {
      for (const keyword of keywords) {
        if (command.includes(keyword)) {
          // Check for room specification
          for (const [room, roomWords] of Object.entries(roomKeywords)) {
            for (const roomWord of roomWords) {
              if (command.includes(roomWord)) {
                deviceName = `${room} ${deviceType}`;
                break;
              }
            }
            if (deviceName) break;
          }
          
          if (!deviceName) {
            deviceName = deviceType;
          }
          break;
        }
      }
      if (deviceName) break;
    }
    
    // Execute command
    if (action && deviceName) {
      const device = devices.find(d => 
        d.name.toLowerCase().includes(deviceName.toLowerCase()) ||
        d.type === deviceName
      );
      
      if (device) {
        setDevices(prev => prev.map(d => {
          if (d.id === device.id) {
            const newStatus = action === 'toggle' ? !d.status : action === 'turn_on';
            return { ...d, status: newStatus };
          }
          return d;
        }));
        
        success = true;
        setFeedback(`✓ ${device.name} ${action === 'turn_on' ? 'turned on' : action === 'turn_off' ? 'turned off' : 'toggled'}`);
      } else {
        setFeedback(`✗ Device "${deviceName}" not found`);
      }
    } else {
      setFeedback(`✗ Command not recognized: "${command}"`);
    }
    
    // Add to command history
    const newCommand: Command = {
      phrase: transcript,
      action: action || 'unknown',
      device: deviceName || 'unknown',
      confidence: confidence * 100,
      timestamp: new Date()
    };
    
    setCommandHistory(prev => [newCommand, ...prev.slice(0, 9)]);
    
    setTimeout(() => {
      setProcessingCommand(false);
      setCurrentCommand('');
    }, 1500);
  };

  const toggleListening = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in this browser');
      return;
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      setFeedback('Listening for commands...');
    }
  };

  const speakFeedback = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Speech Recognition Control</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isSupported ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isSupported ? 'Supported' : 'Not Supported'}
          </span>
        </div>
      </div>

      {/* Voice Control Interface */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
        <div className="text-center">
          <button
            onClick={toggleListening}
            disabled={!isSupported}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? (
              <MicOff size={32} className="text-white" />
            ) : (
              <Mic size={32} className="text-white" />
            )}
          </button>
          
          <div className="mt-4">
            <p className="text-lg font-semibold text-gray-800">
              {isListening ? 'Listening...' : 'Click to Start Voice Control'}
            </p>
            
            {currentCommand && (
              <div className="mt-2 p-3 bg-white rounded-lg shadow">
                <p className="text-sm text-gray-600">Heard:</p>
                <p className="font-medium text-gray-800">"{currentCommand}"</p>
                {processingCommand && (
                  <div className="flex items-center justify-center mt-2">
                    <Activity className="animate-spin text-blue-500" size={16} />
                    <span className="ml-2 text-sm text-blue-600">Processing...</span>
                  </div>
                )}
              </div>
            )}
            
            {feedback && (
              <div className="mt-2 p-3 bg-white rounded-lg shadow">
                <p className="text-sm font-medium text-gray-800">{feedback}</p>
                <button
                  onClick={() => speakFeedback(feedback)}
                  className="mt-1 text-xs text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Volume2 size={12} className="mr-1" />
                  Speak Response
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Device Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {devices.map((device) => (
          <div
            key={device.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              device.status 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{device.name}</h3>
                <p className="text-sm opacity-75">{device.type}</p>
              </div>
              <div className="flex items-center space-x-2">
                {device.status ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <XCircle className="text-gray-400" size={20} />
                )}
                <span className="text-sm font-medium">
                  {device.status ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Command History */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Recent Commands</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {commandHistory.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No commands yet</p>
          ) : (
            commandHistory.map((cmd, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">"{cmd.phrase}"</p>
                    <p className="text-xs text-gray-600">
                      Action: {cmd.action} | Device: {cmd.device}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {cmd.confidence.toFixed(0)}% confidence
                    </p>
                    <p className="text-xs text-gray-500">
                      {cmd.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Voice Commands Help */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Supported Voice Commands:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-medium mb-1">Basic Commands:</h4>
            <ul className="space-y-1">
              <li>• "Turn on living room light"</li>
              <li>• "Switch off bedroom fan"</li>
              <li>• "Toggle kitchen light"</li>
              <li>• "Turn on air conditioner"</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-1">Device Types:</h4>
            <ul className="space-y-1">
              <li>• Lights (light, lamp, bulb)</li>
              <li>• Fans (fan, ceiling fan)</li>
              <li>• AC (air conditioner, ac, cooling)</li>
              <li>• TV (tv, television)</li>
              <li>• Audio (music, speaker, sound)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};