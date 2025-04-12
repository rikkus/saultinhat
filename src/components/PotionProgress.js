import React, { useState, useEffect, useRef } from 'react';

const PotionProgress = ({ totalQuestions, currentQuestion, answers }) => {
  const [animatingIndex, setAnimatingIndex] = useState(null);
  const audio = new Audio('./drunk.m4a');
  audio.volume = 0.4;
  const audioRef = useRef(audio);

  // Watch for new answers and animate only the current question's potion
  useEffect(() => {
    if (answers.length > 0 && answers.length === currentQuestion) {
      setAnimatingIndex(currentQuestion - 1);
      
      audioRef.current.currentTime = 0; // Reset the audio to start
      audioRef.current.play().catch(e => console.log('Error playing sound:', e));
      
      // Clear animation state after animation completes
      setTimeout(() => {
        setAnimatingIndex(null);
      }, 500); // Match animation duration
    }
  }, [answers.length, currentQuestion]);

  return (
    <div className="potion-shelf" style={{
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto 2rem',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'linear-gradient(to bottom, #4a3423 0%, #2c1810 100%)',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
      position: 'relative'
    }}>
     
      {Array.from({ length: totalQuestions }).map((_, index) => {
        const isAnimating = index === animatingIndex;
        const isDrunk = index < answers.length;
        
        return (
          <div
            key={index}
            className="potion-container"
            style={{
              width: '40px',
              height: '40px',
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end'
            }}
          >
            <img 
              src={isDrunk ? '/potion-empty.png' : '/potion-full.png'} 
              alt={isDrunk ? 'Empty potion' : 'Full potion'}
              style={{
                width: '30px',
                height: 'auto',
                transform: isAnimating ? 'rotate(-90deg)' : isDrunk ? 'rotate(-90deg)' : 'none',
                transition: 'transform 0.5s ease'
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PotionProgress; 