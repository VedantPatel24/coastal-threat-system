from datetime import datetime, timedelta
from typing import Dict, List
import random
import sys
import os

# Add the ml directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'ml'))
from smart_threat_detector import SmartThreatDetector
from .flood_prediction_service import FloodPredictionService

class SimpleAlertService:
    """
    Simplified alert service for coastal threat monitoring
    Now with SMART ML that works with minimal data!
    """
    
    def __init__(self):
        self.alert_types = {
            "flood_risk": "AI Flood Prediction Alert",
            "high_tide": "High tide warning",
            "storm_risk": "Storm conditions detected",
            "pollution": "Water quality alert",
            "rough_seas": "Rough sea conditions",
            "coastal_threat": "Coastal threat detected"
        }
        
        self.severity_levels = ["low", "medium", "high", "critical"]
        
        # Initialize the smart ML threat detector
        self.ml_detector = SmartThreatDetector()
        
        # Initialize the flood prediction service
        self.flood_predictor = FloodPredictionService()
    
    def generate_alerts_from_data(self, weather_data: Dict, tide_data: Dict, ocean_data: Dict, pollution_data: Dict) -> List[Dict]:
        """Generate alerts using AI Flood Prediction and SMART ML"""
        alerts = []
        
        # Generate AI-powered flood prediction alert
        if weather_data and tide_data and ocean_data:
            flood_prediction = self.flood_predictor.predict_flood(weather_data, tide_data, ocean_data)
            
            # Create flood prediction alert
            flood_alert = self._create_flood_alert(flood_prediction, weather_data.get('city_name', 'Unknown Location'))
            alerts.append(flood_alert)
        
        # Combine all data for ML analysis
        combined_data = {}
        if weather_data:
            combined_data.update(weather_data)
        if tide_data:
            combined_data.update(tide_data)
        if ocean_data:
            combined_data.update(ocean_data)
        if pollution_data:
            combined_data.update(pollution_data)
        
        # Use SMART ML to detect other threats
        ml_threats = self.ml_detector.detect_threats(combined_data)
        
        # Convert ML threats to alerts
        for threat in ml_threats:
            alerts.append(self._create_alert(
                threat['type'],
                threat['severity'],
                threat['location'],
                threat['description'],
                'smart_ml'
            ))
        
        return alerts
    
    def _create_alert(self, alert_type: str, severity: str, location: str, description: str, triggered_by: str) -> Dict:
        """Create an alert object"""
        return {
            "id": f"alert_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{random.randint(1000, 9999)}",
            "alert_type": alert_type,
            "severity": severity,
            "location": location,
            "description": description,
            "is_active": True,
            "triggered_by": triggered_by,
            "timestamp": datetime.utcnow().isoformat(),
            "source": "smart_ml_alert_service"
        }
    
    def _create_flood_alert(self, flood_prediction: Dict, location_name: str) -> Dict:
        """Create a flood prediction alert based on AI analysis"""
        # Map flood risk levels to alert severity
        risk_to_severity = {
            "critical": "critical",
            "high": "high", 
            "medium": "medium",
            "low": "low",
            "minimal": "low"
        }
        
        severity = risk_to_severity.get(flood_prediction.get("risk_level", "low"), "low")
        
        # Create comprehensive flood alert
        return {
            "id": f"flood_alert_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{random.randint(1000, 9999)}",
            "alert_type": "flood_risk",
            "severity": severity,
            "location": location_name,
            "description": flood_prediction.get("warning_message", "Flood risk assessment"),
            "is_active": True,
            "triggered_by": "ai_flood_prediction",
            "timestamp": datetime.utcnow().isoformat(),
            "source": "ai_flood_prediction_service",
            "flood_data": {
                "probability": flood_prediction.get("flood_probability", 0),
                "risk_level": flood_prediction.get("risk_level", "unknown"),
                "confidence": flood_prediction.get("confidence", 0),
                "recommendations": flood_prediction.get("recommendations", []),
                "features_used": flood_prediction.get("features_used", {})
            }
        }
    
    def get_active_alerts(self) -> List[Dict]:
        """Get currently active alerts (for demo purposes, returns sample alerts)"""
        sample_alerts = [
            {
                "id": "alert_20250830_001",
                "alert_type": "flood_risk",
                "severity": "medium",
                "location": "Kandla, Gujarat",
                "description": "AI predicts 45% flood probability. Monitor tide levels and weather conditions.",
                "is_active": True,
                "triggered_by": "ai_flood_prediction",
                "timestamp": (datetime.utcnow() - timedelta(minutes=15)).isoformat(),
                "source": "ai_flood_prediction_service",
                "flood_data": {
                    "probability": 45.2,
                    "risk_level": "medium",
                    "confidence": 78.5,
                    "recommendations": ["⚠️ Monitor water levels closely", "📱 Stay updated with weather alerts"],
                    "features_used": {
                        "temperature": 28.5,
                        "humidity": 75,
                        "wind_speed": 25,
                        "pressure": 1008,
                        "tide_height": 2.8,
                        "wave_height": 2.1
                    }
                }
            },
            {
                "id": "alert_20250830_002",
                "alert_type": "high_tide",
                "severity": "low",
                "location": "19.0760,72.8777",
                "description": "ML detected high tide approaching: 2.8m expected in next 2 hours.",
                "is_active": True,
                "triggered_by": "smart_ml",
                "timestamp": (datetime.utcnow() - timedelta(minutes=30)).isoformat(),
                "source": "smart_ml_alert_service"
            }
        ]
        return sample_alerts
    
    def deactivate_alert(self, alert_id: str) -> bool:
        """Deactivate an alert (for demo purposes)"""
        # In a real system, this would update the database
        return True
    
    def get_ml_system_info(self) -> Dict:
        """Get information about the ML system"""
        return {
            "ml_system": self.ml_detector.get_ml_stats(),
            "alert_service": {
                "total_alerts_generated": "Dynamic based on data",
                "ml_integration": "Fully integrated",
                "data_efficiency": "Minimal data requirements",
                "real_time_processing": "Yes"
            }
        }
