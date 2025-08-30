import React from 'react';
import MapView from '../MapView';
import AlertList from '../AlertList';
import FloodAnalytics from '../FloodAnalytics';
import LocationSelector from '../LocationSelector';

const ForecastingTab = ({
  weatherData,
  tideData,
  oceanData,
  floodPrediction,
  alerts,
  currentLocation,
  isMonitoring,
  onLocationChange,
  onStartMonitoring,
  onStopMonitoring,
  loading,
  error
}) => {
  return (
    <div className="space-y-8">
      {/* Monitoring Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Forecasting & Monitoring</h2>
            <p className="text-gray-600">Real-time coastal monitoring and threat forecasting</p>
          </div>
          <div className="flex items-center space-x-4">
            <LocationSelector
              currentLocation={currentLocation}
              onLocationChange={onLocationChange}
            />
            <button
              onClick={isMonitoring ? onStopMonitoring : onStartMonitoring}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isMonitoring
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Weather and Ocean Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weather Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900">Weather Conditions</h3>
              <div className="text-3xl">🌤️</div>
            </div>
            {weatherData ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Temperature</span>
                  <span className="font-semibold text-blue-900">{weatherData.temperature}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Humidity</span>
                  <span className="font-semibold text-blue-900">{weatherData.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wind Speed</span>
                  <span className="font-semibold text-blue-900">{weatherData.wind_speed} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pressure</span>
                  <span className="font-semibold text-blue-900">{weatherData.pressure} hPa</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🌤️</div>
                <p className="text-gray-500">Start monitoring to see weather data</p>
              </div>
            )}
          </div>

          {/* Tide Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-900">Tide Information</h3>
              <div className="text-3xl">🌊</div>
            </div>
            {tideData ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Height</span>
                  <span className="font-semibold text-green-900">{tideData.current_height}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">High Tide</span>
                  <span className="font-semibold text-green-900">{tideData.high_tide_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Low Tide</span>
                  <span className="font-semibold text-green-900">{tideData.low_tide_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-semibold text-green-900">{tideData.status}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🌊</div>
                <p className="text-gray-500">Start monitoring to see tide data</p>
              </div>
            )}
          </div>

          {/* Ocean Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-900">Ocean Conditions</h3>
              <div className="text-3xl">🌊</div>
            </div>
            {oceanData ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Wave Height</span>
                  <span className="font-semibold text-purple-900">{oceanData.wave_height}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Water Temp</span>
                  <span className="font-semibold text-purple-900">{oceanData.water_temperature}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Salinity</span>
                  <span className="font-semibold text-purple-900">{oceanData.salinity} ppt</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current</span>
                  <span className="font-semibold text-purple-900">{oceanData.current_speed} m/s</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🌊</div>
                <p className="text-gray-500">Start monitoring to see ocean data</p>
              </div>
            )}
          </div>
        </div>

        {/* Flood Prediction */}
        {floodPrediction && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-orange-900">Flood Risk Assessment</h3>
              <div className="text-3xl">⚠️</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  {floodPrediction.risk_level}
                </div>
                <div className="text-sm text-gray-600">Risk Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  {floodPrediction.probability}%
                </div>
                <div className="text-sm text-gray-600">Flood Probability</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  {floodPrediction.estimated_water_level}m
                </div>
                <div className="text-sm text-gray-600">Estimated Water Level</div>
              </div>
            </div>
          </div>
        )}

        {/* Map and Alerts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coastal Map View</h3>
            <div className="bg-gray-100 rounded-lg p-4 h-80">
              <MapView />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
            <AlertList alerts={alerts} />
          </div>
        </div>

        {/* Flood Analytics */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Flood Analytics</h3>
          <FloodAnalytics />
        </div>
      </div>
    </div>
  );
};

export default ForecastingTab;
