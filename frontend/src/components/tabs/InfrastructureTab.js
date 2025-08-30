import React, { useState } from 'react';

const InfrastructureTab = ({
  shelters,
  seawalls,
  infrastructureType,
  setInfrastructureType,
  onAdd,
  onUpdate,
  onDelete,
  editingInfrastructure,
  setEditingInfrastructure,
  showForm,
  setShowForm
}) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    status: 'active',
    lastInspection: '',
    nextInspection: '',
    condition: 'good',
    maintenanceRequired: '',
    estimatedCost: '',
    responsibleTeam: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingInfrastructure) {
      onUpdate({ ...editingInfrastructure, ...formData });
    } else {
      onAdd(formData);
    }
    setFormData({
      name: '',
      location: '',
      capacity: '',
      status: 'active',
      lastInspection: '',
      nextInspection: '',
      condition: 'good',
      maintenanceRequired: '',
      estimatedCost: '',
      responsibleTeam: ''
    });
  };

  const handleEdit = (infrastructure) => {
    setEditingInfrastructure(infrastructure);
    setFormData({
      name: infrastructure.name || '',
      location: infrastructure.location || '',
      capacity: infrastructure.capacity || '',
      status: infrastructure.status || 'active',
      lastInspection: infrastructure.lastInspection || '',
      nextInspection: infrastructure.nextInspection || '',
      condition: infrastructure.condition || 'good',
      maintenanceRequired: infrastructure.maintenanceRequired || '',
      estimatedCost: infrastructure.estimatedCost || '',
      responsibleTeam: infrastructure.responsibleTeam || ''
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingInfrastructure(null);
    setFormData({
      name: '',
      location: '',
      capacity: '',
      status: 'active',
      lastInspection: '',
      nextInspection: '',
      condition: 'good',
      maintenanceRequired: '',
      estimatedCost: '',
      responsibleTeam: ''
    });
    setShowForm(false);
  };

  const getCurrentData = () => {
    switch (infrastructureType) {
      case 'shelters':
        return shelters;
      case 'seawalls':
        return seawalls;
      default:
        return [];
    }
  };

  const getTypeLabel = () => {
    switch (infrastructureType) {
      case 'shelters':
        return 'Shelters';
      case 'seawalls':
        return 'Seawalls';
      default:
        return 'Infrastructure';
    }
  };

  const getFormFields = () => {
    if (infrastructureType === 'shelters') {
      return [
        { key: 'name', label: 'Shelter Name', type: 'text', required: true },
        { key: 'location', label: 'Location', type: 'text', required: true },
        { key: 'capacity', label: 'Capacity', type: 'number', required: true },
        { key: 'status', label: 'Status', type: 'select', options: ['active', 'maintenance', 'closed'], required: true },
        { key: 'lastInspection', label: 'Last Inspection', type: 'date', required: false },
        { key: 'nextInspection', label: 'Next Inspection', type: 'date', required: false }
      ];
    } else {
      return [
        { key: 'name', label: 'Seawall Name', type: 'text', required: true },
        { key: 'location', label: 'Location', type: 'text', required: true },
        { key: 'length', label: 'Length (meters)', type: 'number', required: true },
        { key: 'condition', label: 'Condition', type: 'select', options: ['excellent', 'good', 'fair', 'poor'], required: true },
        { key: 'lastInspection', label: 'Last Inspection', type: 'date', required: false },
        { key: 'nextInspection', label: 'Next Inspection', type: 'date', required: false },
        { key: 'maintenanceRequired', label: 'Maintenance Required', type: 'text', required: false },
        { key: 'estimatedCost', label: 'Estimated Cost (₹)', type: 'number', required: false },
        { key: 'responsibleTeam', label: 'Responsible Team', type: 'text', required: false }
      ];
    }
  };

  const currentData = getCurrentData();
  const formFields = getFormFields();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Infrastructure Protection</h2>
            <p className="text-gray-600">Maintain seawalls and shelters</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            + Add {getTypeLabel().slice(0, -1)}
          </button>
        </div>

        {/* Infrastructure Type Selector */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'shelters', label: 'Shelters', icon: '🏠' },
              { key: 'seawalls', label: 'Seawalls', icon: '🏗️' }
            ].map((type) => (
              <button
                key={type.key}
                onClick={() => setInfrastructureType(type.key)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  infrastructureType === type.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingInfrastructure ? `Edit ${getTypeLabel().slice(0, -1)}` : `Add New ${getTypeLabel().slice(0, -1)}`}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        value={formData[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required={field.required}
                      >
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingInfrastructure ? 'Update' : 'Add'} {getTypeLabel().slice(0, -1)}
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

        {/* Infrastructure Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                {infrastructureType === 'shelters' ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Length
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Condition
                    </th>
                  </>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Inspection
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Inspection
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.length > 0 ? (
                currentData.map((infrastructure) => (
                  <tr key={infrastructure.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                                              <div className="text-sm font-medium text-gray-900">{infrastructure.name || 'Unnamed'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                              {infrastructure.location || 'No location set'}
                    </td>
                    {infrastructureType === 'shelters' ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {infrastructure.capacity || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            infrastructure.status === 'active' ? 'bg-green-100 text-green-800' :
                            infrastructure.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {infrastructure.status || 'Unknown'}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {infrastructure.length || 'Unknown'}m
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            infrastructure.condition === 'excellent' ? 'bg-green-100 text-green-800' :
                            infrastructure.condition === 'good' ? 'bg-blue-100 text-blue-800' :
                            infrastructure.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {infrastructure.condition || 'Unknown'}
                          </span>
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {infrastructure.lastInspection || 'Not set'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {infrastructure.nextInspection || 'Not set'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(infrastructure)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(infrastructure.id)}
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
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="text-4xl mb-2">🏗️</div>
                    <p>No {getTypeLabel().toLowerCase()} found. Add your first {getTypeLabel().slice(0, -1).toLowerCase()} to get started.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        {currentData.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{currentData.length}</div>
              <div className="text-sm text-blue-600">Total {getTypeLabel()}</div>
            </div>
            {infrastructureType === 'shelters' ? (
              <>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                                         {currentData.filter(i => i.status && i.status === 'active').length}
                  </div>
                  <div className="text-sm text-green-600">Active</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-600">
                                         {currentData.filter(i => i.status && i.status === 'maintenance').length}
                  </div>
                  <div className="text-sm text-yellow-600">Under Maintenance</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-gray-600">
                                         {currentData.filter(i => i.status && i.status === 'closed').length}
                  </div>
                  <div className="text-sm text-gray-600">Closed</div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                                         {currentData.filter(i => i.condition && (i.condition === 'excellent' || i.condition === 'good')).length}
                  </div>
                  <div className="text-sm text-green-600">Good Condition</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-600">
                                         {currentData.filter(i => i.condition && i.condition === 'fair').length}
                  </div>
                  <div className="text-sm text-yellow-600">Fair Condition</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="text-2xl font-bold text-red-600">
                                         {currentData.filter(i => i.condition && i.condition === 'poor').length}
                  </div>
                  <div className="text-sm text-red-600">Poor Condition</div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfrastructureTab;
