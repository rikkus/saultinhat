import React from 'react';

const WelcomePage = ({ onBegin }) => {
  return (
    <div className="welcome-container">
      <div className="welcome-text">
        <h1>Welcome!</h1>
        <p>
          I am Saul Tinhat and I will ask you questions to help you choose your house.
        </p>
        <button 
          onClick={onBegin}
          className="begin-button"
        >
          Begin
        </button>
      </div>
      <div className="welcome-image">
        <img 
          src="/saul-tinhat-transparent.png" 
          alt="Saul Tinhat"
        />
      </div>
    </div>
  );
};

export default WelcomePage; 