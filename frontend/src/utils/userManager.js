// User management utility for localStorage-based authentication

export const initializeSampleUsers = () => {
  const existingUsers = localStorage.getItem('coastalThreatUsers');
  if (!existingUsers) {
    const sampleUsers = [
      {
        email: 'admin@disaster.gov',
        password: 'admin123',
        department: 'Disaster Management Department',
        role: 'disaster_management',
        createdAt: new Date().toISOString()
      },
      {
        email: 'city@coastal.gov',
        password: 'city123',
        department: 'Coastal City Government',
        role: 'coastal_city_government',
        createdAt: new Date().toISOString()
      },
      {
        email: 'ngo@environment.org',
        password: 'ngo123',
        department: 'Environmental NGO',
        role: 'environmental_ngo',
        createdAt: new Date().toISOString()
      },
      {
        email: 'fisher@coastal.com',
        password: 'fisher123',
        department: 'Fisherfolk',
        role: 'fisherfolk',
        createdAt: new Date().toISOString()
      },
      {
        email: 'defence@civil.gov',
        password: 'defence123',
        department: 'Civil Defence Team',
        role: 'civil_defence',
        createdAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem('coastalThreatUsers', JSON.stringify(sampleUsers));
    console.log('Sample users initialized:', sampleUsers);
  }
};

export const getAllUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('coastalThreatUsers') || '[]');
  } catch (error) {
    console.error('Error reading users from localStorage:', error);
    return [];
  }
};

export const addUser = (userData) => {
  try {
    const users = getAllUsers();
    users.push(userData);
    localStorage.setItem('coastalThreatUsers', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error adding user:', error);
    return false;
  }
};

export const findUser = (email, password, role) => {
  try {
    const users = getAllUsers();
    return users.find(u => 
      u.email === email && 
      u.password === password &&
      u.role === role
    );
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

export const clearAllUsers = () => {
  try {
    localStorage.removeItem('coastalThreatUsers');
    return true;
  } catch (error) {
    console.error('Error clearing users:', error);
    return false;
  }
};
