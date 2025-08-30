import React, { useState, useEffect } from 'react';
import ResourcesTab from '../tabs/ResourcesTab';
import TrainingTab from '../tabs/TrainingTab';
import InfrastructureTab from '../tabs/InfrastructureTab';

const CoastalCityGovernmentDashboard = () => {
  const [activeTab, setActiveTab] = useState('resources');

  // Resources state
  const [resources, setResources] = useState([]);
  const [editingResource, setEditingResource] = useState(null);
  const [showResourceForm, setShowResourceForm] = useState(false);

  // Training state
  const [drills, setDrills] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [editingTraining, setEditingTraining] = useState(null);
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [trainingType, setTrainingType] = useState('drills');

  // Infrastructure state
  const [shelters, setShelters] = useState([]);
  const [seawalls, setSeawalls] = useState([]);
  const [editingInfrastructure, setEditingInfrastructure] = useState(null);
  const [showInfrastructureForm, setShowInfrastructureForm] = useState(false);
  const [infrastructureType, setInfrastructureType] = useState('shelters');



  useEffect(() => {
    loadResources();
    loadTrainingData();
    loadInfrastructureData();
  }, []);



  const loadResources = async () => {
    try {
      const response = await fetch('/resource_data.csv');
      const csvText = await response.text();
      const lines = csvText.split('\n');
      const data = lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',');
        return {
          id: Math.random().toString(36).substr(2, 9),
          location: values[0],
          resource: values[1],
          quantity: parseInt(values[2])
        };
      });
      console.log('Loaded resources:', data.length, data.slice(0, 2));
      setResources(data);
    } catch (error) {
      console.error('Error loading resources:', error);
    }
  };

  const loadTrainingData = async () => {
    try {
      // Load drills
      const drillsResponse = await fetch('/drills.csv');
      const drillsText = await drillsResponse.text();
      const drillsData = parseTrainingCSV(drillsText, 'drills');
      console.log('Loaded drills:', drillsData.length, drillsData.slice(0, 2));
      setDrills(drillsData);

      // Load campaigns
      const campaignsResponse = await fetch('/campaigns.csv');
      const campaignsText = await campaignsResponse.text();
      const campaignsData = parseTrainingCSV(campaignsText, 'campaigns');
      console.log('Loaded campaigns:', campaignsData.length, campaignsData.slice(0, 2));
      setCampaigns(campaignsData);

      // Load workshops
      const workshopsResponse = await fetch('/workshops.csv');
      const workshopsText = await workshopsResponse.text();
      const workshopsData = parseTrainingCSV(workshopsText, 'workshops');
      console.log('Loaded workshops:', workshopsData.length, workshopsData.slice(0, 2));
      setWorkshops(workshopsData);
    } catch (error) {
      console.error('Error loading training data:', error);
    }
  };

  const loadInfrastructureData = async () => {
    try {
      // Load shelters
      const sheltersResponse = await fetch('/shelters.csv');
      const sheltersText = await sheltersResponse.text();
      const sheltersData = parseInfrastructureCSV(sheltersText, 'shelters');
      console.log('Loaded shelters:', sheltersData.length, sheltersData.slice(0, 2));
      setShelters(sheltersData);

      // Load seawalls
      const seawallsResponse = await fetch('/seawall_maintenance.csv');
      const seawallsText = await seawallsResponse.text();
      const seawallsData = parseInfrastructureCSV(seawallsText, 'seawalls');
      console.log('Loaded seawalls:', seawallsData.length, seawallsData.slice(0, 2));
      setSeawalls(seawallsData);
    } catch (error) {
      console.error('Error loading infrastructure data:', error);
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
      return obj;
    });
  };

  // Parse training data with proper field mapping
  const parseTrainingCSV = (csvText, type) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',');
      const obj = { id: Math.random().toString(36).substr(2, 9) };
      
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]?.trim() || '';
      });
      
      // Map CSV fields to expected training fields
      if (type === 'drills') {
        obj.title = obj.Disaster_Type || 'Emergency Drill';
        obj.date = obj.Date || '';
        obj.location = obj.Location || '';
        obj.status = obj.Remarks === 'Successful' ? 'completed' : 
                    obj.Remarks === 'Well-coordinated' ? 'completed' : 'in-progress';
        obj.description = `${obj.Disaster_Type || 'Emergency'} drill organized by ${obj.Organized_By || 'Team'}`;
        obj.participants = obj.Participants_Count || '';
      } else if (type === 'campaigns') {
        obj.title = obj.Campaign_Name || 'Awareness Campaign';
        obj.date = obj.Date || '';
        obj.location = obj.Location || '';
        obj.status = obj.Remarks === 'High Engagement' ? 'completed' : 
                    obj.Remarks === 'Positive Response' ? 'completed' : 'in-progress';
        obj.description = `${obj.Medium || 'Awareness'} campaign targeting ${obj.Target_Audience || 'Residents'}`;
        obj.participants = obj.Reach_Estimate || '';
      } else if (type === 'workshops') {
        obj.title = obj.Title || 'Training Workshop';
        obj.date = obj.Date || '';
        obj.location = obj.Location || '';
        obj.status = 'completed'; // Workshops are typically completed events
        obj.description = obj.Key_Topics || 'Training session';
        obj.participants = obj.Participants_Count || '';
      }
      
      return obj;
    });
  };

  // Parse infrastructure data with proper field mapping
  const parseInfrastructureCSV = (csvText, type) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',');
      const obj = { id: Math.random().toString(36).substr(2, 9) };
      
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]?.trim() || '';
      });
      
      // Map CSV fields to expected infrastructure fields
      if (type === 'shelters') {
        obj.name = obj.shelter_name || 'Shelter';
        obj.location = obj.location || '';
        obj.capacity = obj.capacity || '';
        obj.status = obj.status || 'active';
        obj.lastInspection = obj.contact_person || 'Not set';
        obj.nextInspection = obj.contact_number || 'Not set';
        obj.condition = obj.status === 'Active' ? 'good' : 'fair';
        obj.maintenanceRequired = obj.status === 'Under Maintenance' ? 'Yes' : 'No';
        obj.estimatedCost = '';
        obj.responsibleTeam = obj.contact_person || 'Team';
      } else if (type === 'seawalls') {
        obj.name = `Seawall ${obj.Section_ID || 'Section'}`;
        obj.location = obj.Location || '';
        obj.length = obj.Length_Affected_m || '';
        obj.condition = obj.Condition_Status === 'Good' ? 'excellent' : 
                       obj.Condition_Status === 'Moderate' ? 'good' : 
                       obj.Condition_Status === 'Needs Repair' ? 'fair' : 'poor';
        obj.lastInspection = obj.Inspection_Date || 'Not set';
        obj.nextInspection = obj.Next_Inspection_Date || 'Not set';
        obj.maintenanceRequired = obj.Work_Status === 'In Progress' ? 'Yes' : 'No';
        obj.estimatedCost = obj.Cost_Estimate_INR || '';
        obj.responsibleTeam = obj['Contractor/Agency'] || 'Team';
      }
      
      return obj;
    });
  };



  // Resource CRUD functions
  const addResource = (resource) => {
    const newResource = { ...resource, id: Math.random().toString(36).substr(2, 9) };
    setResources([...resources, newResource]);
    setShowResourceForm(false);
    setEditingResource(null);
  };

  const updateResource = (updatedResource) => {
    setResources(resources.map(r => r.id === updatedResource.id ? updatedResource : r));
    setShowResourceForm(false);
    setEditingResource(null);
  };

  const deleteResource = (id) => {
    setResources(resources.filter(r => r.id !== id));
  };

  // Training CRUD functions
  const addTraining = (training) => {
    const newTraining = { ...training, id: Math.random().toString(36).substr(2, 9) };
    switch (trainingType) {
      case 'drills':
        setDrills([...drills, newTraining]);
        break;
      case 'campaigns':
        setCampaigns([...campaigns, newTraining]);
        break;
      case 'workshops':
        setWorkshops([...workshops, newTraining]);
        break;
    }
    setShowTrainingForm(false);
    setEditingTraining(null);
  };

  const updateTraining = (updatedTraining) => {
    switch (trainingType) {
      case 'drills':
        setDrills(drills.map(d => d.id === updatedTraining.id ? updatedTraining : d));
        break;
      case 'campaigns':
        setCampaigns(campaigns.map(c => c.id === updatedTraining.id ? updatedTraining : c));
        break;
      case 'workshops':
        setWorkshops(workshops.map(w => w.id === updatedTraining.id ? updatedTraining : w));
        break;
    }
    setShowTrainingForm(false);
    setEditingTraining(null);
  };

  const deleteTraining = (id) => {
    switch (trainingType) {
      case 'drills':
        setDrills(drills.filter(d => d.id !== id));
        break;
      case 'campaigns':
        setCampaigns(campaigns.filter(c => c.id !== id));
        break;
      case 'workshops':
        setWorkshops(workshops.filter(w => w.id !== id));
        break;
    }
  };

  // Infrastructure CRUD functions
  const addInfrastructure = (infrastructure) => {
    const newInfrastructure = { ...infrastructure, id: Math.random().toString(36).substr(2, 9) };
    switch (infrastructureType) {
      case 'shelters':
        setShelters([...shelters, newInfrastructure]);
        break;
      case 'seawalls':
        setSeawalls([...seawalls, newInfrastructure]);
        break;
    }
    setShowInfrastructureForm(false);
    setEditingInfrastructure(null);
  };

  const updateInfrastructure = (updatedInfrastructure) => {
    switch (infrastructureType) {
      case 'shelters':
        setShelters(shelters.map(s => s.id === updatedInfrastructure.id ? updatedInfrastructure : s));
        break;
      case 'seawalls':
        setSeawalls(seawalls.map(sw => sw.id === updatedInfrastructure.id ? updatedInfrastructure : sw));
        break;
    }
    setShowInfrastructureForm(false);
    setEditingInfrastructure(null);
  };

  const deleteInfrastructure = (id) => {
    switch (infrastructureType) {
      case 'shelters':
        setShelters(shelters.filter(s => s.id !== id));
        break;
      case 'seawalls':
        setSeawalls(seawalls.filter(sw => sw.id !== id));
        break;
    }
  };

  const tabs = [
    { id: 'resources', name: 'Disaster Resources', icon: '🆘', description: 'Manage emergency resources and supplies' },
    { id: 'training', name: 'Training & Awareness', icon: '🎓', description: 'Manage drills, campaigns, and workshops' },
    { id: 'infrastructure', name: 'Infrastructure Protection', icon: '🏗️', description: 'Maintain seawalls and shelters' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'resources':
        return <ResourcesTab 
          resources={resources}
          onAdd={addResource}
          onUpdate={updateResource}
          onDelete={deleteResource}
          editingResource={editingResource}
          setEditingResource={setEditingResource}
          showForm={showResourceForm}
          setShowForm={setShowResourceForm}
        />;
      
      case 'training':
        return <TrainingTab 
          drills={drills}
          campaigns={campaigns}
          workshops={workshops}
          trainingType={trainingType}
          setTrainingType={setTrainingType}
          onAdd={addTraining}
          onUpdate={updateTraining}
          onDelete={deleteTraining}
          editingTraining={editingTraining}
          setEditingTraining={setEditingTraining}
          showForm={showTrainingForm}
          setShowForm={setShowTrainingForm}
        />;
      
      case 'infrastructure':
        return <InfrastructureTab 
          shelters={shelters}
          seawalls={seawalls}
          infrastructureType={infrastructureType}
          setInfrastructureType={setInfrastructureType}
          onAdd={addInfrastructure}
          onUpdate={updateInfrastructure}
          onDelete={deleteInfrastructure}
          editingInfrastructure={editingInfrastructure}
          setEditingInfrastructure={setEditingInfrastructure}
          showForm={showInfrastructureForm}
          setShowForm={setShowInfrastructureForm}
        />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🏙️</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Coastal City Government Dashboard</h1>
              <p className="text-gray-600">Resource Management & Infrastructure Protection</p>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
                </div>
                <p className="text-xs mt-1 text-gray-400">{tab.description}</p>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-6">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default CoastalCityGovernmentDashboard;
