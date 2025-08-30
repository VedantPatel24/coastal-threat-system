import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { findUser } from '../utils/userManager';

const Login = ({ onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const departments = [
    { value: 'disaster_management', label: 'Disaster Management Department' },
    { value: 'coastal_city_government', label: 'Coastal City Government' },
    // { value: 'environmental_ngo', label: 'Environmental NGO' },
    // { value: 'fisherfolk', label: 'Fisherfolk' },
    { value: 'civil_defence', label: 'Civil Defence Team' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.department) {
      setError('Please select your department');
      setLoading(false);
      return;
    }

          try {
        // Check if user exists and credentials are correct
        const user = findUser(formData.email, formData.password, formData.department);

        if (!user) {
          setError('Invalid email, password, or department combination. Please check your credentials.');
          setLoading(false);
          return;
        }

        // Create user data for the session (without password)
        const userData = {
          email: user.email,
          department: user.department,
          role: user.role
        };
        
        // Debug logging
        console.log('Login - Form data:', formData);
        console.log('Login - Found user:', user);
        console.log('Login - User data being passed to login:', userData);
        
        login(userData);
      } catch (err) {
        console.error('Login error:', err);
        setError('Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="text-6xl mb-4">🌊</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to your Coastal Threat Alert System account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                id="department"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="">Select your department</option>
                {departments.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Switch to Signup */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Sign up here
              </button>
            </p>
          </div>

          {/* Sample Credentials Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 text-center mb-2">
              🔐 Sample Credentials (or sign up for a new account):
            </p>
            <div className="text-xs text-blue-700 space-y-1">
              <div>• Disaster Management: admin@disaster.gov / admin123</div>
              <div>• Coastal City Government: city@coastal.gov / city123</div>
              {/* <div>• Environmental NGO: ngo@environment.org / ngo123</div> */}
              {/* <div>• Fisherfolk: fisher@coastal.com / fisher123</div> */}
              <div>• Civil Defence: defence@civil.gov / defence123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
