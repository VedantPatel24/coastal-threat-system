# Authentication System - Coastal Threat Alert System

## Overview
The system now has a proper authentication system that validates user credentials before allowing access to role-based dashboards.

## How It Works

### 1. User Storage
- Users are stored in the browser's localStorage
- Sample users are automatically created when the app first loads
- New users can be created through the signup process

### 2. Sample Users (Pre-loaded)
The system comes with 5 sample users for testing:

| Department | Email | Password | Role |
|------------|-------|----------|------|
| Disaster Management Department | admin@disaster.gov | admin123 | disaster_management |
| Coastal City Government | city@coastal.gov | city123 | coastal_city_government |
| Environmental NGO | ngo@environment.org | ngo123 | environmental_ngo |
| Fisherfolk | fisher@coastal.com | fisher123 | fisherfolk |
| Civil Defence Team | defence@civil.gov | defence123 | civil_defence |

### 3. Authentication Flow

#### Signup Process:
1. User enters email, selects department, and creates password
2. System checks if email already exists
3. If unique, user account is created and stored
4. User is automatically logged in and redirected to appropriate dashboard

#### Login Process:
1. User enters email, selects department, and enters password
2. System validates credentials against stored users
3. If valid, user is logged in and redirected to appropriate dashboard
4. If invalid, error message is displayed

### 4. Role-Based Access
Each user type gets access to a specific dashboard:
- **Disaster Management Department** → Disaster Management Dashboard
- **Coastal City Government** → Coastal City Government Dashboard  
- **Environmental NGO** → Environmental NGO Dashboard
- **Fisherfolk** → Fisherfolk Dashboard
- **Civil Defence Team** → Civil Defence Dashboard

### 5. Security Features
- Password validation (minimum 6 characters)
- Email uniqueness check
- Department selection required
- Credential verification on login
- Session management through localStorage

### 6. Testing the System

#### Option 1: Use Sample Users
1. Go to the login page
2. Use any of the sample credentials listed above
3. Select the correct department from the dropdown
4. Click "Sign In"

#### Option 2: Create New User
1. Go to the signup page
2. Enter a new email address
3. Select desired department
4. Create a password (min 6 characters)
5. Confirm password
6. Click "Create Account"

### 7. Troubleshooting

#### Common Issues:
- **"Invalid credentials"**: Check email, password, and department selection
- **"User already exists"**: Use a different email or sign in with existing account
- **Wrong dashboard**: Ensure department selection matches the user's actual role

#### Debug Information:
- Check browser console (F12 → Console) for detailed logs
- All authentication actions are logged with debug information

### 8. Technical Implementation
- **Frontend**: React with Context API for state management
- **Storage**: Browser localStorage for user persistence
- **Validation**: Client-side validation with proper error handling
- **Routing**: Dynamic dashboard rendering based on user role

### 9. Future Enhancements
- Backend database integration
- Password hashing
- JWT token authentication
- Session timeout
- Password reset functionality
- User profile management

## Files Modified
- `src/components/Login.js` - Updated with proper authentication
- `src/components/Signup.js` - Updated with user storage
- `src/utils/userManager.js` - New utility for user management
- `src/App.js` - Added sample user initialization
- `src/components/RoleBasedDashboard.js` - Added debug logging
