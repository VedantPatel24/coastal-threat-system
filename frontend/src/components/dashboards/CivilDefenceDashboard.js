import React, { useState, useEffect } from 'react';

const CivilDefenceDashboard = () => {
  const [activeTab, setActiveTab] = useState('teams');
  const [civilDefenceData, setCivilDefenceData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    divisionNumber: '',
    divisionName: '',
    volunteersEnrolled: ''
  });

  useEffect(() => {
    loadCivilDefenceData();
  }, []);

  const loadCivilDefenceData = async () => {
    try {
      const response = await fetch('/Civil Defence.csv');
      const csvText = await response.text();
      const data = parseCSV(csvText);
      console.log('Loaded Civil Defence data:', data.length, data.slice(0, 2));
      setCivilDefenceData(data);
    } catch (error) {
      console.error('Error loading Civil Defence data:', error);
    }
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',');
      const obj = { id: Math.random().toString(36).substr(2, 9) };
      
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]?.trim() || '';
      });
      
      // Map CSV fields to expected fields
      obj.divisionNumber = obj['DIVISION NUMBER'] || '';
      obj.divisionName = obj['DIVISION NAME'] || '';
      obj.volunteersEnrolled = obj['NO. OF CIVIL DEFENCE VOLUNTEERS ENROLLED'] || '0';
      
      return obj;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      // Update existing item
      setCivilDefenceData(civilDefenceData.map(item => 
        item.id === editingItem.id ? { ...editingItem, ...formData } : item
      ));
    } else {
      // Add new item
      const newItem = { ...formData, id: Math.random().toString(36).substr(2, 9) };
      setCivilDefenceData([...civilDefenceData, newItem]);
    }
    
    // Reset form
    setFormData({ divisionNumber: '', divisionName: '', volunteersEnrolled: '' });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      divisionNumber: item.divisionNumber || '',
      divisionName: item.divisionName || '',
      volunteersEnrolled: item.volunteersEnrolled || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setCivilDefenceData(civilDefenceData.filter(item => item.id !== id));
  };

  const handleCancel = () => {
    setFormData({ divisionNumber: '', divisionName: '', volunteersEnrolled: '' });
    setEditingItem(null);
    setShowForm(false);
  };

  const tabs = [
    { id: 'teams', name: 'Civil Defence Teams', icon: '👥', description: 'Team management with CRUD' }
  ];

  const renderTabContent = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Civil Defence Teams</h2>
              <p className="text-gray-600">Manage division teams and volunteer counts</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add Team
            </button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{civilDefenceData.length}</div>
              <div className="text-sm text-blue-600">Total Divisions</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {civilDefenceData.reduce((sum, item) => sum + (parseInt(item.volunteersEnrolled) || 0), 0)}
              </div>
              <div className="text-sm text-green-600">Total Volunteers</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(civilDefenceData.map(item => item.divisionName)).size}
              </div>
              <div className="text-sm text-purple-600">Unique Locations</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(civilDefenceData.reduce((sum, item) => sum + (parseInt(item.volunteersEnrolled) || 0), 0) / civilDefenceData.length)}
              </div>
              <div className="text-sm text-orange-600">Avg Volunteers/Division</div>
            </div>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingItem ? 'Edit Team' : 'Add New Team'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Division Number
                    </label>
                    <input
                      type="number"
                      value={formData.divisionNumber}
                      onChange={(e) => setFormData({ ...formData, divisionNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter division number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Division Name
                    </label>
                    <input
                      type="text"
                      value={formData.divisionName}
                      onChange={(e) => setFormData({ ...formData, divisionName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter division name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Volunteers Enrolled
                    </label>
                    <input
                      type="number"
                      value={formData.volunteersEnrolled}
                      onChange={(e) => setFormData({ ...formData, volunteersEnrolled: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter volunteer count"
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingItem ? 'Update Team' : 'Add Team'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Division Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Division Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volunteers Enrolled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {civilDefenceData.length > 0 ? (
                  civilDefenceData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.divisionNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.divisionName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          parseInt(item.volunteersEnrolled) > 200 ? 'bg-green-100 text-green-800' :
                          parseInt(item.volunteersEnrolled) > 100 ? 'bg-blue-100 text-blue-800' :
                          parseInt(item.volunteersEnrolled) > 50 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.volunteersEnrolled || '0'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      <div className="text-4xl mb-2">👥</div>
                      <p>No Civil Defence teams found. Add your first team to get started.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🛡️</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Civil Defence Team Dashboard</h1>
              <p className="text-gray-600">Team management and volunteer coordination</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-6">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default CivilDefenceDashboard;
