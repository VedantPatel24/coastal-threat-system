import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const FloodAnalytics = () => {
  const [floodData, setFloodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [correlationInsights, setCorrelationInsights] = useState({});

  useEffect(() => {
    // Simulate loading flood data from CSV
    // In real implementation, this would come from your backend API
    const loadFloodData = () => {
      // Mock data based on your CSV structure
      const mockData = [
        { city: 'Mundra', floodCount: 15, avgTemp: 28.5, avgHumidity: 75, avgWindSpeed: 65, avgMagnitude: 8.2, avgArea: 280 },
        { city: 'Surat', floodCount: 18, avgTemp: 30.2, avgHumidity: 78, avgWindSpeed: 72, avgMagnitude: 9.1, avgArea: 320 },
        { city: 'Porbandar', floodCount: 22, avgTemp: 27.8, avgHumidity: 82, avgWindSpeed: 68, avgMagnitude: 8.8, avgArea: 310 },
        { city: 'Diu', floodCount: 20, avgTemp: 29.1, avgHumidity: 85, avgWindSpeed: 71, avgMagnitude: 9.3, avgArea: 290 },
        { city: 'Bhavnagar', floodCount: 16, avgTemp: 29.8, avgHumidity: 76, avgWindSpeed: 69, avgMagnitude: 8.5, avgArea: 270 },
        { city: 'Kandla', floodCount: 12, avgTemp: 28.9, avgHumidity: 79, avgWindSpeed: 66, avgMagnitude: 8.1, avgArea: 250 },
        { city: 'Bharuch', floodCount: 14, avgTemp: 31.2, avgHumidity: 81, avgWindSpeed: 70, avgMagnitude: 8.7, avgArea: 260 },
        { city: 'Veraval', floodCount: 13, avgTemp: 27.5, avgHumidity: 80, avgWindSpeed: 67, avgMagnitude: 8.3, avgArea: 240 },
        { city: 'Ghogha', floodCount: 11, avgTemp: 30.5, avgHumidity: 73, avgWindSpeed: 64, avgMagnitude: 7.9, avgArea: 230 },
        { city: 'Okha', floodCount: 17, avgTemp: 28.7, avgHumidity: 84, avgWindSpeed: 73, avgMagnitude: 8.9, avgArea: 300 }
      ];
      
      setFloodData(mockData);
      
      // Calculate correlation insights
      const insights = calculateCorrelationInsights(mockData);
      setCorrelationInsights(insights);
      
      setLoading(false);
    };

    loadFloodData();
  }, []);

  // Calculate correlation insights for all environmental factors
  const calculateCorrelationInsights = (data) => {
    const n = data.length;
    
    // Temperature vs Flood Magnitude correlation
    const tempSumX = data.reduce((sum, d) => sum + d.avgTemp, 0);
    const tempSumY = data.reduce((sum, d) => sum + d.avgMagnitude, 0);
    const tempSumXY = data.reduce((sum, d) => sum + d.avgTemp * d.avgMagnitude, 0);
    const tempSumX2 = data.reduce((sum, d) => sum + d.avgTemp * d.avgTemp, 0);
    const tempSumY2 = data.reduce((sum, d) => sum + d.avgMagnitude * d.avgMagnitude, 0);
    const tempCorrelation = (n * tempSumXY - tempSumX * tempSumY) / Math.sqrt((n * tempSumX2 - tempSumX * tempSumX) * (n * tempSumY2 - tempSumY * tempSumY));
    
    // Wind Speed vs Flood Magnitude correlation
    const windSumX = data.reduce((sum, d) => sum + d.avgWindSpeed, 0);
    const windSumY = data.reduce((sum, d) => sum + d.avgMagnitude, 0);
    const windSumXY = data.reduce((sum, d) => sum + d.avgWindSpeed * d.avgMagnitude, 0);
    const windSumX2 = data.reduce((sum, d) => sum + d.avgWindSpeed * d.avgWindSpeed, 0);
    const windSumY2 = data.reduce((sum, d) => sum + d.avgMagnitude * d.avgMagnitude, 0);
    const windCorrelation = (n * windSumXY - windSumX * windSumY) / Math.sqrt((n * windSumX2 - windSumX * windSumX) * (n * windSumY2 - windSumY * windSumY));
    
    // Humidity vs Flood Count correlation
    const humSumX = data.reduce((sum, d) => sum + d.avgHumidity, 0);
    const humSumY = data.reduce((sum, d) => sum + d.floodCount, 0);
    const humSumXY = data.reduce((sum, d) => sum + d.avgHumidity * d.floodCount, 0);
    const humSumX2 = data.reduce((sum, d) => sum + d.avgHumidity * d.avgHumidity, 0);
    const humSumY2 = data.reduce((sum, d) => sum + d.floodCount * d.floodCount, 0);
    const humCorrelation = (n * humSumXY - humSumX * humSumY) / Math.sqrt((n * humSumX2 - humSumX * humSumX) * (n * humSumY2 - humSumY * humSumY));
    
    return {
      temperature: {
        correlation: tempCorrelation,
        strength: Math.abs(tempCorrelation) > 0.7 ? 'Strong' : Math.abs(tempCorrelation) > 0.4 ? 'Moderate' : 'Weak',
        direction: tempCorrelation > 0 ? 'Positive' : 'Negative',
        interpretation: tempCorrelation > 0 ? 'Higher temperatures correlate with higher flood risk' : 'Lower temperatures correlate with higher flood risk'
      },
      windSpeed: {
        correlation: windCorrelation,
        strength: Math.abs(windCorrelation) > 0.7 ? 'Strong' : Math.abs(windCorrelation) > 0.4 ? 'Moderate' : 'Weak',
        direction: windCorrelation > 0 ? 'Positive' : 'Negative',
        interpretation: windCorrelation > 0 ? 'Higher wind speeds correlate with higher flood magnitude' : 'Lower wind speeds correlate with higher flood magnitude'
      },
      humidity: {
        correlation: humCorrelation,
        strength: Math.abs(humCorrelation) > 0.7 ? 'Strong' : Math.abs(humCorrelation) > 0.4 ? 'Moderate' : 'Weak',
        direction: humCorrelation > 0 ? 'Positive' : 'Negative',
        interpretation: humCorrelation > 0 ? 'Higher humidity correlates with more flood events' : 'Lower humidity correlates with more flood events'
      }
    };
  };

  // 1. Flood Frequency by City (Bar Chart)
  const getFloodFrequencyData = () => ({
    labels: floodData.map(d => d.city),
    datasets: [{
      label: 'Number of Flood Events',
      data: floodData.map(d => d.floodCount),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }]
  });

  // 2. Temperature vs Flood Risk (Line Chart with Trend Analysis)
  const getTemperatureVsFloodData = () => {
    // Sort data by temperature for better line visualization
    const sortedData = [...floodData].sort((a, b) => a.avgTemp - b.avgTemp);
    
    // Calculate trend line
    const n = sortedData.length;
    const sumX = sortedData.reduce((sum, d) => sum + d.avgTemp, 0);
    const sumY = sortedData.reduce((sum, d) => sum + d.avgMagnitude, 0);
    const sumXY = sortedData.reduce((sum, d) => sum + d.avgTemp * d.avgMagnitude, 0);
    const sumX2 = sortedData.reduce((sum, d) => sum + d.avgTemp * d.avgTemp, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Generate trend line points
    const trendData = sortedData.map(d => ({
      x: d.avgTemp,
      y: slope * d.avgTemp + intercept
    }));

    return {
      labels: sortedData.map(d => d.city),
      datasets: [
        {
          label: 'Flood Magnitude by Temperature',
          data: sortedData.map(d => d.avgMagnitude),
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 10,
          pointBackgroundColor: sortedData.map(d => 
            d.avgMagnitude > 8.5 ? '#dc2626' : 
            d.avgMagnitude > 8.0 ? '#f59e0b' : 
            '#22c55e'
          ),
        },
        {
          label: 'Trend Line (Correlation)',
          data: trendData.map(d => d.y),
          borderColor: '#dc2626',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
          tension: 0.1,
        }
      ]
    };
  };

  // 3. Humidity vs Flood Occurrence (Correlation Chart)
  const getHumidityVsFloodData = () => ({
    labels: floodData.map(d => d.city),
    datasets: [{
      label: 'Humidity (%)',
      data: floodData.map(d => d.avgHumidity),
      backgroundColor: 'rgba(147, 51, 234, 0.8)',
      borderColor: 'rgba(147, 51, 234, 1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    }, {
      label: 'Flood Count',
      data: floodData.map(d => d.floodCount * 3), // Scale for better visualization
      backgroundColor: 'rgba(236, 72, 153, 0.8)',
      borderColor: 'rgba(236, 72, 153, 1)',
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      yAxisID: 'y1',
    }]
  });

  // 4. Flood Risk Distribution (Pie Chart)
  const getFloodRiskDistributionData = () => {
    // Categorize cities by flood risk level
    const highRisk = floodData.filter(d => d.avgMagnitude > 8.5 || d.avgArea > 300);
    const mediumRisk = floodData.filter(d => (d.avgMagnitude > 8.0 && d.avgMagnitude <= 8.5) || (d.avgArea > 250 && d.avgArea <= 300));
    const lowRisk = floodData.filter(d => d.avgMagnitude <= 8.0 && d.avgArea <= 250);

    return {
      labels: ['High Risk', 'Medium Risk', 'Low Risk'],
      datasets: [{
        data: [highRisk.length, mediumRisk.length, lowRisk.length],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // Red for high risk
          'rgba(245, 158, 11, 0.8)',  // Orange for medium risk
          'rgba(34, 197, 94, 0.8)',   // Green for low risk
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 4,
      }]
    };
  };

  // 4. Wind Speed vs Flood Magnitude (Bubble Chart)
  const getWindVsMagnitudeData = () => ({
    datasets: [{
      label: 'Wind Speed vs Flood Magnitude',
      data: floodData.map(d => ({
        x: d.avgWindSpeed,
        y: d.avgMagnitude,
        r: d.avgArea / 20 // Bubble size based on area covered
      })),
      backgroundColor: floodData.map(d => 
        d.avgArea > 300 ? 'rgba(239, 68, 68, 0.6)' : 
        d.avgArea > 250 ? 'rgba(245, 158, 11, 0.6)' : 
        'rgba(34, 197, 94, 0.6)'
      ),
      borderColor: floodData.map(d => 
        d.avgArea > 300 ? 'rgba(239, 68, 68, 1)' : 
        d.avgArea > 250 ? 'rgba(245, 158, 11, 1)' : 
        'rgba(34, 197, 94, 1)'
      ),
      borderWidth: 2,
    }]
  });

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Inter',
            size: 12,
            weight: '600'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: {
          family: 'Inter',
          size: 14,
          weight: '600'
        },
        bodyFont: {
          family: 'Inter',
          size: 12
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 11
          },
          color: '#6b7280'
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 11
          },
          color: '#6b7280'
        }
      }
    }
  };

  const barOptions = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Flood Events',
          font: { size: 14, weight: '600' }
        }
      },
      x: {
        ...commonOptions.scales.x,
        title: {
          display: true,
          text: 'Cities',
          font: { size: 14, weight: '600' }
        }
      }
    }
  };

  const scatterOptions = {
    ...commonOptions,
    scales: {
      x: {
        ...commonOptions.scales.x,
        title: {
          display: true,
          text: 'Average Temperature (°C)',
          font: { size: 14, weight: '600' }
        }
      },
      y: {
        ...commonOptions.scales.y,
        title: {
          display: true,
          text: 'Flood Magnitude',
          font: { size: 14, weight: '600' }
        }
      }
    }
  };

  const correlationOptions = {
    ...commonOptions,
    scales: {
      x: {
        ...commonOptions.scales.x,
        title: {
          display: true,
          text: 'Cities',
          font: { size: 14, weight: '600' }
        }
      },
      y: {
        ...commonOptions.scales.y,
        title: {
          display: true,
          text: 'Humidity (%)',
          font: { size: 14, weight: '600' }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Flood Count (Scaled)',
          font: { size: 14, weight: '600' }
        },
        grid: {
          drawOnChartArea: false,
        },
      }
    }
  };

  const lineOptions = {
    ...commonOptions,
    scales: {
      x: {
        ...commonOptions.scales.x,
        title: {
          display: true,
          text: 'Cities (Sorted by Wind Speed)',
          font: { size: 14, weight: '600' }
        }
      },
      y: {
        ...commonOptions.scales.y,
        title: {
          display: true,
          text: 'Flood Magnitude',
          font: { size: 14, weight: '600' }
        }
      }
    }
  };

  // Pie chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Inter',
            size: 12,
            weight: '600'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} cities (${percentage}%)`;
          }
        }
      }
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading flood analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🌊 Flood Analytics Dashboard</h2>
        <p className="text-gray-600">Comprehensive analysis of coastal flood patterns and risk factors</p>
        
                 {/* Chart Explanation */}
         <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200 max-w-4xl mx-auto">
           <h3 className="font-semibold text-blue-800 mb-2">📊 How to Read These Charts:</h3>
           <div className="text-sm text-blue-700 space-y-2">
             <div><strong>Line Charts:</strong> Cities are sorted by environmental factor (temperature/wind speed) from left to right. The line shows how flood magnitude changes across different environmental conditions.</div>
             
             <div><strong>Bar Charts:</strong> Direct comparison of values between different cities.</div>
             <div><strong>Color Coding:</strong> Red = High Risk, Orange = Medium Risk, Green = Low Risk</div>
             <div><strong>Trend Lines:</strong> Dashed red lines show correlation direction and strength</div>
           </div>
         </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Flood Frequency by City */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Flood Frequency by City</h3>
          <div className="h-80">
            <Bar data={getFloodFrequencyData()} options={barOptions} />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Shows the total number of flood events recorded for each coastal city
          </p>
        </div>

        {/* 2. Temperature vs Flood Risk */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🌡️ Temperature vs Flood Risk</h3>
          <div className="h-80">
            <Line data={getTemperatureVsFloodData()} options={lineOptions} />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Line chart showing cities sorted by temperature (left=cool, right=hot) and their flood magnitude
          </p>
          {/* Correlation Insights */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-blue-800">📊 Correlation Analysis:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                Math.abs(correlationInsights.temperature?.correlation || 0) > 0.7 ? 'bg-red-100 text-red-800' :
                Math.abs(correlationInsights.temperature?.correlation || 0) > 0.4 ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {correlationInsights.temperature?.strength || 'Calculating...'}
              </span>
            </div>
            <div className="mt-2 text-xs text-blue-700">
              <div><strong>Correlation:</strong> {(correlationInsights.temperature?.correlation || 0).toFixed(3)}</div>
              <div><strong>Direction:</strong> {correlationInsights.temperature?.direction || 'Calculating...'}</div>
              <div><strong>Insight:</strong> {correlationInsights.temperature?.interpretation || 'Calculating...'}</div>
            </div>
          </div>
        </div>

                 {/* 3. Humidity vs Flood Occurrence */}
         <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/20">
           <h3 className="text-lg font-semibold text-gray-800 mb-4">💧 Humidity vs Flood Occurrence</h3>
           <div className="h-80">
             <Bar data={getHumidityVsFloodData()} options={correlationOptions} />
           </div>
           <p className="text-sm text-gray-600 mt-3">
             Relationship between humidity levels and flood event frequency
           </p>
           {/* Correlation Insights */}
           <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
             <div className="flex items-center justify-between">
               <span className="text-sm font-semibold text-purple-800">📊 Correlation Analysis:</span>
               <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                 Math.abs(correlationInsights.humidity?.correlation || 0) > 0.7 ? 'bg-red-100 text-red-800' :
                 Math.abs(correlationInsights.humidity?.correlation || 0) > 0.4 ? 'bg-yellow-100 text-yellow-800' :
                 'bg-green-100 text-green-800'
               }`}>
                 {correlationInsights.humidity?.strength || 'Calculating...'}
               </span>
             </div>
             <div className="mt-2 text-xs text-purple-700">
               <div><strong>Correlation:</strong> {(correlationInsights.humidity?.correlation || 0).toFixed(3)}</div>
               <div><strong>Direction:</strong> {correlationInsights.humidity?.direction || 'Calculating...'}</div>
               <div><strong>Insight:</strong> {correlationInsights.humidity?.interpretation || 'Calculating...'}</div>
             </div>
           </div>
         </div>

         {/* 4. Flood Risk Distribution (Pie Chart) */}
         <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/20">
           <h3 className="text-lg font-semibold text-gray-800 mb-4">🚨 Flood Risk Distribution</h3>
           <div className="h-80">
             <Doughnut data={getFloodRiskDistributionData()} options={pieOptions} />
           </div>
           <p className="text-sm text-gray-600 mt-3">
             Visual breakdown of cities by flood risk level (High/Medium/Low)
           </p>
           {/* Risk Summary */}
           <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
             <div className="text-sm text-red-700">
               <div className="flex justify-between mb-1">
                 <span><strong>High Risk Cities:</strong></span>
                 <span className="font-medium">{floodData.filter(d => d.avgMagnitude > 8.5 || d.avgArea > 300).length}</span>
               </div>
               <div className="flex justify-between mb-1">
                 <span><strong>Medium Risk Cities:</strong></span>
                 <span className="font-medium">{floodData.filter(d => (d.avgMagnitude > 8.0 && d.avgMagnitude <= 8.5) || (d.avgArea > 250 && d.avgArea <= 300)).length}</span>
               </div>
               <div className="flex justify-between">
                 <span><strong>Low Risk Cities:</strong></span>
                 <span className="font-medium">{floodData.filter(d => d.avgMagnitude <= 8.0 && d.avgArea <= 250).length}</span>
               </div>
             </div>
           </div>
         </div>
         
       </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-blue-600">🏙️</span>
            <h4 className="font-semibold text-blue-800">Cities Analyzed</h4>
          </div>
          <p className="text-2xl font-bold text-blue-600">{floodData.length}</p>
          <p className="text-sm text-blue-600">coastal locations</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-600">📈</span>
            <h4 className="font-semibold text-green-800">Total Flood Events</h4>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {floodData.reduce((sum, d) => sum + d.floodCount, 0)}
          </p>
          <p className="text-sm text-green-600">recorded incidents</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-purple-600">🌊</span>
            <h4 className="font-semibold text-purple-800">Avg Magnitude</h4>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {(floodData.reduce((sum, d) => sum + d.avgMagnitude, 0) / floodData.length).toFixed(1)}
          </p>
          <p className="text-sm text-purple-600">flood intensity</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-orange-600">📊</span>
            <h4 className="font-semibold text-orange-800">Data Points</h4>
          </div>
          <p className="text-2xl font-bold text-orange-600">
            {floodData.reduce((sum, d) => sum + d.floodCount, 0) * 6}
          </p>
          <p className="text-sm text-orange-600">environmental factors</p>
        </div>
      </div>

      {/* Comprehensive Insights Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🔍 Key Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Temperature Insights */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">🌡️ Temperature Analysis</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Correlation Strength:</span>
                <span className={`font-medium ${
                  Math.abs(correlationInsights.temperature?.correlation || 0) > 0.7 ? 'text-red-600' :
                  Math.abs(correlationInsights.temperature?.correlation || 0) > 0.4 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {correlationInsights.temperature?.strength || 'Calculating...'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Correlation Value:</span>
                <span className="font-medium">{(correlationInsights.temperature?.correlation || 0).toFixed(3)}</span>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                {correlationInsights.temperature?.interpretation || 'Calculating correlation...'}
              </div>
            </div>
          </div>



          {/* Humidity Insights */}
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-3">💧 Humidity Analysis</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Correlation Strength:</span>
                <span className={`font-medium ${
                  Math.abs(correlationInsights.humidity?.correlation || 0) > 0.7 ? 'text-red-600' :
                  Math.abs(correlationInsights.humidity?.correlation || 0) > 0.4 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {correlationInsights.humidity?.strength || 'Calculating...'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Correlation Value:</span>
                <span className="font-medium">{(correlationInsights.humidity?.correlation || 0).toFixed(3)}</span>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                {correlationInsights.humidity?.interpretation || 'Calculating correlation...'}
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="mt-6 bg-white rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-gray-800 mb-3">🚨 Risk Assessment & Recommendations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-red-600 mb-2">High Risk Indicators:</h5>
              <ul className="space-y-1 text-gray-700">
                <li>• Cities with temperature &gt; 30°C and high flood magnitude</li>

                <li>• Locations with humidity &gt; 80% and frequent flood events</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-green-600 mb-2">Prevention Strategies:</h5>
              <ul className="space-y-1 text-gray-700">
                <li>• Monitor temperature thresholds for early warning</li>

                <li>• Use humidity data for flood prediction models</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloodAnalytics;
