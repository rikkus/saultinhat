import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import WelcomePage from './components/WelcomePage';
import DebugPanel from './components/DebugPanel';
import Result from './components/Result';
import Question from './components/Question';

function App() {
  const [houses, setHouses] = useState([]);
  const [mixedHouses, setMixedHouses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [houseTotals, setHouseTotals] = useState({});
  const [randomizedOptions, setRandomizedOptions] = useState([]);
  const [dynamicStyles, setDynamicStyles] = useState('');
  const [selectedHouses, setSelectedHouses] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const audioRef = useRef(null);

  // Load houses data and generate dynamic CSS
  useEffect(() => {
    fetch('/houses.json')
      .then(response => response.json())
      .then(data => {
        setHouses(data);
        
        // Initialize house totals
        const totals = {};
        data.forEach(house => {
          totals[house.id] = 0;
        });
        setHouseTotals(totals);
        
        // Generate dynamic CSS based on house data
        generateDynamicCSS(data);
      })
      .catch(error => console.error('Error loading houses:', error));
  }, []);
  
  useEffect(() => {
    fetch('/mixed-houses.json')
      .then(response => response.json())
      .then(data => {
        setMixedHouses(data);
      })
      .catch(error => console.error('Error loading mixed-houses:', error));
  }, []);

  // Load questions data
  useEffect(() => {
    fetch('/questions.json')
      .then(response => response.json())
      .then(data => setQuestions(data))
      .catch(error => console.error('Error loading questions:', error));
  }, []);

  // Load saved state after all data is loaded
  useEffect(() => {
    if (houses.length > 0 && mixedHouses.length > 0 && questions.length > 0 && !isInitialized) {
      const savedState = localStorage.getItem('gameState');
      if (savedState) {
        try {
          const {
            currentQuestion,
            answers,
            result,
            showQuiz,
            houseTotals,
            selectedHouses,
            randomizedOptions
          } = JSON.parse(savedState);

          setCurrentQuestion(currentQuestion);
          setAnswers(answers);
          setResult(result);
          setShowQuiz(showQuiz);
          setHouseTotals(houseTotals);
          setSelectedHouses(selectedHouses);
          if (randomizedOptions) {
            setRandomizedOptions(randomizedOptions);
          }
        } catch (error) {
          console.error('Error restoring game state:', error);
          localStorage.removeItem('gameState');
        }
      }
      setIsInitialized(true);
    }
  }, [houses, mixedHouses, questions, isInitialized]);

  // Save state whenever it changes
  useEffect(() => {
    if (isInitialized) {  // Only save state after initial load
      const gameState = {
        currentQuestion,
        answers,
        result,
        showQuiz,
        houseTotals,
        selectedHouses,
        randomizedOptions
      };
      localStorage.setItem('gameState', JSON.stringify(gameState));
    }
  }, [currentQuestion, answers, result, showQuiz, houseTotals, selectedHouses, randomizedOptions, isInitialized]);

  // Function to get crest path for a house
  const crest = (houseId) => {
    return `/crests/${houseId}.png`;
  };

  const initialTotals = () => {
    const totals = {};
    houses.forEach(house => {
      totals[house.id] = 0;
    });
    return totals;
  }

  // Generate dynamic CSS based on house data
  const generateDynamicCSS = (houseData) => {
    let css = '';
    
    // Generate CSS for single houses
    houseData.forEach(house => {
      const primaryColor = house.colors.primary;
      const textColor = house.colors.secondary;
      
      // App header background
      css += `
        .App-header[class*="${house.id}"] {
          background-color: ${primaryColor};
          color: ${textColor};
        }
      `;
      
      // House point styling
      css += `
        .house-point[class*="${house.id}"] {
          background-color: ${primaryColor};
          color: ${textColor};
        }
      `;
      
      // Percentage segment styling
      css += `
        .percentage-segment[class*="${house.id}"] {
          background-color: ${primaryColor};
        }
      `;
      
      // Legend color styling
      css += `
        .legend-color[class*="${house.id}"] {
          background-color: ${primaryColor};
        }
      `;
    });
    
    // Generate CSS for mixed houses
    for (let i = 0; i < houseData.length; i++) {
      for (let j = i + 1; j < houseData.length; j++) {
        const houseId1 = houseData[i].id;
        const houseId2 = houseData[j].id;
        const color1 = houseData[i].colors.primary;
        const color2 = houseData[j].colors.primary;
        
        css += `
          .App-header[class*="${houseId1}"][class*="${houseId2}"] {
            background: linear-gradient(135deg, ${color1} 0%, ${color2} 100%);
            color: #FFFFFF;
          }
        `;
      }
    }
    
    setDynamicStyles(css);
  };

  // Initialize randomized options for the first question
  useEffect(() => {
    if (questions.length > 0) {
      // Check if we have saved answers
      if (answers.length > 0) {
        // If we're restoring a previous session, set up all randomized options up to the current question
        const allRandomizedOptions = [];
        for (let i = 0; i <= currentQuestion; i++) {
          if (i < questions.length) {
            const currentOptions = questions[i].options;
            const shuffled = [...currentOptions].sort(() => Math.random() - 0.5);
            allRandomizedOptions.push(shuffled);
          }
        }
        // Set the current randomized options
        setRandomizedOptions(allRandomizedOptions[currentQuestion] || []);
      } else if (currentQuestion < questions.length) {
        // If it's a new session, just randomize the first question
        const currentOptions = questions[currentQuestion].options;
        const shuffled = [...currentOptions].sort(() => Math.random() - 0.5);
        setRandomizedOptions(shuffled);
      }
    }
  }, [questions, currentQuestion, answers.length]);

  // Toggle debug panel with 'd' key
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'd') {
        setShowDebug(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const housePoints = (answers) => {
    const totals = initialTotals();
    answers.forEach(answer => {
      Object.entries(answer.points).forEach(([house, points]) => {
        totals[house] = (totals[house] || 0) + points;
      });
    });
    return totals;
  };

  const getHouseByIds = (houseIds) => {

    if (!houseIds || houseIds.length === 0) return '';
    if (houseIds.length === 1) {
      return houses.find(h => h.id === houseIds[0]);
    }
    
    // Sort house IDs to ensure consistent lookup
    const sortedHouseIds = [...houseIds].sort();
    
    // Look for a matching mixed house in the mixedHouses data
    return mixedHouses.find(mh => {
      const mixedHouseIds = [...mh.houses].sort();
      return JSON.stringify(mixedHouseIds) === JSON.stringify(sortedHouseIds);
    });
  };

  // Helper function to get house by ID
  const getHouseById = (houseId) => {
    return houses.find(h => h.id === houseId);
  };

  const handleAnswer = (selectedOption) => {
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);

    const totals = housePoints(newAnswers);
    setHouseTotals(totals);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
 ;

      const winners = winningHouses(totals);
      setResult(winners);
      setShowQuiz(false);
      playHouseAudio(winners);
    }
  };

  const winningHouses = (totals) => {
    const maxPoints = Math.max(...Object.values(totals));
    return Object.entries(totals)
      .filter(([_, points]) => points === maxPoints)
      .map(([house, _]) => house);
  }

  const playHouseAudio = (houses) => {
    const house = getHouseByIds(houses);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(`./audio/${house.id}.m4a`);
    audioRef.current.play().catch(e => console.log('Error playing house audio:', e));
  }

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setShowQuiz(false);
    setHouseTotals({});
    setSelectedHouses([]);
    // Clear saved state
    localStorage.removeItem('gameState');
  };

  // Handle checkbox change
  const handleCheckboxChange = (houseId) => {
    setSelectedHouses(prev => {
      if (prev.includes(houseId)) {
        return prev.filter(id => id !== houseId);
      } else {
        return [...prev, houseId];
      }
    });
  };
  
  // Show result for selected houses
  const showResultForSelectedHouses = () => {
    if (selectedHouses.length === 0) return;
    
    const fakeAnswers = questions.map(question => {
      const relevantOption = question.options.find(option => 
        selectedHouses.some(houseId => option.points[houseId])
      );
      return relevantOption || question.options[0];
    });
    
    setAnswers(fakeAnswers);
    setCurrentQuestion(questions.length);
    
    const totals = { ...houseTotals };

    fakeAnswers.forEach(answer => {
      Object.entries(answer.points).forEach(([house, points]) => {
        totals[house] += points;
      });
    });

    setHouseTotals(totals);
    setResult(selectedHouses);
    setShowQuiz(false);
    playHouseAudio(selectedHouses);
  };

  return (
    <div className="App">
      <style>{dynamicStyles}</style>
      <div style={{ flex: showDebug ? '0 0 70%' : '1 1 100%', transition: 'flex 0.3s ease', width: '100%' }}>
        <header className={`App-header ${result ? result.join(' ') + ' with-result' : ''} ${showDebug ? 'with-debug' : ''}`}>
          {result ? (
            <Result 
              result={result}
              getHouseByIds={getHouseByIds}
              resetQuiz={resetQuiz}
              houses={houses}
              crest={crest}
            />
          ) : !showQuiz ? (
            <WelcomePage onBegin={() => setShowQuiz(true)} />
          ) : questions && questions.length > 0 && currentQuestion < questions.length ? (
            <Question 
              questions={questions}
              currentQuestion={currentQuestion}
              randomizedOptions={randomizedOptions}
              handleAnswer={handleAnswer}
              answers={answers}
              houses={houses}
            />
          ) : null}
        </header>
      </div>
      
      <DebugPanel 
        showDebug={showDebug}
        houses={houses}
        selectedHouses={selectedHouses}
        handleCheckboxChange={handleCheckboxChange}
        houseTotals={houseTotals}
        showResultForSelectedHouses={showResultForSelectedHouses}
        getHouseById={getHouseById}
      />
    </div>
  );
}

export default App;
