import React from 'react';
import PotionProgress from './PotionProgress';

const Question = ({ 
  questions, 
  currentQuestion, 
  randomizedOptions, 
  handleAnswer, 
  answers, 
  houses 
}) => {
  return (
    <div>
      <PotionProgress 
        totalQuestions={questions.length}
        currentQuestion={currentQuestion}
        answers={answers}
      />
    
      <h2>{questions[currentQuestion].question}</h2>
      <div className="answer-container-container">
        {randomizedOptions.map((option, index) => (
          <div key={index} className="answer-container">
            <button onClick={() => handleAnswer(option)} className="answer-button">
              <img 
                src={`./icons/${currentQuestion}-${option.originalIndex}.png`} 
                alt={`Answer ${option.originalIndex + 1}`}
                className="answer-image"
              />
              <span className="answer-text">{option.text}</span>
            </button>
            <div className="answer-points">
              {Object.entries(option.points).map(([house, points]) => (
                <span key={house} className={`house-point ${house}`}>
                  {houses.find(h => h.id === house)?.name || house} +{points}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question; 