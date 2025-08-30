import React, { useState, useEffect } from 'react';
import MapView from '../components/MapView';
import AlertList from '../components/AlertList';
import FloodAnalytics from '../components/FloodAnalytics';
import LocationSelector from '../components/LocationSelector';
import HelpTooltip from '../components/HelpTooltip';
import { apiService } from '../services/api';

const Dashboard = ({ onBackToWelcome }) => {
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
    // Only start monitoring if explicitly started
    if (isMonitoring) {
      fetchData();
      const interval = setInterval(fetchData, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [currentLocation, isMonitoring]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log(`🌊 Fetching data for location: ${currentLocation.toUpperCase()}`);
      
      const data = await apiService.getDataForLocation(currentLocation);
      
      if (data.data) {
        setWeatherData(data.data.weather);
        setTideData(data.data.tide);
        setOceanData(data.data.ocean);
        setError(null);
        
        // Enhanced console logging with beautiful formatting
        console.log('🚀 API DATA RECEIVED SUCCESSFULLY!');
        console.log('='.repeat(60));
        console.log(`📍 LOCATION: ${data.data.weather?.city_name || currentLocation}`);
        console.log(`🌍 COUNTRY: ${data.data.weather?.country || 'India'}`);
        console.log(`⏰ TIMESTAMP: ${new Date().toLocaleString()}`);
        console.log('');
        
        // Weather Data
        if (data.data.weather) {
          console.log('🌤️ WEATHER DATA:');
          console.log('  ┌─ Temperature:', data.data.weather.temperature ? `${data.data.weather.temperature}°C` : 'N/A');
          console.log('  ├─ Description:', data.data.weather.description || 'N/A');
          console.log('  ├─ Humidity:', data.data.weather.humidity ? `${data.data.weather.humidity}%` : 'N/A');
          console.log('  ├─ Wind Speed:', data.data.weather.wind_speed ? `${data.data.weather.wind_speed} km/h` : 'N/A');
          console.log('  └─ Pressure:', data.data.weather.pressure ? `${data.data.weather.pressure} hPa` : 'N/A');
        }
        
        // Tide Data
        if (data.data.tide) {
          console.log('');
          console.log('🌊 TIDE DATA:');
          console.log('  ┌─ Current Height:', data.data.tide.tide_height ? `${data.data.tide.tide_height}m` : 'N/A');
          console.log('  ├─ Status:', data.data.tide.status || 'N/A');
          console.log('  ├─ High Tide:', data.data.tide.high_tide ? `${data.data.tide.high_tide}m` : 'N/A');
          console.log('  ├─ Low Tide:', data.data.tide.low_tide ? `${data.data.tide.low_tide}m` : 'N/A');
          console.log('  ├─ Tide Range:', data.data.tide.tide_range ? `${data.data.tide.tide_range}m` : 'N/A');
          console.log('  ├─ Next High:', data.data.tide.next_high_tide || 'N/A');
          console.log('  └─ Next Low:', data.data.tide.next_low_tide || 'N/A');
        }
        
        // Ocean Data
        if (data.data.ocean) {
          console.log('');
          console.log('🌊 OCEAN DATA:');
          console.log('  ┌─ Wave Height:', data.data.ocean.wave_height ? `${data.data.ocean.wave_height}m` : 'N/A');
          console.log('  ├─ Wave Period:', data.data.ocean.wave_period ? `${data.data.ocean.wave_period}s` : 'N/A');
          console.log('  ├─ Current Speed:', data.data.ocean.current_speed ? `${data.data.ocean.current_speed} m/s` : 'N/A');
          console.log('  ├─ Sea Surface Temp:', data.data.ocean.sea_surface_temp ? `${data.data.ocean.sea_surface_temp}°C` : 'N/A');
          console.log('  └─ Current Direction:', data.data.ocean.current_direction ? `${data.data.ocean.current_direction}°` : 'N/A');
        }
        
        console.log('');
        console.log('📊 FULL API RESPONSE:');
        console.log(JSON.stringify(data, null, 2));
        console.log('');
        console.log('🔍 DATA STRUCTURE DEBUG:');
        console.log('  Weather data exists:', !!data.data.weather);
        console.log('  Tide data exists:', !!data.data.tide);
        console.log('  Ocean data exists:', !!data.data.ocean);
        if (data.data.ocean) {
          console.log('  Ocean data keys:', Object.keys(data.data.ocean));
          console.log('  Wave height:', data.data.ocean.wave_height);
          console.log('  Current speed:', data.data.ocean.current_speed);
          console.log('  Sea surface temp:', data.data.ocean.sea_surface_temp);
          console.log('  Wave period:', data.data.ocean.wave_period);
        }
        console.log('='.repeat(60));
        
      } else {
        console.warn('⚠️ No data received from API');
      }
      
      // Fetch flood prediction
      try {
        const floodRes = await apiService.getFloodPrediction(currentLocation);
        if (floodRes.status === 'success') {
          setFloodPrediction(floodRes.flood_prediction);
          console.log('');
          console.log('🌊 FLOOD PREDICTION RECEIVED:');
          console.log('  ┌─ Probability:', floodRes.flood_prediction.flood_probability ? `${floodRes.flood_prediction.flood_probability}%` : 'N/A');
          console.log('  ├─ Risk Level:', floodRes.flood_prediction.risk_level || 'N/A');
          console.log('  ├─ Confidence:', floodRes.flood_prediction.confidence ? `${floodRes.flood_prediction.confidence}%` : 'N/A');
          console.log('  ├─ Warning:', floodRes.flood_prediction.warning_message || 'N/A');
          console.log('  └─ Recommendations:', floodRes.flood_prediction.recommendations?.length || 0, 'items');
        }
      } catch (floodError) {
        console.error('❌ Error fetching flood prediction:', floodError);
      }
      
      const alertsRes = await apiService.getAlerts();
      setAlerts(alertsRes.alerts || []);
      
      if (alertsRes.alerts && alertsRes.alerts.length > 0) {
        console.log('');
        console.log('🚨 ALERTS RECEIVED:');
        alertsRes.alerts.forEach((alert, index) => {
          console.log(`  ${index + 1}. ${alert.alert_type}: ${alert.description}`);
        });
      }
      
    } catch (err) {
      console.error('❌ ERROR FETCHING DATA:', err);
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
    // Don't automatically fetch data - wait for monitoring to start
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    setLoading(true);
    // Start fetching data when monitoring begins
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
          <div className="space-y-8 fade-in-up">
            {/* Location Header Card */}
            <div className="pro-card p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-5xl">🌊</div>
                  <div>
                    <h2 className="heading-1 text-gradient">
                      {weatherData?.city_name || 'Kandla, Gujarat'}
                    </h2>
                    <p className="text-xl text-gray-600 font-medium">
                      {weatherData?.country || 'India'} • Coastal Threat Monitoring Station
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="status-indicator online"></div>
                        <span className="text-sm text-gray-600">Real-time monitoring active</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="status-indicator online"></div>
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
            <div className="dashboard-grid cols-2">
              <div className="pro-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="heading-3">🗺️ Coastal Threat Map</h3>
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
              
              <div className="pro-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="heading-3">🚨 Active Alerts</h3>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {alerts?.length || 0} Active
                  </div>
                </div>
                <AlertList alerts={alerts} />
              </div>
            </div>

            {/* Data Cards Row */}
            <div className="dashboard-grid cols-4">
              {/* Weather Card */}
              <HelpTooltip title="Current weather conditions including temperature, humidity, wind speed, and atmospheric pressure">
                <div className="data-card">
                  <div className="icon">🌤️</div>
                  <div className="value">
                    {weatherData?.temperature ? `${weatherData.temperature}°C` : '--'}
                  </div>
                  <div className="label">Temperature</div>
                  <div className="mt-3 space-y-1 text-xs text-gray-500">
                    <div>Humidity: {weatherData?.humidity ? `${weatherData.humidity}%` : '--'}</div>
                    <div>Wind: {weatherData?.wind_speed ? `${weatherData.wind_speed} m/s` : '--'}</div>
                    <div>Pressure: {weatherData?.pressure ? `${weatherData.pressure} hPa` : '--'}</div>
                  </div>
                </div>
              </HelpTooltip>

              {/* Tide Card */}
              <HelpTooltip title="Current tide information including height, type (rising/falling), and source">
                <div className="data-card border-l-green-500">
                  <div className="icon">🌊</div>
                  <div className="value">
                    {tideData?.tide_height ? `${tideData.tide_height}m` : '--'}
                  </div>
                  <div className="label">Tide Height</div>
                  <div className="mt-3 space-y-1 text-xs text-gray-500">
                    <div>Status: {tideData?.status || '--'}</div>
                    <div>High: {tideData?.high_tide ? `${tideData.high_tide}m` : '--'}</div>
                    <div>Low: {tideData?.low_tide ? `${tideData.low_tide}m` : '--'}</div>
                    <div>Range: {tideData?.tide_range ? `${tideData.tide_range}m` : '--'}</div>
                  </div>
                  {!tideData && (
                    <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
                      ⚠️ Tide data not available
                    </div>
                  )}
                </div>
              </HelpTooltip>

              {/* Ocean Card */}
              <HelpTooltip title="Ocean conditions including wave height, current speed, and sea surface temperature">
                <div className="data-card border-l-teal-500">
                  <div className="icon">🌊</div>
                  <div className="value">
                    {oceanData?.wave_height ? `${oceanData.wave_height}m` : '--'}
                  </div>
                  <div className="label">Wave Height</div>
                  <div className="mt-3 space-y-1 text-xs text-gray-500">
                    <div>Current: {oceanData?.current_speed ? `${oceanData.current_speed} m/s` : '--'}</div>
                    <div>Temp: {oceanData?.sea_surface_temp ? `${oceanData.sea_surface_temp}°C` : '--'}</div>
                    <div>Period: {oceanData?.wave_period ? `${oceanData.wave_period}s` : '--'}</div>
                  </div>
                  {!oceanData && (
                    <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
                      ⚠️ Ocean data not available
                    </div>
                  )}
                </div>
              </HelpTooltip>

              {/* Flood Prediction Card */}
              <HelpTooltip title="AI-powered flood prediction based on current environmental conditions">
                <div className={`data-card border-l-${floodPrediction?.risk_level === 'critical' ? 'red' : floodPrediction?.risk_level === 'high' ? 'orange' : floodPrediction?.risk_level === 'medium' ? 'yellow' : 'green'}-500`}>
                  <div className="icon">🌊</div>
                  <div className="value">
                    {floodPrediction?.flood_probability ? `${floodPrediction.flood_probability}%` : '--'}
                  </div>
                  <div className="label">Flood Risk</div>
                  <div className="mt-3 space-y-1 text-xs text-gray-500">
                    <div>Level: {floodPrediction?.risk_level || '--'}</div>
                    <div>Confidence: {floodPrediction?.confidence ? `${floodPrediction.confidence}%` : '--'}</div>
                    <div>Status: {floodPrediction?.flood_risk || '--'}</div>
                  </div>
                  {!floodPrediction && (
                    <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
                      ⚠️ Flood prediction not available
                    </div>
                  )}
                </div>
              </HelpTooltip>
            </div>

            {/* Flood Prediction Details Row */}
            {floodPrediction && (
              <div className="pro-card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="heading-3">🤖 AI Flood Prediction Analysis</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    floodPrediction.risk_level === 'critical' ? 'bg-red-100 text-red-800' :
                    floodPrediction.risk_level === 'high' ? 'bg-orange-100 text-orange-800' :
                    floodPrediction.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {floodPrediction.flood_risk}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Prediction Stats */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">📊 Prediction Statistics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Probability:</span>
                        <span className="font-medium">{floodPrediction.flood_probability}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confidence:</span>
                        <span className="font-medium">{floodPrediction.confidence}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Level:</span>
                        <span className="font-medium capitalize">{floodPrediction.risk_level}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Warning Message */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">⚠️ Warning</h4>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">{floodPrediction.warning_message}</p>
                    </div>
                  </div>
                  
                  {/* Recommendations */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">💡 Recommendations</h4>
                    <div className="space-y-2">
                      {floodPrediction.recommendations?.slice(0, 3).map((rec, index) => (
                        <div key={index} className="text-sm text-gray-700 bg-white p-2 rounded border">
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Features Used */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">🔍 Data Used for Prediction</h4>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Temperature:</span>
                      <span className="ml-2 font-medium">{floodPrediction.features_used?.temperature}°C</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Humidity:</span>
                      <span className="ml-2 font-medium">{floodPrediction.features_used?.humidity}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Wind Speed:</span>
                      <span className="ml-2 font-medium">{floodPrediction.features_used?.wind_speed} km/h</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Pressure:</span>
                      <span className="ml-2 font-medium">{floodPrediction.features_used?.pressure} hPa</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Tide Height:</span>
                      <span className="ml-2 font-medium">{floodPrediction.features_used?.tide_height}m</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Wave Height:</span>
                      <span className="ml-2 font-medium">{floodPrediction.features_used?.wave_height}m</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Status Row */}
            <div className="pro-card p-6 bg-gradient-to-r from-green-50 to-blue-50">
              <h3 className="heading-3 mb-4">⚡ System Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <HelpTooltip title="Backend API status and availability">
                  <div className="status-card success">
                    <div className="text-2xl mb-2">✅</div>
                    <div className="font-semibold text-green-800">Backend API</div>
                    <div className="text-sm text-green-600">Operational</div>
                  </div>
                </HelpTooltip>
                <HelpTooltip title="Data sources and connectivity for weather, tide, and ocean data">
                  <div className="status-card success">
                    <div className="text-2xl mb-2">✅</div>
                    <div className="font-semibold text-green-800">Data Sources</div>
                    <div className="text-sm text-green-600">Connected</div>
                  </div>
                </HelpTooltip>
                <HelpTooltip title="AI threat detection and alert generation functionality">
                  <div className="status-card success">
                    <div className="text-2xl mb-2">✅</div>
                    <div className="font-semibold text-green-800">AI Detection</div>
                    <div className="text-sm text-green-600">Active</div>
                  </div>
                </HelpTooltip>
                <HelpTooltip title="Real-time coastal monitoring and alerting system operation">
                  <div className="status-card success">
                    <div className="text-2xl mb-2">✅</div>
                    <div className="font-semibold text-green-800">Monitoring</div>
                    <div className="text-sm text-green-600">Active</div>
                  </div>
                </HelpTooltip>
              </div>
            </div>
          </div>
        );
      
      case 'flood-analytics':
        return (
          <div className="pro-card p-8">
            <FloodAnalytics />
          </div>
        );
      
      case 'locations':
        return <LocationSelector 
          onLocationChange={handleLocationChange} 
          currentLocation={currentLocation}
          onStartMonitoring={startMonitoring}
          onStopMonitoring={stopMonitoring}
          isMonitoring={isMonitoring}
        />;
      
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Professional Header */}
      <header className="dashboard-header">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToWelcome}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                title="Back to Welcome"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="text-4xl">🌊</div>
              <div>
                <h1 className="heading-1 text-gradient mb-1">Coastal Threat Alert System</h1>
                <p className="text-lg text-gray-600 font-medium">AI-Powered Gujarat Coastal Monitoring & Early Warning</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-sm text-gray-500 font-medium">System Status</div>
                <div className="flex items-center space-x-2">
                  <div className="status-indicator online"></div>
                  <span className="text-green-600 font-semibold">All Systems Operational</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 font-medium">Last Updated</div>
                <div className="font-mono text-gray-800">{new Date().toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Professional Tab Navigation */}
        <div className="mb-8">
          <nav className="tab-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              >
                <span className="mr-2">{tab.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{tab.name}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {!isMonitoring && activeTab === 'overview' ? (
          <div className="loading-container">
            <div className="loading-content">
              <div className="text-6xl mb-4">⏸️</div>
              <p className="loading-text">Monitoring Not Started</p>
              <p className="text-sm text-gray-500 mt-2">Go to Locations tab and click "Start Monitoring" to begin</p>
            </div>
          </div>
        ) : loading && activeTab === 'overview' ? (
          <div className="loading-container">
            <div className="loading-content">
              <div className="loading-spinner-large"></div>
              <p className="loading-text">Loading coastal monitoring data...</p>
              <p className="text-sm text-gray-500 mt-2">Fetching real-time updates from Gujarat coastal sources</p>
            </div>
          </div>
        ) : (
          renderTabContent()
        )}

        {/* Error Display */}
        {error && (
          <div className="error-container">
            <div className="error-content">
              <div className="error-icon">⚠️</div>
              <p className="error-message">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Professional Footer */}
      <footer className="footer-gradient text-white mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">🌊 Coastal Threat Alert System</p>
                          <p className="opacity-75 mb-4">AI-Powered Gujarat Coastal Monitoring for Community Safety</p>
            <div className="text-sm opacity-60">
              Built with FastAPI, React, and Machine Learning • Real-time data from Gujarat coastal monitoring networks
            </div>
            <div className="mt-4 text-xs opacity-50">
              HackOut'25 • Team Titans • Protecting Gujarat's Coastal Communities
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
