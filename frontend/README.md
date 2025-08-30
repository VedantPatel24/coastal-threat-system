# Coastal Threat Alert System - Frontend

A React-based frontend application for monitoring coastal threats and providing early warning systems for different user roles.

## Features

### 🔐 Authentication System
- **Login/Signup**: Secure authentication with email and password
- **Role-based Access**: Different dashboards for different user types
- **Department Selection**: Dropdown selection during signup

### 👥 User Roles & Dashboards

#### 1. Disaster Management Department
- **Overview**: Real-time coastal monitoring with weather, tide, and ocean data
- **Flood Analytics**: AI-powered flood prediction and analysis
- **Locations**: Gujarat coastal cities monitoring

#### 2. Coastal City Government
- **City Overview**: Urban coastal monitoring and infrastructure status
- **Infrastructure**: Critical building and facility monitoring
- **Evacuation**: Emergency response planning and evacuation routes

#### 3. Environmental NGO
- **Environmental Overview**: Ecosystem monitoring and conservation data
- **Conservation**: Wildlife and habitat status tracking
- **Pollution**: Environmental threats and pollution monitoring

#### 4. Fisherfolk
- **Fishing Overview**: Daily fishing conditions and marine resources
- **Safety**: Weather and sea conditions for safe fishing
- **Resources**: Fish species availability and fishing zones

#### 5. Civil Defence Team
- **Emergency Overview**: Response status and emergency management
- **Response Teams**: Team deployment and communication status
- **Evacuation**: Public safety and evacuation coordination

## Technology Stack

- **Frontend**: React 18, Tailwind CSS
- **State Management**: React Context API
- **Authentication**: Local storage-based (demo mode)
- **Maps**: Leaflet integration
- **Charts**: Chart.js for data visualization

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Running the Application
```bash
npm start
```

The application will open at `http://localhost:3000`

### Building for Production
```bash
npm run build
```

## Demo Mode

The application currently runs in demo mode:
- Use any email and password combination to sign in
- Select your department during signup
- All data is simulated for demonstration purposes

## Project Structure

```
src/
├── components/
│   ├── dashboards/          # Role-specific dashboard components
│   ├── Login.js            # Authentication login
│   ├── Signup.js           # Authentication signup
│   └── RoleBasedDashboard.js # Main dashboard router
├── contexts/
│   └── AuthContext.js      # Authentication state management
├── services/
│   └── api.js             # API service layer
└── App.js                  # Main application component
```

## Features by Role

### Disaster Management Department
- Comprehensive coastal monitoring
- AI flood prediction
- Real-time data visualization
- Multi-location support

### Coastal City Government
- Urban infrastructure monitoring
- Population and evacuation planning
- City-specific coastal data
- Emergency response coordination

### Environmental NGO
- Ecosystem health monitoring
- Wildlife conservation tracking
- Pollution and threat assessment
- Conservation program management

### Fisherfolk
- Fishing condition monitoring
- Safety alerts and warnings
- Marine resource information
- Market and pricing data

### Civil Defence Team
- Emergency response coordination
- Team deployment management
- Public safety alerts
- Evacuation planning

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of HackOut'25 - Team Titans

## Support

For support and questions, please contact the development team.
