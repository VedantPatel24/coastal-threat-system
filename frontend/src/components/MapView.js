import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapView = ({ weatherData, tideData, alerts = [], onLocationClick, currentLocation = "kandla" }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Get coordinates for the current Gujarat coastal location
  const getLocationCoordinates = () => {
    const locations = {
      "kandla": { lat: 23.0333, lon: 70.2167, name: "Kandla, Gujarat", port_type: "Major Port" },
      "mundra": { lat: 22.8397, lon: 69.7203, name: "Mundra, Gujarat", port_type: "Private Port" },
      "bhavnagar": { lat: 21.7645, lon: 72.1519, name: "Bhavnagar, Gujarat", port_type: "Minor Port" },
      "surat": { lat: 21.1702, lon: 72.8311, name: "Surat, Gujarat", port_type: "Minor Port" },
      "bharuch": { lat: 21.6948, lon: 72.8645, name: "Bharuch, Gujarat", port_type: "Minor Port" },
      "veraval": { lat: 20.9157, lon: 70.3629, name: "Veraval, Gujarat", port_type: "Fishing Port" },
      "porbandar": { lat: 21.6422, lon: 69.6093, name: "Porbandar, Gujarat", port_type: "Minor Port" },
      "okha": { lat: 22.4707, lon: 69.0706, name: "Okha, Gujarat", port_type: "Minor Port" },
      "diu": { lat: 20.7144, lon: 70.9874, name: "Diu, Gujarat", port_type: "Tourist Port" },
      "ghogha": { lat: 22.3333, lon: 72.2833, name: "Ghogha, Gujarat", port_type: "Minor Port" }
    };

    // Ensure currentLocation is a string and handle undefined/null cases
    if (!currentLocation || typeof currentLocation !== 'string') {
      console.warn('Invalid currentLocation:', currentLocation, 'falling back to kandla');
      return locations.kandla;
    }

    // Check if it's a custom location with coordinates (validate Gujarat region)
    if (currentLocation.includes(',')) {
      try {
        const [lat, lon] = currentLocation.split(',').map(Number);
        // Check if coordinates are valid numbers and within Gujarat coastal region
        if (!isNaN(lat) && !isNaN(lon) && lat >= 20.0 && lat <= 24.5 && lon >= 69.0 && lon <= 73.0) {
          return { lat, lon, name: `Custom Gujarat Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`, port_type: "Custom" };
        } else {
          console.warn('Coordinates outside Gujarat region or invalid:', lat, lon, 'falling back to kandla');
          return locations.kandla; // fallback to Kandla if outside Gujarat
        }
      } catch (e) {
        console.warn('Error parsing coordinates:', e, 'falling back to kandla');
        return locations.kandla; // fallback
      }
    }

    // Check if the location exists in our predefined list
    const location = locations[currentLocation.toLowerCase()];
    if (location) {
      return location;
    }

    // If location not found, log warning and fallback to Kandla
    console.warn('Location not found:', currentLocation, 'falling back to kandla');
    return locations.kandla;
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const location = getLocationCoordinates();
    
    // Validate coordinates before proceeding
    if (!location || isNaN(location.lat) || isNaN(location.lon)) {
      console.error('Invalid location coordinates:', location);
      return;
    }

    // Initialize map
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        dragging: true,
        touchZoom: true
      }).setView([location.lat, location.lon], 10);
      
      // Add OpenStreetMap tiles with better styling
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
        minZoom: 8
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      // Update map view for existing map
      const map = mapInstanceRef.current;
      map.setView([location.lat, location.lon], 10);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers and overlays
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    // Add coastal boundary based on location (positioned to avoid overlap)
    const coastalBoundary = L.circle([location.lat, location.lon], {
      color: '#0d9488',
      weight: 3,
      fillColor: '#0d9488',
      fillOpacity: 0.08,
      radius: 45000 // 45km radius to avoid overlap
    }).addTo(map);

    // Add location title with better positioning
    const locationTitle = L.divIcon({
      className: 'location-title-marker',
      html: `
        <div class="bg-white bg-opacity-95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-2xl border border-gray-200 max-w-xs">
          <h3 class="font-bold text-lg text-gray-800 leading-tight">${location.name}</h3>
          <p class="text-sm text-gray-600 mt-1">${location.port_type} • Coastal Monitoring Station</p>
        </div>
      `,
      iconSize: [250, 70],
      iconAnchor: [125, 0]
    });

    // Position title above the location to avoid overlap
    const titleMarker = L.marker([location.lat + 0.08, location.lon], { 
      icon: locationTitle,
      zIndexOffset: 1000 // Ensure title is on top
    }).addTo(map);
    markersRef.current.push(titleMarker);

    // Add weather station marker with better positioning
    if (weatherData && weatherData.location) {
      try {
        const [lat, lon] = weatherData.location.split(',').map(Number);
        
        // Validate coordinates are valid numbers
        if (!isNaN(lat) && !isNaN(lon)) {
          const weatherIcon = L.divIcon({
            className: 'weather-marker-icon',
            html: `
              <div class="bg-blue-500 text-white rounded-full p-3 text-sm font-bold shadow-xl border-2 border-white hover:scale-110 transition-transform duration-200 cursor-pointer">
                🌤️
              </div>
            `,
            iconSize: [50, 50],
            iconAnchor: [25, 25]
          });

          // Position weather marker to avoid overlap
          const weatherMarker = L.marker([lat + 0.02, lon + 0.02], { 
            icon: weatherIcon,
            zIndexOffset: 800
          })
            .addTo(map)
            .bindPopup(`
              <div class="p-3 max-w-xs">
                <h3 class="font-bold text-lg text-blue-600 mb-2">🌤️ Weather Station</h3>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="font-medium">Temperature:</span>
                    <span class="text-blue-600">${weatherData.temperature || 'N/A'}°C</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-medium">Wind:</span>
                    <span class="text-blue-600">${weatherData.wind_speed || 'N/A'} m/s</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-medium">Pressure:</span>
                    <span class="text-blue-600">${weatherData.pressure || 'N/A'} hPa</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-medium">Humidity:</span>
                    <span class="text-blue-600">${weatherData.humidity || 'N/A'}%</span>
                  </div>
                </div>
              </div>
            `, {
              className: 'custom-popup',
              maxWidth: 300,
              closeButton: true,
              autoClose: false,
              closeOnClick: false
            });

          markersRef.current.push(weatherMarker);
        } else {
          console.warn('Invalid weather coordinates:', lat, lon);
        }
      } catch (e) {
        console.warn('Error parsing weather coordinates:', e);
      }
    }

    // Add tide station marker with better positioning
    if (tideData && tideData.location) {
      try {
        const [lat, lon] = tideData.location.split(',').map(Number);
        
        // Validate coordinates are valid numbers
        if (!isNaN(lat) && !isNaN(lon)) {
          const tideIcon = L.divIcon({
            className: 'tide-marker-icon',
            html: `
              <div class="bg-teal-500 text-white rounded-full p-3 text-sm font-bold shadow-xl border-2 border-white hover:scale-110 transition-transform duration-200 cursor-pointer">
                🌊
              </div>
            `,
            iconSize: [50, 50],
            iconAnchor: [25, 25]
          });

          // Position tide marker to avoid overlap
          const tideMarker = L.marker([lat - 0.02, lon - 0.02], { 
            icon: tideIcon,
            zIndexOffset: 800
          })
            .addTo(map)
            .bindPopup(`
              <div class="p-3 max-w-xs">
                <h3 class="font-bold text-lg text-teal-600 mb-2">🌊 Tide Station</h3>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="font-medium">Height:</span>
                    <span class="text-teal-600">${tideData.tide_height || 'N/A'} m</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-medium">Type:</span>
                    <span class="text-teal-600">${tideData.tide_type || 'N/A'}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-medium">Status:</span>
                    <span class="text-teal-600">${tideData.status || 'N/A'}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-medium">Source:</span>
                    <span class="text-teal-600">${tideData.source || 'N/A'}</span>
                  </div>
                </div>
              </div>
            `, {
              className: 'custom-popup',
              maxWidth: 300,
              closeButton: true,
              autoClose: false,
              closeOnClick: false
            });

          markersRef.current.push(tideMarker);
        } else {
          console.warn('Invalid tide coordinates:', lat, lon);
        }
      } catch (e) {
        console.warn('Error parsing tide coordinates:', e);
      }
    }

    // Add alert markers with improved positioning and clustering
    if (alerts && Array.isArray(alerts)) {
      alerts.forEach((alert, index) => {
        // Skip alerts without valid location data
        if (!alert.location || typeof alert.location !== 'string') {
          console.warn('Alert missing location data:', alert);
          return;
        }
        
        try {
          const [lat, lon] = alert.location.split(',').map(Number);
          
          // Validate coordinates are valid numbers
          if (isNaN(lat) || isNaN(lon)) {
            console.warn('Invalid alert coordinates:', lat, lon, 'for alert:', alert);
            return;
          }
          
          let alertColor, alertIcon;
          switch (alert.severity) {
            case 'critical':
              alertColor = 'bg-red-600';
              alertIcon = '🚨';
              break;
            case 'high':
              alertColor = 'bg-orange-500';
              alertIcon = '⚠️';
              break;
            case 'medium':
              alertColor = 'bg-yellow-500';
              alertIcon = '⚡';
              break;
            default:
              alertColor = 'bg-green-500';
              alertIcon = 'ℹ️';
          }

          // Position alerts with offset to avoid overlap
          const offset = index * 0.015; // 0.015 degrees offset per alert
          const alertMarkerIcon = L.divIcon({
            className: 'alert-marker-icon',
            html: `
              <div class="${alertColor} text-white rounded-full p-3 text-sm font-bold shadow-xl border-2 border-white hover:scale-110 transition-transform duration-200 cursor-pointer animate-pulse">
                ${alertIcon}
              </div>
            `,
            iconSize: [50, 50],
            iconAnchor: [25, 25]
          });

          const alertMarker = L.marker([lat + offset, lon + offset], { 
            icon: alertMarkerIcon,
            zIndexOffset: 900 + index // Ensure alerts are on top
          })
            .addTo(map)
            .bindPopup(`
              <div class="p-3 max-w-xs">
                <h3 class="font-bold text-lg text-red-600 mb-2">${alert.alert_type?.toUpperCase() || 'ALERT'}</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex items-center justify-between">
                    <span class="font-medium">Severity:</span>
                    <span class="px-2 py-1 rounded text-xs font-bold ${alertColor} text-white">
                      ${alert.severity}
                    </span>
                  </div>
                  <p class="text-gray-700 leading-relaxed">${alert.description || 'No description available'}</p>
                  <div class="text-xs text-gray-600 space-y-1">
                    <div><strong>Triggered by:</strong> ${alert.triggered_by || 'Unknown'}</div>
                    <div><strong>Time:</strong> ${new Date(alert.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            `, {
              className: 'custom-popup',
              maxWidth: 350,
              closeButton: true,
              autoClose: false,
              closeOnClick: false
            });

          markersRef.current.push(alertMarker);

          // Add risk zone overlay for high/critical alerts with better positioning
          if (alert.severity === 'high' || alert.severity === 'critical') {
            const riskZone = L.circle([lat + offset, lon + offset], {
              color: alert.severity === 'critical' ? '#dc2626' : '#ea580c',
              fillColor: alert.severity === 'critical' ? '#dc2626' : '#ea580c',
              fillOpacity: 0.15,
              weight: 2,
              radius: 4000 // 4km radius
            }).addTo(map);

            markersRef.current.push(riskZone);
          }
        } catch (e) {
          console.warn('Error processing alert marker:', e, 'for alert:', alert);
        }
      });
    }

    // Add click handler for map
    map.on('click', (e) => {
      if (onLocationClick) {
        onLocationClick(e.latlng);
      }
    });

    // Fit map bounds to show all markers
    if (markersRef.current.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.1));
    }

  }, [weatherData, tideData, alerts, onLocationClick, currentLocation]);

  return (
    <div className="relative h-full w-full">
      {/* Compact Map Legend */}
      <div className="absolute top-4 left-4 z-[1000] bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-200 max-w-48">
        <h3 className="font-semibold text-base text-gray-800 mb-2">🗺️ Legend</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm border border-white"></div>
            <span className="font-medium">Weather Station</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-teal-500 rounded-full shadow-sm border border-white"></div>
            <span className="font-medium">Tide Station</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm border border-white animate-pulse"></div>
            <span className="font-medium">Alert Zones</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full opacity-20 border border-green-500"></div>
            <span className="font-medium">Coastal Boundary</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            <strong>📍</strong> {getLocationCoordinates().name}
          </div>
          <div className="text-xs text-gray-500">
            <strong>🌊</strong> {getLocationCoordinates().port_type}
          </div>
        </div>
      </div>
      
      {/* Map Container with improved styling */}
      <div 
        ref={mapRef} 
        className="h-full w-full rounded-xl overflow-hidden shadow-2xl border-2 border-white border-opacity-20"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default MapView;
