# 🌊 Gujarat Coastal Threat Alert System

**AI-Powered Coastal Monitoring & Early Warning System for Gujarat State**

Built for **HackOut'25** by Team Titans - Protecting Gujarat's Coastal Communities

## 🚀 **What This System Does**

This is a **professional-grade coastal monitoring system** specifically designed for Gujarat state. It monitors coastal threats in real-time and provides early warnings for:

- **Weather Conditions** - Temperature, wind, pressure, humidity
- **Tide Information** - Height, timing, changes
- **Ocean Conditions** - Waves, currents, sea temperature
- **Pollution Alerts** - Water quality, illegal dumping detection
- **Threat Warnings** - Storms, high winds, flooding risks

## 🌍 **Gujarat Coastal Coverage**

Monitor **Gujarat's coastal areas**:
- **Kandla** 🇮🇳 - Major Port
- **Mundra** 🇮🇳 - Private Port
- **Bhavnagar** 🇮🇳 - Minor Port
- **Surat** 🇮🇳 - Minor Port
- **Bharuch** 🇮🇳 - Minor Port
- **Veraval** 🇮🇳 - Fishing Port
- **Porbandar** 🇮🇳 - Minor Port
- **Okha** 🇮🇳 - Minor Port
- **Diu** 🇮🇳 - Tourist Port
- **Ghogha** 🇮🇳 - Minor Port
- **Custom coordinates** - Within Gujarat coastal region (20°N-24.5°N, 69°E-73°E)

## ✨ **Key Features**

### 🎯 **Simple & Intuitive**
- **No technical knowledge required**
- **Professional enterprise-grade UI**
- **Helpful tooltips everywhere**
- **Clear visual indicators**

### 📊 **Real-Time Data**
- **Live weather updates** every minute
- **Realistic tide simulations** based on lunar cycles
- **Ocean condition monitoring** with wave analysis
- **Pollution detection** and water quality alerts

### 🚨 **Smart Alert System**
- **AI-powered threat detection**
- **Severity-based warnings** (Low, Medium, High, Critical)
- **Automatic alert generation** based on data thresholds
- **Clear action recommendations**

### 🗺️ **Interactive Map**
- **Dynamic Gujarat location switching**
- **Real-time threat visualization**
- **Professional mapping interface**
- **Gujarat coastal coverage display**

## 📚 **Documentation**

- **[Gujarat Coastal Areas Guide](GUJARAT_COASTAL_AREAS.md)** - Detailed information about monitored coastal locations
- **API Documentation** - Available at `/api` endpoint when running

## 🛠️ **Technology Stack**

### **Backend (FastAPI)**
- **Python 3.9+** with FastAPI framework
- **SQLite database** for data storage
- **Unified data service** for reliable data fetching
- **Simple alert service** for threat detection
- **RESTful API** with clean endpoints

### **Frontend (React)**
- **Modern React 18** with hooks
- **Professional Tailwind CSS** styling
- **Interactive Leaflet maps**
- **Chart.js** for data visualization
- **Responsive design** for all devices

### **Data Sources**
- **OpenWeatherMap API** for weather data
- **NOAA Tides & Currents** for tide information
- **Realistic simulations** as reliable fallbacks
- **Gujarat coastal city database**

## 🚀 **Quick Start**

### **1. Start the Backend**
```bash
cd backend
python main.py
```
Backend runs on: `http://localhost:8000`

### **2. Start the Frontend**
```bash
cd frontend
npm start
```
Frontend runs on: `http://localhost:3000`

### **3. Use the System**
1. **Open your browser** to `http://localhost:3000`
2. **Click "Get Started"** on the welcome screen
3. **Choose a location** from the Locations tab
4. **Monitor coastal data** in real-time
5. **View alerts** and threat warnings

## 📱 **How to Use (No Tech Knowledge Required)**

### **Step 1: Choose Your Location**
- Go to the **"Locations"** tab
- Click on any Gujarat coastal city (Kandla, Mundra, Bhavnagar, etc.)
- Or enter custom coordinates like "25.7617,-80.1918"

### **Step 2: Monitor Data**
- **Overview tab** shows real-time data
- **Weather card** displays temperature, wind, humidity
- **Tide card** shows current tide height and status
- **Ocean card** displays wave conditions
- **Alerts card** shows active threats

### **Step 3: Understand Alerts**
- **Green (Low)**: Be aware, normal precautions
- **Yellow (Medium)**: Stay alert, avoid risky activities
- **Orange (High)**: Exercise extreme caution
- **Red (Critical)**: Immediate action required

### **Step 4: Navigate the Interface**
- **Back button** returns to welcome screen
- **Tab navigation** switches between views
- **Hover over icons** for helpful tooltips
- **Map view** shows location and threats

## 🔧 **API Endpoints**

### **Core Endpoints**
- `GET /api/` - System information
- `GET /api/health` - Health check
- `GET /api/locations` - Available coastal cities
- `GET /api/data/{location}` - Data for specific location
- `GET /api/alerts` - Active alerts
- `DELETE /api/alerts/{id}` - Deactivate alert

### **Demo Endpoints**
- `GET /api/demo/{location}` - Demo data for presentations

## 🎯 **Perfect for HackOut'25**

### **Why This Will Win:**
- ✅ **Professional appearance** - Looks like enterprise software
- ✅ **Zero complexity** - Anyone can use it immediately
- ✅ **Gujarat coverage** - Monitor all coastal areas in Gujarat
- ✅ **Real-time data** - Live updates every minute
- ✅ **Smart alerts** - AI-powered threat detection
- ✅ **Beautiful UI** - Modern, responsive design
- ✅ **Reliable backend** - Fast, stable API
- ✅ **Complete system** - Full-stack solution

### **Demo Script:**
1. **"Welcome to our Coastal Threat Alert System"**
2. **"This monitors Gujarat's coastal areas comprehensively"**
3. **"Switch between Kandla, Mundra, Bhavnagar - see real-time data"**
4. **"Notice the professional interface - this is production-ready"**
5. **"AI automatically detects threats and generates alerts"**
6. **"Anyone can use this without technical knowledge"**

## 🌟 **System Status**

- **Backend API**: ✅ Operational
- **Data Sources**: ✅ Connected
- **AI Detection**: ✅ Active
- **Monitoring**: ✅ Active
- **Frontend**: ✅ Responsive
- **Database**: ✅ Operational

## 🏆 **Team Titans - HackOut'25**

**Mission**: Protect Gujarat's coastal communities through intelligent monitoring and early warning systems.

**Vision**: Make coastal threat monitoring accessible to everyone, everywhere.

---

**🌊 Built with ❤️ for HackOut'25 • Protecting Gujarat's Coastal Communities**
