import React, { useState } from 'react';

const TrainingTab = ({
  drills,
  campaigns,
  workshops,
  trainingType,
  setTrainingType,
  onAdd,
  onUpdate,
  onDelete,
  editingTraining,
  setEditingTraining,
  showForm,
  setShowForm
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    participants: '',
    status: 'planned'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTraining) {
      onUpdate({ ...editingTraining, ...formData });
    } else {
      onAdd(formData);
    }
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      participants: '',
      status: 'planned'
    });
  };

  const handleEdit = (training) => {
    setEditingTraining(training);
    setFormData({
      title: training.title || '',
      description: training.description || '',
      date: training.date || '',
      location: training.location || '',
      participants: training.participants || '',
      status: training.status || 'planned'
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingTraining(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      participants: '',
      status: 'planned'
    });
    setShowForm(false);
  };

  const getCurrentData = () => {
    switch (trainingType) {
      case 'drills':
        return drills;
      case 'campaigns':
        return campaigns;
      case 'workshops':
        return workshops;
      default:
        return [];
    }
  };

  const getTypeLabel = () => {
    switch (trainingType) {
      case 'drills':
        return 'Drills';
      case 'campaigns':
        return 'Campaigns';
      case 'workshops':
        return 'Workshops';
      default:
        return 'Training';
    }
  };

  const currentData = getCurrentData();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Training & Awareness</h2>
            <p className="text-gray-600">Manage drills, campaigns, and workshops</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            + Add {getTypeLabel().slice(0, -1)}
          </button>
        </div>

        {/* Training Type Selector */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'drills', label: 'Drills', icon: '🏃' },
              { key: 'campaigns', label: 'Campaigns', icon: '📢' },
              { key: 'workshops', label: 'Workshops', icon: '🎓' }
            ].map((type) => (
              <button
                key={type.key}
                onClick={() => setTrainingType(type.key)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  trainingType === type.key
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
              {editingTraining ? `Edit ${getTypeLabel().slice(0, -1)}` : `Add New ${getTypeLabel().slice(0, -1)}`}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter location"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="planned">Planned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter description"
                    rows="3"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Participants
                  </label>
                  <input
                    type="text"
                    value={formData.participants}
                    onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter participants or leave blank"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingTraining ? 'Update' : 'Add'} {getTypeLabel().slice(0, -1)}
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

        {/* Training Activities Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.length > 0 ? (
                currentData.map((training) => (
                  <tr key={training.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{training.title || 'Untitled'}</div>
                        {training.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {training.description}
                          </div>
                        )}
                      </div>
                    </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {training.date || 'No date set'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {training.location || 'No location set'}
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        training.status === 'completed' ? 'bg-green-100 text-green-800' :
                        training.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        training.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {training.status ? training.status.replace('-', ' ') : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(training)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(training.id)}
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
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="text-4xl mb-2">🎓</div>
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
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {currentData.filter(t => t.status && t.status === 'completed').length}
              </div>
              <div className="text-sm text-green-600">Completed</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {currentData.filter(t => t.status && t.status === 'in-progress').length}
              </div>
              <div className="text-sm text-blue-600">In Progress</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-600">
                {currentData.filter(t => t.status && t.status === 'planned').length}
              </div>
              <div className="text-sm text-gray-600">Planned</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingTab;
