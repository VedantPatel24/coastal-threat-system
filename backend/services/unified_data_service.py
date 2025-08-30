import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv
import random
import math

load_dotenv()

class UnifiedDataService:
    """
    Gujarat Coastal Monitoring Service
    Provides comprehensive coastal monitoring for Gujarat state coastal areas
    """
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        
        # Gujarat coastal cities with coordinates
        self.coastal_cities = {
            "kandla": {"name": "Kandla, Gujarat", "lat": 23.0333, "lon": 70.2167, "state": "Gujarat", "country": "India", "timezone": "IST", "port_type": "Major Port"},
            "mundra": {"name": "Mundra, Gujarat", "lat": 22.8397, "lon": 69.7203, "state": "Gujarat", "country": "India", "timezone": "IST", "port_type": "Private Port"},
            "bhavnagar": {"name": "Bhavnagar, Gujarat", "lat": 21.7645, "lon": 72.1519, "state": "Gujarat", "country": "India", "timezone": "IST", "port_type": "Minor Port"},
            "surat": {"name": "Surat, Gujarat", "lat": 21.1702, "lon": 72.8311, "state": "Gujarat", "country": "India", "timezone": "IST", "port_type": "Minor Port"},
            "bharuch": {"name": "Bharuch, Gujarat", "lat": 21.6948, "lon": 72.8645, "state": "Gujarat", "country": "India", "timezone": "IST", "port_type": "Minor Port"},
            "veraval": {"name": "Veraval, Gujarat", "lat": 20.9157, "lon": 70.3629, "state": "Gujarat", "country": "India", "timezone": "IST", "port_type": "Fishing Port"},
            "porbandar": {"name": "Porbandar, Gujarat", "lat": 21.6422, "lon": 69.6093, "state": "Gujarat", "country": "India", "timezone": "IST", "port_type": "Minor Port"},
            "okha": {"name": "Okha, Gujarat", "lat": 22.4707, "lon": 69.0706, "state": "Gujarat", "country": "India", "timezone": "IST", "port_type": "Minor Port"},
            "diu": {"name": "Diu, Gujarat", "lat": 20.7144, "lon": 70.9874, "state": "Gujarat", "country": "India", "timezone": "IST", "port_type": "Tourist Port"},
            "ghogha": {"name": "Ghogha, Gujarat", "lat": 22.3333, "lon": 72.2833, "state": "Gujarat", "country": "India", "timezone": "IST", "port_type": "Minor Port"}
        }
    
    def get_location_info(self, location_input: str) -> Dict:
        """Get location information dynamically from external APIs"""
        try:
            # Check if it's a predefined Gujarat coastal city (fallback)
            if location_input.lower() in self.coastal_cities:
                city_info = self.coastal_cities[location_input.lower()]
                return {
                    "name": city_info["name"],
                    "lat": city_info["lat"],
                    "lon": city_info["lon"],
                    "state": city_info["state"],
                    "country": city_info["country"],
                    "timezone": city_info["timezone"],
                    "port_type": city_info["port_type"],
                    "coordinates": f"{city_info['lat']},{city_info['lon']}"
                }
            
            # Check if it's coordinates (lat,lon format) - validate if within Gujarat coastal region
            if "," in location_input:
                try:
                    lat, lon = map(float, location_input.split(","))
                    # Check if coordinates are within Gujarat coastal region (approximate bounds)
                    if 20.0 <= lat <= 24.5 and 69.0 <= lon <= 73.0:
                        return {
                            "name": f"Custom Gujarat Location ({lat:.4f}, {lon:.4f})",
                            "lat": lat,
                            "lon": lon,
                            "state": "Gujarat",
                            "country": "India",
                            "timezone": "IST",
                            "port_type": "Custom",
                            "coordinates": f"{lat},{lon}"
                        }
                    else:
                        # If outside Gujarat, default to Kandla
                        print(f"Coordinates {lat}, {lon} are outside Gujarat coastal region. Defaulting to Kandla.")
                        return self.coastal_cities["kandla"]
                except ValueError:
                    pass
            
            # NEW: Dynamic location search via external APIs
            print(f"Searching for location: {location_input}")
            
            # Try OpenStreetMap Nominatim API for location search
            try:
                search_query = f"{location_input}, Gujarat, India"
                nominatim_url = "https://nominatim.openstreetmap.org/search"
                params = {
                    "q": search_query,
                    "format": "json",
                    "limit": 1,
                    "addressdetails": 1
                }
                
                response = self.session.get(nominatim_url, params=params, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    if data and len(data) > 0:
                        location = data[0]
                        lat = float(location["lat"])
                        lon = float(location["lon"])
                        
                        # Check if coordinates are within Gujarat coastal region
                        if 20.0 <= lat <= 24.5 and 69.0 <= lon <= 73.0:
                            # Determine port type based on location details
                            port_type = self._determine_port_type(location, location_input)
                            
                            return {
                                "name": f"{location_input}, Gujarat",
                                "lat": lat,
                                "lon": lon,
                                "state": "Gujarat",
                                "country": "India",
                                "timezone": "IST",
                                "port_type": port_type,
                                "coordinates": f"{lat},{lon}",
                                "source": "nominatim_api"
                            }
                        else:
                            print(f"Location {location_input} found but outside Gujarat coastal region.")
                            # Return error information instead of defaulting to Kandla
                            return {
                                "name": f"{location_input}",
                                "lat": lat,
                                "lon": lon,
                                "state": "Outside Gujarat",
                                "country": "India",
                                "timezone": "IST",
                                "port_type": "Outside Gujarat Region",
                                "coordinates": f"{lat},{lon}",
                                "source": "nominatim_api",
                                "error": "Location outside Gujarat coastal region"
                            }
            except Exception as e:
                print(f"Error calling Nominatim API: {e}")
            
            # Try Google Geocoding API as fallback (if API key available)
            try:
                google_key = os.getenv("GOOGLE_MAPS_API_KEY")
                if google_key:
                    search_query = f"{location_input}, Gujarat, India"
                    google_url = "https://maps.googleapis.com/maps/api/geocode/json"
                    params = {
                        "address": search_query,
                        "key": google_key
                    }
                    
                    response = self.session.get(google_url, params=params, timeout=10)
                    if response.status_code == 200:
                        data = response.json()
                        if data["status"] == "OK" and data["results"]:
                            location = data["results"][0]["geometry"]["location"]
                            lat = location["lat"]
                            lon = location["lng"]
                            
                            # Check if coordinates are within Gujarat coastal region
                            if 20.0 <= lat <= 24.5 and 69.0 <= lon <= 73.0:
                                port_type = self._determine_port_type_from_google(data["results"][0], location_input)
                                
                                return {
                                    "name": f"{location_input}, Gujarat",
                                    "lat": lat,
                                    "lon": lon,
                                    "state": "Gujarat",
                                    "country": "India",
                                    "timezone": "IST",
                                    "port_type": port_type,
                                    "coordinates": f"{lat},{lon}",
                                    "source": "google_geocoding_api"
                                }
                            else:
                                print(f"Location {location_input} found but outside Gujarat coastal region.")
                                # Return error information instead of defaulting to Kandla
                                return {
                                    "name": f"{location_input}",
                                    "lat": lat,
                                    "lon": lon,
                                    "state": "Outside Gujarat",
                                    "country": "India",
                                    "timezone": "IST",
                                    "port_type": "Outside Gujarat Region",
                                    "coordinates": f"{lat},{lon}",
                                    "source": "google_geocoding_api",
                                    "error": "Location outside Gujarat coastal region"
                                }
            except Exception as e:
                print(f"Error calling Google Geocoding API: {e}")
            
            # If no API results, return error
            print(f"Location '{location_input}' not found via APIs.")
            return {
                "name": f"{location_input}",
                "lat": None,
                "lon": None,
                "state": "Not Found",
                "country": "Unknown",
                "timezone": "Unknown",
                "port_type": "Location Not Found",
                "coordinates": "Unknown",
                "source": "api_search_failed",
                "error": "Location not found via geocoding APIs"
            }
            
        except Exception as e:
            print(f"Error getting location info: {e}")
            return self.coastal_cities["kandla"]
    
    def _determine_port_type(self, nominatim_data: Dict, location_name: str) -> str:
        """Determine port type based on Nominatim data"""
        try:
            # Check address components for port-related terms
            address = nominatim_data.get("address", {})
            display_name = nominatim_data.get("display_name", "").lower()
            location_lower = location_name.lower()
            
            # Check for port-related terms
            port_terms = ["port", "harbor", "dock", "wharf", "marina"]
            fishing_terms = ["fishing", "fish", "seafood", "harbor"]
            industrial_terms = ["industrial", "chemical", "petrochemical", "refinery"]
            tourist_terms = ["beach", "resort", "tourism", "temple", "religious"]
            
            # Determine port type based on context
            if any(term in display_name or term in location_lower for term in port_terms):
                if "major" in display_name or "major" in location_lower:
                    return "Major Port"
                elif "private" in display_name or "private" in location_lower:
                    return "Private Port"
                else:
                    return "Minor Port"
            elif any(term in display_name or term in location_lower for term in fishing_terms):
                return "Fishing Port"
            elif any(term in display_name or term in location_lower for term in industrial_terms):
                return "Industrial Port"
            elif any(term in display_name or term in location_lower for term in tourist_terms):
                return "Tourist Port"
            else:
                return "Coastal Area"
                
        except Exception as e:
            print(f"Error determining port type: {e}")
            return "Coastal Area"
    
    def _determine_port_type_from_google(self, google_data: Dict, location_name: str) -> str:
        """Determine port type based on Google Geocoding data"""
        try:
            # Check address components for port-related terms
            address_components = google_data.get("address_components", [])
            formatted_address = google_data.get("formatted_address", "").lower()
            location_lower = location_name.lower()
            
            # Check for port-related terms
            port_terms = ["port", "harbor", "dock", "wharf", "marina"]
            fishing_terms = ["fishing", "fish", "seafood", "harbor"]
            industrial_terms = ["industrial", "chemical", "petrochemical", "refinery"]
            tourist_terms = ["beach", "resort", "tourism", "temple", "religious"]
            
            # Determine port type based on context
            if any(term in formatted_address or term in location_lower for term in port_terms):
                if "major" in formatted_address or "major" in location_lower:
                    return "Major Port"
                elif "private" in formatted_address or "private" in location_lower:
                    return "Private Port"
                else:
                    return "Minor Port"
            elif any(term in formatted_address or term in location_lower for term in fishing_terms):
                return "Fishing Port"
            elif any(term in formatted_address or term in location_lower for term in industrial_terms):
                return "Industrial Port"
            elif any(term in formatted_address or term in location_lower for term in tourist_terms):
                return "Tourist Port"
            else:
                return "Coastal Area"
                
        except Exception as e:
            print(f"Error determining port type from Google: {e}")
            return "Coastal Area"
    
    def get_weather_data(self, location_input: str = "kandla") -> Dict:
        """Get realistic weather data based on location and time"""
        try:
            location_info = self.get_location_info(location_input)
            lat, lon = location_info["lat"], location_info["lon"]
            
            # Try OpenWeather API first
            api_key = os.getenv("OPENWEATHER_API_KEY")
            if api_key:
                url = f"http://api.openweathermap.org/data/2.5/weather"
                params = {
                    "lat": lat,
                    "lon": lon,
                    "appid": api_key,
                    "units": "metric"
                }
                response = self.session.get(url, params=params, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "timestamp": datetime.utcnow(),
                        "location": location_info["coordinates"],
                        "city_name": location_info["name"],
                        "country": location_info["country"],
                        "timezone": location_info["timezone"],
                        "temperature": data["main"]["temp"],
                        "humidity": data["main"]["humidity"],
                        "wind_speed": data["wind"]["speed"],
                        "wind_direction": data["wind"]["deg"],
                        "pressure": data["main"]["pressure"],
                        "description": data["weather"][0]["description"],
                        "source": "openweather_api"
                    }
            
            # Fallback to realistic simulation
            return self._generate_realistic_weather(lat, lon, location_info)
            
        except Exception as e:
            print(f"Error getting weather data: {e}")
            location_info = self.get_location_info(location_input)
            return self._generate_realistic_weather(location_info["lat"], location_info["lon"], location_info)
    
    def get_tide_data(self, location_input: str = "kandla") -> Dict:
        """Get realistic tide data based on location and time"""
        try:
            location_info = self.get_location_info(location_input)
            lat, lon = location_info["lat"], location_info["lon"]
            
            # Try NOAA API for tide data
            noaa_key = os.getenv("NOAA_API_KEY")
            if noaa_key:
                # Find nearest NOAA station
                station_id = self._find_nearest_noaa_station(lat, lon)
                if station_id:
                    url = f"https://api.tidesandcurrents.noaa.gov/api/prod/datagetter"
                    params = {
                        "station": station_id,
                        "product": "predictions",
                        "datum": "MLLW",
                        "time_zone": "lst_ldt",
                        "interval": "h",
                        "format": "json",
                        "range": "24",
                        "units": "metric"
                    }
                    
                    response = self.session.get(url, params=params, timeout=10)
                    if response.status_code == 200:
                        data = response.json()
                        if "predictions" in data and data["predictions"]:
                            latest = data["predictions"][-1]
                            return {
                                "timestamp": datetime.utcnow(),
                                "location": location_info["coordinates"],
                                "city_name": location_info["name"],
                                "country": location_info["country"],
                                "timezone": location_info["timezone"],
                                "tide_height": float(latest["v"]),
                                "tide_type": "high" if "H" in latest["type"] else "low",
                                "source": "noaa_api"
                            }
            
            # Fallback to realistic simulation
            return self._generate_realistic_tide(location_info)
            
        except Exception as e:
            print(f"Error getting tide data: {e}")
            location_info = self.get_location_info(location_input)
            return self._generate_realistic_tide(location_info)
    
    def get_ocean_data(self, location_input: str = "kandla") -> Dict:
        """Get realistic ocean data based on location and time"""
        try:
            location_info = self.get_location_info(location_input)
            lat, lon = location_info["lat"], location_info["lon"]
            
            return self._generate_realistic_ocean(lat, lon, location_info)
            
        except Exception as e:
            print(f"Error getting ocean data: {e}")
            location_info = self.get_location_info(location_input)
            return self._generate_realistic_ocean(location_info["lat"], location_info["lon"], location_info)
    
    def get_pollution_data(self, location_input: str = "kandla") -> Dict:
        """Get realistic pollution data based on location and time"""
        try:
            location_info = self.get_location_info(location_input)
            lat, lon = location_info["lat"], location_info["lon"]
            
            # Try WAQI API for air quality data
            api_key = os.getenv("WAQI_API_KEY")
            if api_key:
                url = f"https://api.waqi.info/feed/geo:{lat};{lon}/?token={api_key}"
                response = self.session.get(url, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    if data["status"] == "ok":
                        aqi = data["data"]["aqi"]
                        return {
                            "timestamp": datetime.utcnow(),
                            "location": location_info["coordinates"],
                            "city_name": location_info["name"],
                            "country": location_info["country"],
                            "timezone": location_info["timezone"],
                            "water_quality": "good" if aqi < 50 else "moderate" if aqi < 100 else "poor",
                            "pollution_level": "low" if aqi < 50 else "moderate" if aqi < 100 else "high",
                            "alerts": [],
                            "monitoring_data": {
                                "turbidity": 10.0 + random.uniform(-3, 3),
                                "dissolved_oxygen": 7.0 + random.uniform(-0.5, 0.5),
                                "ph": 7.0 + random.uniform(-0.3, 0.3),
                                "bacteria_count": 100 + random.randint(-30, 50)
                            },
                            "illegal_dumping_detected": random.choice([True, False]),
                            "suspicious_activity": [],
                            "source": "waqi_api"
                        }
            
            # Fallback to realistic simulation
            return self._generate_realistic_pollution(location_info)
            
        except Exception as e:
            print(f"Error getting pollution data: {e}")
            location_info = self.get_location_info(location_input)
            return self._generate_realistic_pollution(location_info)
    
    def get_comprehensive_data(self, location_input: str = "kandla") -> Dict:
        """Get comprehensive coastal data for any location"""
        try:
            location_info = self.get_location_info(location_input)
            
            # Get data from all sources
            weather_data = self.get_weather_data(location_input)
            tide_data = self.get_tide_data(location_input)
            ocean_data = self.get_ocean_data(location_input)
            pollution_data = self.get_pollution_data(location_input)
            
            return {
                "timestamp": datetime.utcnow(),
                "location": location_info["coordinates"],
                "city_name": location_info["name"],
                "country": location_info["country"],
                "timezone": location_info["timezone"],
                "weather": weather_data,
                "tide": tide_data,
                "ocean": ocean_data,
                "pollution": pollution_data,
                "source": "unified_data_service"
            }
            
        except Exception as e:
            print(f"Error getting comprehensive data: {e}")
            location_info = self.get_location_info(location_input)
            
            # Return realistic fallback data
            return {
                "timestamp": datetime.utcnow(),
                "location": location_info["coordinates"],
                "city_name": location_info["name"],
                "country": location_info["country"],
                "timezone": location_info["timezone"],
                "weather": self._generate_realistic_weather(location_info["lat"], location_info["lon"], location_info),
                "tide": self._generate_realistic_tide(location_info),
                "ocean": self._generate_realistic_ocean(location_info["lat"], location_info["lon"], location_info),
                "pollution": self._generate_realistic_pollution(location_info),
                "source": "realistic_simulation"
            }
    
    def get_available_locations(self) -> List[Dict]:
        """Get list of available coastal locations - Dynamic with API fallback"""
        # Start with predefined locations as fallback
        locations = [
            {"id": city_key, **city_info} 
            for city_key, city_info in self.coastal_cities.items()
        ]
        
        # Note: The system now supports dynamic location search via APIs
        # Users can search for any coastal location in Gujarat
        # The predefined list serves as a fallback for known locations
        
        return locations
    
    def _find_nearest_noaa_station(self, lat: float, lon: float) -> Optional[str]:
        """Find the nearest NOAA tide station to given coordinates"""
        stations = {
            "9447130": {"name": "Seattle", "lat": 47.6026, "lon": -122.3393},
            "9410230": {"name": "San Diego", "lat": 32.7157, "lon": -117.1611},
            "9413450": {"name": "Monterey", "lat": 36.6050, "lon": -121.8880},
            "9414290": {"name": "San Francisco", "lat": 37.8063, "lon": -122.4659}
        }
        
        nearest_station = None
        min_distance = float('inf')
        
        for station_id, station_info in stations.items():
            distance = math.sqrt((lat - station_info["lat"])**2 + (lon - station_info["lon"])**2)
            if distance < min_distance:
                min_distance = distance
                nearest_station = station_id
        
        return nearest_station
    
    def _generate_realistic_weather(self, lat: float, lon: float, location_info: Dict) -> Dict:
        """Generate realistic weather data based on location and current conditions"""
        now = datetime.utcnow()
        hour = now.hour
        
        # Adjust temperature based on latitude and time
        if abs(lat) < 23.5:  # Tropical
            base_temp = 28 + random.uniform(-2, 2)
        elif abs(lat) < 45:  # Temperate
            base_temp = 18 + random.uniform(-3, 3)
        else:  # Polar
            base_temp = 8 + random.uniform(-4, 4)
        
        # Adjust for day/night cycle
        if 6 <= hour <= 18:  # Daytime
            base_temp += 6
        else:  # Nighttime
            base_temp -= 4
        
        # Realistic wind patterns
        if 10 <= hour <= 16:  # Afternoon winds
            wind_speed = 12 + random.uniform(-3, 8)
        else:
            wind_speed = 6 + random.uniform(-2, 4)
        
        return {
            "timestamp": now,
            "location": location_info["coordinates"],
            "city_name": location_info["name"],
            "country": location_info["country"],
            "timezone": location_info["timezone"],
            "temperature": round(base_temp, 1),
            "humidity": random.randint(65, 85),
            "wind_speed": round(max(0, wind_speed), 1),
            "wind_direction": random.randint(0, 360),
            "pressure": 1013 + random.uniform(-12, 12),
            "description": "partly cloudy",
            "source": "realistic_simulation"
        }
    
    def _generate_realistic_tide(self, location_info: Dict) -> Dict:
        """Generate realistic tide data based on lunar cycles"""
        now = datetime.utcnow()
        hour = now.hour
        
        # Enhanced tide simulation with high/low tides
        # Base tide height varies by location (Gujarat has significant tidal range)
        base_height = 2.0  # Base tide height for Gujarat coast
        
        # Calculate current tide height (varies throughout the day)
        tide_height = base_height + 1.5 * math.sin((hour - 6) * math.pi / 12)
        
        # Calculate high and low tides for the day
        # High tide typically occurs around 6 AM and 6 PM
        high_tide_1 = base_height + 1.5  # Around 6 AM
        high_tide_2 = base_height + 1.5  # Around 6 PM
        low_tide_1 = base_height - 1.5   # Around 12 PM
        low_tide_2 = base_height - 1.5   # Around 12 AM
        
        # Determine current tide type and status
        if 5 <= hour <= 7 or 17 <= hour <= 19:
            tide_type = "high"
            status = "High Tide"
        elif 11 <= hour <= 13 or 23 <= hour <= 1:
            tide_type = "low"
            status = "Low Tide"
        else:
            tide_type = "rising" if (6 <= hour <= 12 or 18 <= hour <= 24) else "falling"
            status = "Rising" if tide_type == "rising" else "Falling"
        
        # Calculate tide range (difference between high and low)
        tide_range = round(high_tide_1 - low_tide_1, 2)
        
        return {
            "timestamp": now,
            "location": location_info["coordinates"],
            "city_name": location_info["name"],
            "country": location_info["country"],
            "timezone": location_info["timezone"],
            "tide_height": round(tide_height, 2),
            "tide_type": tide_type,
            "status": status,
            "high_tide": round(high_tide_1, 2),
            "low_tide": round(low_tide_1, 2),
            "tide_range": tide_range,
            "next_high_tide": "06:00" if hour < 6 else "18:00" if hour < 18 else "06:00 (tomorrow)",
            "next_low_tide": "12:00" if hour < 12 else "00:00" if hour < 24 else "12:00 (tomorrow)",
            "source": "realistic_simulation"
        }
    
    def _generate_realistic_ocean(self, lat: float, lon: float, location_info: Dict) -> Dict:
        """Generate realistic ocean data based on location"""
        now = datetime.utcnow()
        hour = now.hour
        
        # Realistic wave patterns
        if 8 <= hour <= 16:  # Daytime waves
            wave_height = 1.8 + random.uniform(-0.3, 0.8)
        else:
            wave_height = 1.2 + random.uniform(-0.2, 0.4)
        
        return {
            "timestamp": now,
            "location": location_info["coordinates"],
            "city_name": location_info["name"],
            "country": location_info["country"],
            "timezone": location_info["timezone"],
            "wave_height": round(wave_height, 1),
            "wave_period": 8.0 + random.uniform(-1, 1),
            "current_speed": 0.3 + random.uniform(-0.1, 0.2),
            "current_direction": 45 + random.uniform(-15, 15),
            "sea_surface_temp": 26.5 + random.uniform(-1, 1),
            "source": "realistic_simulation"
        }
    
    def _generate_realistic_pollution(self, location_info: Dict) -> Dict:
        """Generate realistic pollution data based on location and time"""
        now = datetime.utcnow()
        hour = now.hour
        
        # Pollution varies by time of day
        if 7 <= hour <= 9 or 17 <= hour <= 19:  # Rush hours
            pollution_level = "moderate"
            bacteria_count = 180 + random.randint(-40, 80)
        else:
            pollution_level = "low"
            bacteria_count = 90 + random.randint(-25, 40)
        
        return {
            "timestamp": now,
            "location": location_info["coordinates"],
            "city_name": location_info["name"],
            "country": location_info["country"],
            "timezone": location_info["timezone"],
            "water_quality": "good" if pollution_level == "low" else "moderate",
            "pollution_level": pollution_level,
            "alerts": [],
            "monitoring_data": {
                "turbidity": 10.0 + random.uniform(-2, 2),
                "dissolved_oxygen": 7.0 + random.uniform(-0.4, 0.4),
                "ph": 7.0 + random.uniform(-0.2, 0.2),
                "bacteria_count": bacteria_count
            },
            "illegal_dumping_detected": random.choice([True, False]),
            "suspicious_activity": [],
            "source": "realistic_simulation"
        }
