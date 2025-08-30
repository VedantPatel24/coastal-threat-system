import React, { useState, useEffect } from 'react';
import MapView from '../MapView';
import AlertList from '../AlertList';
import { apiService } from '../../services/api';

const EnvironmentalNGODashboard = () => {
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
    { id: 'overview', name: 'Environmental Overview', icon: '🌱', description: 'Ecosystem monitoring' },
    { id: 'conservation', name: 'Conservation', icon: '🦅', description: 'Wildlife and habitat status' },
    { id: 'pollution', name: 'Pollution', icon: '🚨', description: 'Environmental threats' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Environmental Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-5xl">🌱</div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {weatherData?.city_name || 'Kandla, Gujarat'}
                    </h2>
                    <p className="text-xl text-gray-600 font-medium">
                      Environmental NGO Monitoring Center
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Ecosystem monitoring active</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Conservation programs running</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-6xl font-bold text-green-600 mb-2">
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

            {/* Environmental Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Marine Life Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-4xl mb-4">🐠</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">156</div>
                <div className="text-gray-600 font-medium mb-4">Marine Species</div>
                <div className="text-sm text-gray-500">
                  Documented in coastal waters
                </div>
              </div>

              {/* Mangrove Coverage Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 border-l-green-500">
                <div className="text-4xl mb-4">🌿</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">2.3K</div>
                <div className="text-gray-600 font-medium mb-4">Hectares Mangrove</div>
                <div className="text-sm text-gray-500">
                  Blue carbon storage
                </div>
              </div>

              {/* Bird Species Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 border-l-blue-500">
                <div className="text-4xl mb-4">🦅</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">89</div>
                <div className="text-gray-600 font-medium mb-4">Bird Species</div>
                <div className="text-sm text-gray-500">
                  Including migratory birds
                </div>
              </div>

              {/* Water Quality Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 border-l-teal-500">
                <div className="text-4xl mb-4">💧</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">Good</div>
                <div className="text-gray-600 font-medium mb-4">Water Quality</div>
                <div className="text-sm text-gray-500">
                  pH: 7.2, DO: 8.5 mg/L
                </div>
              </div>
            </div>

            {/* Map and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">🗺️ Environmental Map</h3>
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
                  <h3 className="text-xl font-semibold text-gray-900">🚨 Environmental Alerts</h3>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {alerts?.length || 0} Active
                  </div>
                </div>
                <AlertList alerts={alerts} />
              </div>
            </div>

            {/* Environmental Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🌤️ Environmental Conditions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Air Quality:</span>
                    <span className="font-medium text-green-600">Good (AQI: 45)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">UV Index:</span>
                    <span className="font-medium text-yellow-600">Moderate (5.2)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wind Speed:</span>
                    <span className="font-medium">{weatherData?.wind_speed ? `${weatherData.wind_speed} m/s` : '--'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Humidity:</span>
                    <span className="font-medium">{weatherData?.humidity ? `${weatherData.humidity}%` : '--'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🌊 Marine Conditions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sea Temperature:</span>
                    <span className="font-medium">28.5°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salinity:</span>
                    <span className="font-medium">35 ppt</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tide Height:</span>
                    <span className="font-medium">{tideData?.tide_height ? `${tideData.tide_height}m` : '--'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wave Height:</span>
                    <span className="font-medium">0.8m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'conservation':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🦅 Conservation Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Conservation items */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">🐢 Olive Ridley Turtles</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Protected</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">Nesting season monitoring</p>
                <div className="text-xs text-gray-500">
                  Population: Stable<br/>
                  Threats: Fishing nets, pollution
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">🌿 Mangrove Forests</h3>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Restoration</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">Coastal protection ecosystem</p>
                <div className="text-xs text-gray-500">
                  Coverage: 2,300 hectares<br/>
                  Restoration: 150 hectares/year
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">🦀 Horseshoe Crabs</h3>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Endangered</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">Ancient marine species</p>
                <div className="text-xs text-gray-500">
                  Population: Declining<br/>
                  Threats: Habitat loss, harvesting
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">🐬 Indo-Pacific Dolphins</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Stable</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">Coastal dolphin population</p>
                <div className="text-xs text-gray-500">
                  Population: 45 individuals<br/>
                  Threats: Boat traffic, pollution
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">🦅 Osprey Eagles</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Protected</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">Fish-eating raptors</p>
                <div className="text-xs text-gray-500">
                  Population: 12 breeding pairs<br/>
                  Threats: Habitat disturbance
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">🌊 Seagrass Beds</h3>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Declining</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">Underwater meadows</p>
                <div className="text-xs text-gray-500">
                  Coverage: 800 hectares<br/>
                  Threats: Dredging, pollution
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'pollution':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🚨 Environmental Threats & Pollution</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🌊 Marine Pollution</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Plastic Waste</h4>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">High</span>
                    </div>
                    <p className="text-sm text-gray-600">Microplastics in coastal waters</p>
                    <div className="text-xs text-gray-500 mt-2">Level: 15 particles/L • Trend: Increasing</div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Oil Spills</h4>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Moderate</span>
                    </div>
                    <p className="text-sm text-gray-600">Port operations contamination</p>
                    <div className="text-xs text-gray-500 mt-2">Level: 2 incidents/month • Trend: Stable</div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Chemical Runoff</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Low</span>
                    </div>
                    <p className="text-sm text-gray-600">Agricultural and industrial waste</p>
                    <div className="text-xs text-gray-500 mt-2">Level: 0.5 mg/L • Trend: Decreasing</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🌱 Habitat Destruction</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Mangrove Clearing</h4>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Critical</span>
                    </div>
                    <p className="text-sm text-gray-600">Development and aquaculture</p>
                    <div className="text-xs text-gray-500 mt-2">Loss: 50 hectares/year • Impact: High</div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Beach Erosion</h4>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Moderate</span>
                    </div>
                    <p className="text-sm text-gray-600">Coastal development impact</p>
                    <div className="text-xs text-gray-500 mt-2">Rate: 2m/year • Impact: Medium</div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Overfishing</h4>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">High</span>
                    </div>
                    <p className="text-sm text-gray-600">Unsustainable fishing practices</p>
                    <div className="text-xs text-gray-500 mt-2">Impact: 40% species decline • Trend: Worsening</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conservation Actions */}
            <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-4">🌱 Active Conservation Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">🌿</div>
                  <h4 className="font-medium text-green-800">Mangrove Restoration</h4>
                  <p className="text-sm text-green-700">150 hectares planted this year</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🐢</div>
                  <h4 className="font-medium text-green-800">Turtle Protection</h4>
                  <p className="text-sm text-green-700">24/7 nesting beach monitoring</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🧹</div>
                  <h4 className="font-medium text-green-800">Beach Cleanup</h4>
                  <p className="text-sm text-green-700">Weekly coastal cleanup drives</p>
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
                  ? 'bg-white text-green-600 shadow-sm'
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading environmental data...</p>
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

export default EnvironmentalNGODashboard;
