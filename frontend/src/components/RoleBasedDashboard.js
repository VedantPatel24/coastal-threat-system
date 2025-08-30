import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DisasterManagementDashboard from './dashboards/DisasterManagementDashboard';
import CoastalCityGovernmentDashboard from './dashboards/CoastalCityGovernmentDashboard';
import EnvironmentalNGODashboard from './dashboards/EnvironmentalNGODashboard';
import FisherfolkDashboard from './dashboards/FisherfolkDashboard';
import CivilDefenceDashboard from './dashboards/CivilDefenceDashboard';

const RoleBasedDashboard = () => {
  const { user, logout } = useAuth();

  // Debug logging
  console.log('RoleBasedDashboard - User data:', user);
  console.log('RoleBasedDashboard - User role:', user?.role);

  const renderDashboard = () => {
    console.log('Rendering dashboard for role:', user?.role);
    
    switch (user.role) {
      case 'disaster_management':
        console.log('Rendering DisasterManagementDashboard');
        return <DisasterManagementDashboard />;
      case 'coastal_city_government':
        console.log('Rendering CoastalCityGovernmentDashboard');
        return <CoastalCityGovernmentDashboard />;
      case 'environmental_ngo':
        console.log('Rendering EnvironmentalNGODashboard');
        return <EnvironmentalNGODashboard />;
      case 'fisherfolk':
        console.log('Rendering FisherfolkDashboard');
        return <FisherfolkDashboard />;
      case 'civil_defence':
        console.log('Rendering CivilDefenceDashboard');
        return <CivilDefenceDashboard />;
      default:
        console.log('Default case - rendering DisasterManagementDashboard');
        return <DisasterManagementDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">🌊</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Coastal Threat Alert System
                </h1>
                <p className="text-sm text-gray-600">
                  {user.department} Dashboard
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Signed in as</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default RoleBasedDashboard;
