import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const LocationSelector = ({ onLocationChange, currentLocation = "kandla", onStartMonitoring, onStopMonitoring, isMonitoring }) => {
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);

  // Predefined Gujarat coastal cities
  const gujaratCoastalCities = [
    { id: "kandla", name: "Kandla, Gujarat", flag: "🇮🇳", port_type: "Major Port", description: "India's largest port by volume" },
    { id: "mundra", name: "Mundra, Gujarat", flag: "🇮🇳", port_type: "Private Port", description: "Major coal and container terminal" },
    { id: "bhavnagar", name: "Bhavnagar, Gujarat", flag: "🇮🇳", port_type: "Minor Port", description: "Salt production and fishing" },
    { id: "surat", name: "Surat, Gujarat", flag: "🇮🇳", port_type: "Minor Port", description: "Diamond industry and textiles" },
    { id: "bharuch", name: "Bharuch, Gujarat", flag: "🇮🇳", port_type: "Minor Port", description: "Chemical industry hub" },
    { id: "veraval", name: "Veraval, Gujarat", flag: "🇮🇳", port_type: "Fishing Port", description: "Major fishing harbor" },
    { id: "porbandar", name: "Porbandar, Gujarat", flag: "🇮🇳", port_type: "Minor Port", description: "Birthplace of Mahatma Gandhi" },
    { id: "okha", name: "Okha, Gujarat", flag: "🇮🇳", port_type: "Minor Port", description: "Gateway to Dwarka" },
    { id: "diu", name: "Diu, Gujarat", flag: "🇮🇳", port_type: "Tourist Port", description: "Union Territory beach tourism" },
    { id: "ghogha", name: "Ghogha, Gujarat", flag: "🇮🇳", port_type: "Minor Port", description: "Ferry service to Bhavnagar" }
  ];

  const handleLocationChange = (locationId) => {
    setSelectedLocation(locationId);
    onLocationChange(locationId);
    // Note: Monitoring state is managed by parent Dashboard component
    
    // Log location change
    const selectedCity = gujaratCoastalCities.find(city => city.id === locationId);
    console.log('');
    console.log('📍 LOCATION CHANGED!');
    console.log('='.repeat(40));
    console.log(`🏙️ City: ${selectedCity?.name || locationId}`);
    console.log(`🏗️ Port Type: ${selectedCity?.port_type || 'N/A'}`);
    console.log(`📝 Description: ${selectedCity?.description || 'N/A'}`);
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
    console.log('='.repeat(40));
  };

  const startMonitoring = () => {
    // Trigger the API call to start monitoring the selected location
    onStartMonitoring();
    console.log('');
    console.log('🚀 MONITORING STARTED!');
    console.log('='.repeat(50));
    console.log(`📍 Location: ${selectedLocation.toUpperCase()}`);
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
    console.log(`🔄 Status: Active monitoring`);
    console.log('='.repeat(50));
  };

  const stopMonitoring = () => {
    onStopMonitoring();
    console.log('');
    console.log('⏹️ MONITORING STOPPED!');
    console.log('='.repeat(50));
    console.log(`📍 Location: ${selectedLocation.toUpperCase()}`);
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
    console.log(`🔄 Status: Monitoring stopped`);
    console.log('='.repeat(50));
  };

  return (
    <div className="pro-card p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        🌊 Gujarat Coastal Monitoring
      </h3>
      
      <div className="space-y-4">
        {/* Location Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Coastal Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {gujaratCoastalCities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name} - {city.port_type}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Location Info */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-3">Current Location</h4>
          {(() => {
            const selectedCity = gujaratCoastalCities.find(city => city.id === selectedLocation);
            return (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{selectedCity.flag}</span>
                  <div>
                    <h5 className="font-semibold text-blue-900">{selectedCity.name}</h5>
                    <p className="text-sm text-blue-700">{selectedCity.port_type}</p>
                    <p className="text-xs text-blue-600 mt-1">{selectedCity.description}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Monitoring Control */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-3">Monitoring Control</h4>
          <div className="flex space-x-3">
            {!isMonitoring ? (
              <button
                onClick={startMonitoring}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span className="text-lg">🚀</span>
                <span>Start Monitoring</span>
              </button>
            ) : (
              <button
                onClick={stopMonitoring}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span className="text-lg">⏹️</span>
                <span>Stop Monitoring</span>
              </button>
            )}
          </div>
          
          {/* Monitoring Status */}
          <div className={`mt-3 p-3 rounded-lg border ${
            isMonitoring 
              ? 'bg-green-50 border-green-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}></div>
              <span className={`text-sm font-medium ${
                isMonitoring ? 'text-green-800' : 'text-gray-600'
              }`}>
                {isMonitoring 
                  ? `🟢 Actively monitoring ${gujaratCoastalCities.find(city => city.id === selectedLocation)?.name}`
                  : '⚪ Monitoring not started'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Location Grid for Quick Selection */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Quick Select</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {gujaratCoastalCities.map((city) => (
              <button
                key={city.id}
                onClick={() => handleLocationChange(city.id)}
                className={`text-left p-3 rounded-lg border transition-colors ${
                  selectedLocation === city.id
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{city.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{city.name.split(',')[0]}</div>
                    <div className="text-xs text-gray-500">{city.port_type}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="text-xs text-gray-500 text-center pt-4 border-t">
          <p>🌊 Monitor coastal threats for Gujarat's 1,600+ km coastline</p>
          <p>🏭 Covering major ports, private ports, and fishing harbors</p>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
