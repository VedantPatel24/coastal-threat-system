from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
import json
from datetime import datetime, timedelta

from db.models import get_db, WeatherData, TideData
from services.unified_data_service import UnifiedDataService
from services.simple_alert_service import SimpleAlertService
from services.flood_prediction_service import FloodPredictionService

router = APIRouter(prefix="/api", tags=["coastal-threats"])

# Initialize simplified services
data_service = UnifiedDataService()
alert_service = SimpleAlertService()
flood_predictor = FloodPredictionService()

@router.get("/")
async def root():
    """Root endpoint with system information"""
    return {
        "message": "Gujarat Coastal Threat Alert System API",
        "version": "2.0.0",
        "status": "operational",
        "description": "AI-Powered Coastal Monitoring & Early Warning System for Gujarat State",
        "endpoints": {
            "data": "/api/data/{location} - Get coastal data for specific Gujarat location",
            "locations": "/api/locations - Get available Gujarat coastal cities",
            "alerts": "/api/alerts - Get active alerts",
            "flood_prediction": "/api/flood-prediction/{location} - Get AI flood prediction for location",
            "health": "/api/health - System health check"
        }
    }

@router.get("/data/{location}")
async def get_data_for_location(
    location: str,
    db: Session = Depends(get_db)
):
    """Get comprehensive coastal data for ANY specific location"""
    try:
        # Get comprehensive data from unified service
        comprehensive_data = data_service.get_comprehensive_data(location)
        
        # Generate alerts based on the data
        alerts = alert_service.generate_alerts_from_data(
            comprehensive_data.get("weather"),
            comprehensive_data.get("tide"),
            comprehensive_data.get("ocean"),
            comprehensive_data.get("pollution")
        )
        
        # Store weather and tide data in database
        if comprehensive_data.get("weather"):
            weather_data_filtered = {k: v for k, v in comprehensive_data["weather"].items() 
                                   if k in ["timestamp", "location", "temperature", "humidity", 
                                           "wind_speed", "wind_direction", "pressure", "description", "source"]}
            weather_db = WeatherData(**weather_data_filtered)
            db.add(weather_db)
        
        if comprehensive_data.get("tide"):
            tide_data_filtered = {k: v for k, v in comprehensive_data["tide"].items() 
                                if k in ["timestamp", "location", "tide_height", "tide_type", "source"]}
            tide_db = TideData(**tide_data_filtered)
            db.add(tide_db)
        
        db.commit()
        
        return {
            "status": "success",
            "timestamp": comprehensive_data["timestamp"],
            "location": comprehensive_data["location"],
            "city_name": comprehensive_data["city_name"],
            "country": comprehensive_data["country"],
            "timezone": comprehensive_data["timezone"],
            "data": comprehensive_data,
            "alerts_generated": len(alerts),
            "source": "unified_data_service"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data for location {location}: {str(e)}")

@router.get("/locations")
async def get_available_locations():
    """Get list of available Gujarat coastal locations"""
    try:
        return {
            "locations": data_service.get_available_locations(),
            "status": "success",
            "total_cities": len(data_service.get_available_locations())
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching locations: {str(e)}")

@router.get("/alerts")
async def get_alerts():
    """Get currently active alerts"""
    try:
        alerts = alert_service.get_active_alerts()
        return {
            "status": "success",
            "alerts": alerts,
            "total_alerts": len(alerts),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching alerts: {str(e)}")

@router.delete("/alerts/{alert_id}")
async def deactivate_alert(alert_id: str):
    """Deactivate an alert"""
    try:
        success = alert_service.deactivate_alert(alert_id)
        if success:
            return {
                "status": "success",
                "message": f"Alert {alert_id} deactivated successfully"
            }
        else:
            raise HTTPException(status_code=404, detail="Alert not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deactivating alert: {str(e)}")

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Gujarat Coastal Threat Alert System",
        "version": "2.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "components": {
            "data_service": "operational",
            "alert_service": "operational",
            "database": "operational"
        }
    }

@router.get("/demo/{location}")
async def get_demo_data(location: str):
    """Get demo data for presentation purposes"""
    try:
        # Get comprehensive data
        data = data_service.get_comprehensive_data(location)
        
        # Add some demo alerts
        demo_alerts = [
            {
                "id": "demo_001",
                "alert_type": "storm_risk",
                "severity": "medium",
                "location": data["location"],
                "description": "Demo: Storm conditions detected. This is a demonstration alert.",
                "is_active": True,
                "triggered_by": "demo_mode",
                "timestamp": datetime.utcnow().isoformat(),
                "source": "demo_service"
            }
        ]
        
        return {
            "status": "success",
            "message": "Demo data for presentation",
            "location": data["city_name"],
            "data": data,
            "demo_alerts": demo_alerts,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating demo data: {str(e)}")

@router.get("/ml/info")
async def get_ml_system_info():
    """Get information about the smart ML system"""
    try:
        return {
            "status": "success",
            "ml_system": alert_service.get_ml_system_info(),
            "message": "Smart ML system working with minimal data requirements",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting ML info: {str(e)}")

@router.get("/flood-prediction/{location}")
async def get_flood_prediction(location: str):
    """Get AI-powered flood prediction for a specific location"""
    try:
        # Get current data for the location
        comprehensive_data = data_service.get_comprehensive_data(location)
        
        # Make flood prediction using AI
        flood_prediction = flood_predictor.predict_flood(
            comprehensive_data.get("weather", {}),
            comprehensive_data.get("tide", {}),
            comprehensive_data.get("ocean", {})
        )
        
        return {
            "status": "success",
            "location": location,
            "city_name": comprehensive_data.get("city_name", location),
            "flood_prediction": flood_prediction,
            "current_conditions": {
                "weather": comprehensive_data.get("weather", {}),
                "tide": comprehensive_data.get("tide", {}),
                "ocean": comprehensive_data.get("ocean", {})
            },
            "timestamp": datetime.utcnow().isoformat(),
            "source": "ai_flood_prediction_service"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting flood prediction: {str(e)}")

@router.get("/flood-prediction/model/info")
async def get_flood_model_info():
    """Get information about the trained flood prediction model"""
    try:
        model_info = flood_predictor.get_model_info()
        return {
            "status": "success",
            "model_info": model_info,
            "message": "AI Flood Prediction Model Information",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting model info: {str(e)}")

@router.post("/flood-prediction/model/retrain")
async def retrain_flood_model():
    """Retrain the flood prediction model with current data"""
    try:
        result = flood_predictor.retrain_model()
        return {
            "status": "success",
            "retraining_result": result,
            "message": "Flood prediction model retraining initiated",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retraining model: {str(e)}")
