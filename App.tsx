import React from 'react';
import { Mic, Activity, Brain } from 'lucide-react';
import { SpeechRecognition } from './components/SpeechRecognition';
import { SystemArchitecture } from './components/SystemArchitecture';
import { CodeImplementation } from './components/CodeImplementation';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Mic size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Speech Recognition Control System</h1>
                <p className="text-sm text-gray-600">Voice-Controlled Home Automation with Embedded Board</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Brain size={16} />
              <span>AI Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Live Speech Recognition Demo */}
          <SpeechRecognition />

          {/* System Architecture */}
          <SystemArchitecture />

          {/* Code Implementation */}
          <CodeImplementation />

          {/* Completion Certificate Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-lg p-8 border border-purple-200">
            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                🎓 Internship Project Complete
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                This speech recognition control system demonstrates advanced mastery of embedded systems, 
                AI integration, voice processing, and IoT device control. The project showcases complete 
                system design, multi-platform implementation, and real-time voice command processing.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow">
                  <div className="text-2xl font-bold text-purple-600">✓</div>
                  <div className="text-sm font-semibold text-gray-800">System Design</div>
                  <div className="text-xs text-gray-600">Complete architecture</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <div className="text-2xl font-bold text-blue-600">✓</div>
                  <div className="text-sm font-semibold text-gray-800">Code Implementation</div>
                  <div className="text-xs text-gray-600">Multi-platform support</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <div className="text-2xl font-bold text-green-600">✓</div>
                  <div className="text-sm font-semibold text-gray-800">Working Demo</div>
                  <div className="text-xs text-gray-600">Live voice control</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-purple-300">
                <h4 className="text-lg font-bold text-gray-800 mb-2">🏆 Project Achievements</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-purple-600">Speech Recognition</div>
                    <div className="text-gray-600">Real-time voice processing</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">Device Control</div>
                    <div className="text-gray-600">Multi-device automation</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">AI Integration</div>
                    <div className="text-gray-600">Natural language processing</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-orange-600">Web Interface</div>
                    <div className="text-gray-600">Remote monitoring</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">🌟 Advanced Features Implemented</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <ul className="space-y-1">
                      <li>• Real-time speech-to-text conversion</li>
                      <li>• Natural language command parsing</li>
                      <li>• Multi-platform embedded support</li>
                      <li>• Voice feedback system</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-1">
                      <li>• Web-based control interface</li>
                      <li>• Command history and analytics</li>
                      <li>• Confidence scoring system</li>
                      <li>• Scalable device management</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;