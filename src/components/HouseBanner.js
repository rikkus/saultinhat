import React from 'react';

const HouseBanner = ({ result, houses, crest }) => {
  return (
    <div className="banner" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      maxWidth: '800px',
      margin: '2rem auto 0',
      gap: '2rem',
      position: 'relative',
      minHeight: '300px'
    }}>
      {result.map((house, index) => (
        <div 
          key={house}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: result.length > 1 ? `${100 / result.length}%` : '50%',
            maxWidth: '300px',
            animation: `flyInFromBottom 1s ease-out ${index * 0.2}s forwards`
          }}
        >
          <img 
            src={crest(house)} 
            alt={`${houses.find(h => h.id === house)?.name || ''} crest`} 
            style={{ 
              width: '100%',
              maxWidth: '300px',
              margin: '0 auto'
            }}
          />
        </div>
      ))}
      <style>
        {`
          @keyframes flyInFromBottom {
            0% {
              opacity: 0;
              transform: translateY(100px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default HouseBanner; 