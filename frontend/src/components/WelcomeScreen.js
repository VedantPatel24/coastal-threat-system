import React from 'react';

const WelcomeScreen = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-12">
          <div className="text-8xl mb-6">🌊</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Coastal Threat Alert System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-Powered Gujarat Coastal Monitoring & Early Warning System
          </p>
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="pro-card p-6 text-center">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose Location</h3>
            <p className="text-gray-600">
              Select any Gujarat coastal city or enter custom coordinates within Gujarat region
            </p>
          </div>
          
          <div className="pro-card p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Monitor Data</h3>
            <p className="text-gray-600">
              View real-time weather, tide, ocean, and pollution data
            </p>
          </div>
          
          <div className="pro-card p-6 text-center">
            <div className="text-4xl mb-4">🚨</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Get Alerts</h3>
            <p className="text-gray-600">
              Receive instant warnings about coastal threats and risks
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="pro-card p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">What You Can Monitor</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🌤️</div>
              <div className="font-semibold text-gray-800">Weather</div>
              <div className="text-sm text-gray-600">Temperature, wind, pressure</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌊</div>
              <div className="font-semibold text-gray-800">Tides</div>
              <div className="text-sm text-gray-600">Height, timing, changes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌊</div>
              <div className="font-semibold text-gray-800">Ocean</div>
              <div className="text-sm text-gray-600">Waves, currents, temperature</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🚨</div>
              <div className="font-semibold text-gray-800">Pollution</div>
              <div className="text-sm text-gray-600">Water quality, alerts</div>
            </div>
          </div>
        </div>

        {/* Available Cities */}
        <div className="pro-card p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Gujarat Coastal Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "Kandla, Gujarat", flag: "🇮🇳", port_type: "Major Port" },
              { name: "Mundra, Gujarat", flag: "🇮🇳", port_type: "Private Port" },
              { name: "Bhavnagar, Gujarat", flag: "🇮🇳", port_type: "Minor Port" },
              { name: "Surat, Gujarat", flag: "🇮🇳", port_type: "Minor Port" },
              { name: "Bharuch, Gujarat", flag: "🇮🇳", port_type: "Minor Port" },
              { name: "Veraval, Gujarat", flag: "🇮🇳", port_type: "Fishing Port" },
              { name: "Porbandar, Gujarat", flag: "🇮🇳", port_type: "Minor Port" },
              { name: "Okha, Gujarat", flag: "🇮🇳", port_type: "Minor Port" },
              { name: "Diu, Gujarat", flag: "🇮🇳", port_type: "Tourist Port" },
              { name: "Ghogha, Gujarat", flag: "🇮🇳", port_type: "Minor Port" }
            ].map((city, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">{city.flag}</div>
                <div className="text-sm font-medium text-gray-800">{city.name}</div>
                <div className="text-xs text-gray-600">{city.port_type}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Get Started Button */}
        <div className="mb-8">
          <button
            onClick={onGetStarted}
            className="btn-primary text-xl px-12 py-4 text-lg"
          >
            🚀 Get Started - Monitor Coastal Threats
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-gray-500 text-sm">
          <p>Built for HackOut'25 • Team Titans • Protecting Gujarat's Coastal Communities</p>
          <p className="mt-2">No technical knowledge required • Simple and intuitive interface</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
