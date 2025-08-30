import React, { useState, useEffect } from 'react';
import MapView from '../MapView';
import AlertList from '../AlertList';
import { apiService } from '../../services/api';

const FisherfolkDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [tideData, setTideData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentLocation, setCurrentLocation] = useState('kandla');

  useEffect(() => {
    fetchData();
  }, [currentLocation]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDataForLocation(currentLocation);
      
      if (data.data) {
        setWeatherData(data.data.weather);
        setTideData(data.data.tide);
        setError(null);
      }
      
      const alertsRes = await apiService.getAlerts();
      setAlerts(alertsRes.alerts || []);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Fishing Overview', icon: '🐟', description: 'Daily fishing conditions' },
    { id: 'safety', name: 'Safety', icon: '🛟', description: 'Weather and sea conditions' },
    { id: 'resources', name: 'Resources', icon: '🌊', description: 'Marine resources info' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Fishing Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-5xl">🐟</div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {weatherData?.city_name || 'Kandla, Gujarat'}
                    </h2>
                    <p className="text-xl text-gray-600 font-medium">
                      Fisherfolk Daily Fishing Center
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Fishing conditions good</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Safety alerts active</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-6xl font-bold text-blue-600 mb-2">
                    {weatherData?.temperature ? `${weatherData.temperature}°C` : '--'}
                  </div>
                  <div className="text-lg text-gray-600 font-medium">
                    {weatherData?.description || 'Loading weather data...'}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Fishing Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Fishing Vessels Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-4xl mb-4">🚢</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">45</div>
                <div className="text-gray-600 font-medium mb-4">Active Vessels</div>
                <div className="text-sm text-gray-500">
                  Currently at sea
                </div>
              </div>

              {/* Fish Catch Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 border-l-green-500">
                <div className="text-4xl mb-4">🐟</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">2.8T</div>
                <div className="text-gray-600 font-medium mb-4">Daily Catch</div>
                <div className="text-sm text-gray-500">
                  Average per vessel
                </div>
              </div>

              {/* Market Price Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 border-l-blue-500">
                <div className="text-4xl mb-4">💰</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">₹180</div>
                <div className="text-gray-600 font-medium mb-4">Per KG</div>
                <div className="text-sm text-gray-500">
                  Current market rate
                </div>
              </div>

              {/* Safety Rating Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 border-l-teal-500">
                <div className="text-4xl mb-4">🛟</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">Good</div>
                <div className="text-gray-600 font-medium mb-4">Safety Rating</div>
                <div className="text-sm text-gray-500">
                  Sea conditions favorable
                </div>
              </div>
            </div>

            {/* Map and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">🗺️ Fishing Zone Map</h3>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {currentLocation.toUpperCase()}
                  </div>
                </div>
                <div className="h-[400px] relative">
                  <MapView 
                    weatherData={weatherData} 
                    tideData={tideData} 
                    alerts={alerts} 
                    currentLocation={currentLocation} 
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">🚨 Fishing Alerts</h3>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {alerts?.length || 0} Active
                  </div>
                </div>
                <AlertList alerts={alerts} />
              </div>
            </div>

            {/* Fishing Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🌤️ Weather Conditions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wind Speed:</span>
                    <span className="font-medium">{weatherData?.wind_speed ? `${weatherData.wind_speed} m/s` : '--'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visibility:</span>
                    <span className="font-medium text-green-600">Good (8km)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pressure:</span>
                    <span className="font-medium">{weatherData?.pressure ? `${weatherData.pressure} hPa` : '--'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Humidity:</span>
                    <span className="font-medium">{weatherData?.humidity ? `${weatherData.humidity}%` : '--'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🌊 Sea Conditions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wave Height:</span>
                    <span className="font-medium">0.8m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Speed:</span>
                    <span className="font-medium">0.5 m/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tide Height:</span>
                    <span className="font-medium">{tideData?.tide_height ? `${tideData.tide_height}m` : '--'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sea Temperature:</span>
                    <span className="font-medium">28.5°C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'safety':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🛟 Fishing Safety & Sea Conditions</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🌊 Sea Safety Status</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Wave Conditions</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Safe</span>
                    </div>
                    <p className="text-sm text-gray-600">Waves under 1m, suitable for fishing</p>
                    <div className="text-xs text-gray-500 mt-2">Current: 0.8m • Warning: >2m</div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Wind Conditions</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Safe</span>
                    </div>
                    <p className="text-sm text-gray-600">Light winds, good for navigation</p>
                    <div className="text-xs text-gray-500 mt-2">Current: 8 m/s • Warning: >15 m/s</div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Visibility</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Good</span>
                    </div>
                    <p className="text-sm text-gray-600">Clear visibility for safe navigation</p>
                    <div className="text-xs text-gray-500 mt-2">Current: 8km • Warning: &lt;2km</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🚨 Safety Alerts</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Storm Warning</h4>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Active</span>
                    </div>
                    <p className="text-sm text-gray-600">Cyclone approaching in 24 hours</p>
                    <div className="text-xs text-gray-500 mt-2">Return to port immediately</div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">High Tide Alert</h4>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Warning</span>
                    </div>
                    <p className="text-sm text-gray-600">High tide expected in 2 hours</p>
                    <div className="text-xs text-gray-500 mt-2">Avoid shallow waters</div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Fog Alert</h4>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Caution</span>
                    </div>
                    <p className="text-sm text-gray-600">Reduced visibility expected</p>
                    <div className="text-xs text-gray-500 mt-2">Use navigation lights</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Guidelines */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">📋 Safety Guidelines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-sm text-blue-700">
                  <h4 className="font-medium mb-2">Before Departure:</h4>
                  <ul className="space-y-1">
                    <li>• Check weather forecast</li>
                    <li>• Verify safety equipment</li>
                    <li>• Inform family of route</li>
                    <li>• Check fuel and supplies</li>
                  </ul>
                </div>
                <div className="text-sm text-blue-700">
                  <h4 className="font-medium mb-2">At Sea:</h4>
                  <ul className="space-y-1">
                    <li>• Monitor weather updates</li>
                    <li>• Stay in communication</li>
                    <li>• Follow safety protocols</li>
                    <li>• Return if conditions worsen</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'resources':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🌊 Marine Resources & Fishing Zones</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🐟 Fish Species & Availability</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Pomfret (Pomfret)</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Abundant</span>
                    </div>
                    <p className="text-sm text-gray-600">Best season: Oct-Mar</p>
                    <div className="text-xs text-gray-500 mt-2">Price: ₹200-300/kg • Catch: 15-20kg/day</div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Bombay Duck (Bombil)</h4>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Moderate</span>
                    </div>
                    <p className="text-sm text-gray-600">Best season: Jun-Sep</p>
                    <div className="text-xs text-gray-500 mt-2">Price: ₹80-120/kg • Catch: 25-30kg/day</div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Prawns (Jhinga)</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Abundant</span>
                    </div>
                    <p className="text-sm text-gray-600">Best season: Year-round</p>
                    <div className="text-xs text-gray-500 mt-2">Price: ₹400-600/kg • Catch: 8-12kg/day</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🗺️ Fishing Zones</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Zone A - Near Shore</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Open</span>
                    </div>
                    <p className="text-sm text-gray-600">0-5 km from coast</p>
                    <div className="text-xs text-gray-500 mt-2">Best for: Small boats, daily fishing</div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Zone B - Mid Waters</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Open</span>
                    </div>
                    <p className="text-sm text-gray-600">5-15 km from coast</p>
                    <div className="text-xs text-gray-500 mt-2">Best for: Medium vessels, deep sea fish</div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Zone C - Deep Waters</h4>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Restricted</span>
                    </div>
                    <p className="text-sm text-gray-600">15+ km from coast</p>
                    <div className="text-xs text-gray-500 mt-2">Best for: Large vessels, tuna, mackerel</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Information */}
            <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-4">🏪 Market Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">🕐</div>
                  <h4 className="font-medium text-green-800">Market Hours</h4>
                  <p className="text-sm text-green-700">4:00 AM - 8:00 PM</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">📊</div>
                  <h4 className="font-medium text-green-800">Daily Demand</h4>
                  <p className="text-sm text-green-700">High (Weekends)</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🚚</div>
                  <h4 className="font-medium text-green-800">Transport</h4>
                  <p className="text-sm text-green-700">Ice trucks available</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>{tab.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{tab.name}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading fishing data...</p>
        </div>
      ) : (
        renderTabContent()
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default FisherfolkDashboard;
