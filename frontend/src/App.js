import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import RoleBasedDashboard from './components/RoleBasedDashboard';
import WelcomeScreen from './components/WelcomeScreen';
import { initializeSampleUsers } from './utils/userManager';
import './index.css';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  // Initialize sample users on component mount
  useEffect(() => {
    initializeSampleUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <RoleBasedDashboard />;
  }

  if (showSignup) {
    return <Signup onSwitchToLogin={() => setShowSignup(false)} />;
  }

  return <Login onSwitchToSignup={() => setShowSignup(true)} />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
