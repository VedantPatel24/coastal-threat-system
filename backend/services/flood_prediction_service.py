import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
from datetime import datetime
from typing import Dict, List, Tuple
import warnings
warnings.filterwarnings('ignore')

class FloodPredictionService:
    """
    AI-Powered Flood Prediction Service for Gujarat Coastal Areas
    Uses machine learning to predict flood occurrences based on environmental conditions
    """
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.is_trained = False
        self.model_path = "flood_prediction_model.pkl"
        self.scaler_path = "flood_scaler.pkl"
        self.csv_path = "flood_data_1000.csv"
        
        # Try to load existing model, otherwise train new one
        self._load_or_train_model()
    
    def _load_or_train_model(self):
        """Load existing trained model or train a new one"""
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
                self.model = joblib.load(self.model_path)
                self.scaler = joblib.load(self.scaler_path)
                self.is_trained = True
                print("✅ Loaded existing flood prediction model")
            else:
                print("🔄 Training new flood prediction model...")
                self._train_model()
        except Exception as e:
            print(f"⚠️ Error loading model: {e}")
            print("🔄 Training new flood prediction model...")
            self._train_model()
    
    def _train_model(self):
        """Train the flood prediction model on the CSV data"""
        try:
            # Load and prepare data
            df = pd.read_csv(self.csv_path)
            print(f"📊 Loaded {len(df)} flood data records")
            
            # Prepare features (input variables)
            feature_columns = [
                'Temperature (°C)', 'Humidity (%)', 'Wind Speed (km/h)', 
                'Pressure (hPa)', 'Tide Height (m)', 'Ocean Wave Height (m)'
            ]
            
            X = df[feature_columns].values
            y = df['Flood Occurred'].values
            
            # Split data for training and testing
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Train Random Forest model
            self.model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                n_jobs=-1
            )
            
            self.model.fit(X_train_scaled, y_train)
            
            # Evaluate model
            y_pred = self.model.predict(X_test_scaled)
            accuracy = accuracy_score(y_test, y_pred)
            
            print(f"🎯 Model trained successfully!")
            print(f"📈 Accuracy: {accuracy:.2%}")
            print(f"📊 Classification Report:")
            print(classification_report(y_test, y_pred))
            
            # Save model and scaler
            joblib.dump(self.model, self.model_path)
            joblib.dump(self.scaler, self.scaler_path)
            
            self.is_trained = True
            print("💾 Model saved successfully")
            
        except Exception as e:
            print(f"❌ Error training model: {e}")
            self.is_trained = False
    
    def predict_flood(self, weather_data: Dict, tide_data: Dict, ocean_data: Dict) -> Dict:
        """
        Predict flood probability based on current conditions
        
        Args:
            weather_data: Current weather conditions
            tide_data: Current tide conditions  
            ocean_data: Current ocean conditions
            
        Returns:
            Dictionary with flood prediction results
        """
        if not self.is_trained:
            return {
                "flood_probability": 0.0,
                "flood_risk": "Unknown",
                "risk_level": "unknown",
                "confidence": 0.0,
                "warning_message": "Model not trained",
                "recommendations": ["System not ready for predictions"],
                "timestamp": datetime.utcnow().isoformat()
            }
        
        try:
            # Extract features in the same order as training data
            features = np.array([
                weather_data.get('temperature', 25.0),
                weather_data.get('humidity', 70.0),
                weather_data.get('wind_speed', 20.0),
                weather_data.get('pressure', 1013.0),
                tide_data.get('tide_height', 2.0),
                ocean_data.get('wave_height', 1.5)
            ]).reshape(1, -1)
            
            # Scale features
            features_scaled = self.scaler.transform(features)
            
            # Make prediction
            flood_probability = self.model.predict_proba(features_scaled)[0][1]
            
            # Determine risk level and message
            risk_level, risk_label, warning_message = self._get_risk_assessment(flood_probability)
            
            # Generate recommendations
            recommendations = self._get_recommendations(flood_probability, weather_data, tide_data, ocean_data)
            
            return {
                "flood_probability": round(flood_probability * 100, 2),
                "flood_risk": risk_label,
                "risk_level": risk_level,
                "confidence": round(self._get_confidence_score(flood_probability), 2),
                "warning_message": warning_message,
                "recommendations": recommendations,
                "timestamp": datetime.utcnow().isoformat(),
                "features_used": {
                    "temperature": features[0][0],
                    "humidity": features[0][1],
                    "wind_speed": features[0][2],
                    "pressure": features[0][3],
                    "tide_height": features[0][4],
                    "wave_height": features[0][5]
                }
            }
            
        except Exception as e:
            print(f"❌ Error making flood prediction: {e}")
            return {
                "flood_probability": 0.0,
                "flood_risk": "Error",
                "risk_level": "error",
                "confidence": 0.0,
                "warning_message": f"Prediction error: {str(e)}",
                "recommendations": ["Contact system administrator"],
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def _get_risk_assessment(self, probability: float) -> Tuple[str, str, str]:
        """Determine risk level and warning message based on probability"""
        if probability >= 0.8:
            return "critical", "Critical Flood Risk", "🚨 CRITICAL: High probability of flooding detected!"
        elif probability >= 0.6:
            return "high", "High Flood Risk", "⚠️ HIGH: Significant flood risk detected"
        elif probability >= 0.4:
            return "medium", "Medium Flood Risk", "🟡 MEDIUM: Moderate flood risk detected"
        elif probability >= 0.2:
            return "low", "Low Flood Risk", "🟢 LOW: Low flood risk detected"
        else:
            return "minimal", "Minimal Flood Risk", "✅ MINIMAL: Very low flood risk"
    
    def _get_confidence_score(self, probability: float) -> float:
        """Calculate confidence score based on probability distribution"""
        # Higher confidence when probability is closer to 0 or 1
        # Lower confidence when probability is around 0.5
        return abs(probability - 0.5) * 2 * 100
    
    def _get_recommendations(self, probability: float, weather: Dict, tide: Dict, ocean: Dict) -> List[str]:
        """Generate specific recommendations based on current conditions"""
        recommendations = []
        
        if probability >= 0.6:
            recommendations.append("🚨 Evacuate low-lying areas immediately")
            recommendations.append("📞 Contact emergency services")
            recommendations.append("🏠 Move to higher ground")
        
        if probability >= 0.4:
            recommendations.append("⚠️ Monitor water levels closely")
            recommendations.append("📱 Stay updated with weather alerts")
            recommendations.append("🚗 Avoid coastal roads and bridges")
        
        # Specific recommendations based on conditions
        if tide.get('tide_height', 0) > 3.0:
            recommendations.append("🌊 High tide detected - monitor coastal areas")
        
        if ocean.get('wave_height', 0) > 4.0:
            recommendations.append("🌊 High waves detected - avoid coastal activities")
        
        if weather.get('wind_speed', 0) > 80:
            recommendations.append("💨 High winds detected - secure loose objects")
        
        if weather.get('pressure', 1013) < 1000:
            recommendations.append("🌪️ Low pressure system - monitor storm development")
        
        if not recommendations:
            recommendations.append("✅ Conditions appear normal - continue monitoring")
        
        return recommendations
    
    def get_model_info(self) -> Dict:
        """Get information about the trained model"""
        return {
            "is_trained": self.is_trained,
            "model_type": "Random Forest Classifier",
            "features": [
                "Temperature (°C)", "Humidity (%)", "Wind Speed (km/h)",
                "Pressure (hPa)", "Tide Height (m)", "Ocean Wave Height (m)"
            ],
            "target": "Flood Occurred (True/False)",
            "training_data_size": "1000+ records",
            "last_trained": datetime.fromtimestamp(
                os.path.getmtime(self.model_path) if os.path.exists(self.model_path) else 0
            ).isoformat() if self.is_trained else "Never"
        }
    
    def retrain_model(self) -> Dict:
        """Retrain the model with current data"""
        print("🔄 Retraining flood prediction model...")
        self._train_model()
        return {
            "status": "success" if self.is_trained else "failed",
            "message": "Model retrained successfully" if self.is_trained else "Failed to retrain model",
            "timestamp": datetime.utcnow().isoformat()
        }

