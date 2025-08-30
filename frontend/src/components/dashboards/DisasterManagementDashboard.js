import React, { useState, useEffect } from 'react';
import MapView from '../MapView';
import AlertList from '../AlertList';
import FloodAnalytics from '../FloodAnalytics';
import LocationSelector from '../LocationSelector';
import HelpTooltip from '../HelpTooltip';
import { apiService } from '../../services/api';

const DisasterManagementDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [tideData, setTideData] = useState(null);
  const [oceanData, setOceanData] = useState(null);
  const [floodPrediction, setFloodPrediction] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentLocation, setCurrentLocation] = useState('kandla');
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (isMonitoring) {
      fetchData();
      const interval = setInterval(fetchData, 60000);
      return () => clearInterval(interval);
    }
  }, [currentLocation, isMonitoring]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDataForLocation(currentLocation);
      
      if (data.data) {
        setWeatherData(data.data.weather);
        setTideData(data.data.tide);
        setOceanData(data.data.ocean);
        setError(null);
      }
      
      // Fetch flood prediction
      try {
        const floodRes = await apiService.getFloodPrediction(currentLocation);
        if (floodRes.status === 'success') {
          setFloodPrediction(floodRes.flood_prediction);
        }
      } catch (floodError) {
        console.error('Error fetching flood prediction:', floodError);
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

  const handleLocationChange = (newLocation) => {
    setCurrentLocation(newLocation);
    setWeatherData(null);
    setTideData(null);
    setOceanData(null);
    setFloodPrediction(null);
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    setLoading(true);
    setTimeout(() => {
      fetchData();
    }, 100);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    setWeatherData(null);
    setTideData(null);
    setOceanData(null);
    setFloodPrediction(null);
    setLoading(false);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊', description: 'Real-time coastal monitoring' },
    { id: 'flood-analytics', name: 'Flood Analytics', icon: '🌊', description: 'Comprehensive flood analysis' },
    { id: 'locations', name: 'Locations', icon: '🌊', description: 'Gujarat coastal cities' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Location Header Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-5xl">🌊</div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {weatherData?.city_name || 'Kandla, Gujarat'}
                    </h2>
                    <p className="text-xl text-gray-600 font-medium">
                      Disaster Management Monitoring Station
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Real-time monitoring active</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">AI threat detection enabled</span>
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

            {/* Map and Alerts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">🗺️ Coastal Threat Map</h3>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {currentLocation.toUpperCase()}
                  </div>
                </div>
                <div className="h-[500px] relative">
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
                  <h3 className="text-xl font-semibold text-gray-900">🚨 Active Alerts</h3>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {alerts?.length || 0} Active
                  </div>
                </div>
                <AlertList alerts={alerts} />
              </div>
            </div>

            {/* Data Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Weather Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-4xl mb-4">🌤️</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {weatherData?.temperature ? `${weatherData.temperature}°C` : '--'}
                </div>
                <div className="text-gray-600 font-medium mb-4">Temperature</div>
                <div className="space-y-2 text-sm text-gray-500">
                  <div>Humidity: {weatherData?.humidity ? `${weatherData.humidity}%` : '--'}</div>
                  <div>Wind: {weatherData?.wind_speed ? `${weatherData.wind_speed} m/s` : '--'}</div>
                  <div>Pressure: {weatherData?.pressure ? `${weatherData.pressure} hPa` : '--'}</div>
                </div>
              </div>

              {/* Tide Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 border-l-green-500">
                <div className="text-4xl mb-4">🌊</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {tideData?.tide_height ? `${tideData.tide_height}m` : '--'}
                </div>
                <div className="text-gray-600 font-medium mb-4">Tide Height</div>
                <div className="space-y-2 text-sm text-gray-500">
                  <div>Status: {tideData?.status || '--'}</div>
                  <div>High: {tideData?.high_tide ? `${tideData.high_tide}m` : '--'}</div>
                  <div>Low: {tideData?.low_tide ? `${tideData.low_tide}m` : '--'}</div>
                </div>
              </div>

              {/* Ocean Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 border-l-teal-500">
                <div className="text-4xl mb-4">🌊</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {oceanData?.wave_height ? `${oceanData.wave_height}m` : '--'}
                </div>
                <div className="text-gray-600 font-medium mb-4">Wave Height</div>
                <div className="space-y-2 text-sm text-gray-500">
                  <div>Current: {oceanData?.current_speed ? `${oceanData.current_speed} m/s` : '--'}</div>
                  <div>Temp: {oceanData?.sea_surface_temp ? `${oceanData.sea_surface_temp}°C` : '--'}</div>
                  <div>Period: {oceanData?.wave_period ? `${oceanData.wave_period}s` : '--'}</div>
                </div>
              </div>

              {/* Flood Prediction Card */}
              <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 ${
                floodPrediction?.risk_level === 'critical' ? 'border-l-red-500' : 
                floodPrediction?.risk_level === 'high' ? 'border-l-orange-500' : 
                floodPrediction?.risk_level === 'medium' ? 'border-l-yellow-500' : 
                'border-l-green-500'
              }`}>
                <div className="text-4xl mb-4">🌊</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {floodPrediction?.flood_probability ? `${floodPrediction.flood_probability}%` : '--'}
                </div>
                <div className="text-gray-600 font-medium mb-4">Flood Risk</div>
                <div className="space-y-2 text-sm text-gray-500">
                  <div>Level: {floodPrediction?.risk_level || '--'}</div>
                  <div>Confidence: {floodPrediction?.confidence ? `${floodPrediction.confidence}%` : '--'}</div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'flood-analytics':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <FloodAnalytics />
          </div>
        );
      
      case 'locations':
        return (
          <LocationSelector 
            onLocationChange={handleLocationChange} 
            currentLocation={currentLocation}
            onStartMonitoring={startMonitoring}
            onStopMonitoring={stopMonitoring}
            isMonitoring={isMonitoring}
          />
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
      {!isMonitoring && activeTab === 'overview' ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⏸️</div>
          <p className="text-xl text-gray-600 mb-2">Monitoring Not Started</p>
          <p className="text-gray-500">Go to Locations tab and click "Start Monitoring" to begin</p>
        </div>
      ) : loading && activeTab === 'overview' ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading coastal monitoring data...</p>
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

export default DisasterManagementDashboard;
