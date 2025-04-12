import React from 'react';
import HouseBanner from './HouseBanner';

const Result = ({ result, getHouseByIds, resetQuiz, houses, crest }) => {
  return (
    <div>
      <div className="result-container">
        <h2>Your House is: {getHouseByIds(result).name}</h2>
        <button onClick={resetQuiz}>Start Again</button>
      </div>
      <HouseBanner result={result} houses={houses} crest={crest} />
    </div>
  );
};

export default Result; 