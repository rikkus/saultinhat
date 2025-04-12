import React from 'react';

const DebugPanel = ({ 
  showDebug, 
  houses, 
  selectedHouses, 
  handleCheckboxChange, 
  houseTotals,
  showResultForSelectedHouses,
  getHouseById
}) => {
  // Get style for selected houses
  const getSelectedHousesStyle = () => {
    if (selectedHouses.length === 0) {
      return { backgroundColor: '#ccc', color: '#333' };
    }
    
    if (selectedHouses.length === 1) {
      const house = houses.find(h => h.id === selectedHouses[0]);
      return {
        backgroundColor: house ? house.colors.primary : '#ccc',
        color: house ? house.colors.text || '#fff' : '#fff'
      };
    }
    
    // For mixed houses, create a gradient
    const colors = selectedHouses.map(id => {
      const house = houses.find(h => h.id === id);
      return house ? house.colors.primary : '#ccc';
    });
    const gradientColors = colors.join(', ');
    
    return {
      background: `linear-gradient(135deg, ${gradientColors})`,
      color: '#fff'
    };
  };

  // Get name for selected houses
  const getSelectedHousesName = () => {
    if (selectedHouses.length === 0) {
      return 'No house selected';
    }
    
    if (selectedHouses.length === 1) {
      const house = houses.find(h => h.id === selectedHouses[0]);
      return house ? house.name : selectedHouses[0];
    }
    
    const sortedHouses = [...selectedHouses].sort();
    return houses
      .filter(h => sortedHouses.includes(h.id))
      .map(h => h.name)
      .join(' + ');
  };

  const BarChart = ({ data, title }) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    const percentages = Object.entries(data).reduce((acc, [house, value]) => {
      acc[house] = total > 0 ? (value / total) * 100 : 0;
      return acc;
    }, {});

    return (
      <div className="bar-chart">
        <h4>{title}</h4>
        <div className="percentage-bar">
          {Object.entries(percentages).map(([houseId, percentage]) => (
            percentage > 0 && (
              <div
                key={houseId}
                className={`percentage-segment ${houseId}`}
                style={{ width: `${percentage}%` }}
              />
            )
          ))}
        </div>
        <table className="percentage-legend">
          <tbody>
            {Object.entries(percentages).map(([houseId, percentage]) => {
              const house = getHouseById(houseId);
              return (
                <tr key={houseId} className="legend-item">
                  <td>
                    <div className={`legend-color ${houseId}`} />
                    {house.name}
                  </td>
                  <td>
                    {percentage.toFixed(0)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={`debug-panel ${showDebug ? 'open' : ''}`}>
      <h3>Skip to House:</h3>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        gap: '0.5rem', 
        width: '100%' 
      }}>
        {houses.map(house => (
          <div key={house.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              id={`house-${house.id}`}
              checked={selectedHouses.includes(house.id)}
              onChange={() => handleCheckboxChange(house.id)}
            />
            <label 
              htmlFor={`house-${house.id}`}
              style={{
                color: house.colors.text || '#fff',
                fontWeight: 'bold'
              }}
            >
              {house.name}
            </label>
          </div>
        ))}
        
        <div 
          className="selected-houses"
          style={{ ...getSelectedHousesStyle() }}
        >
          {getSelectedHousesName()}
        </div>
        
        <button 
          className="show-result"
          onClick={showResultForSelectedHouses}
          disabled={selectedHouses.length === 0}
          style={{ 
            marginTop: '10px',
            width: '100%',
            opacity: selectedHouses.length === 0 ? 0.5 : 1
          }}
        >
          Show Result
        </button>
      </div>
      <hr />
      <div className="charts-container">
        <BarChart 
          data={houseTotals} 
          title="Running percentages" 
        />
      </div>
    </div>
  );
};

export default DebugPanel; 