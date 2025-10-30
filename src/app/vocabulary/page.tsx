"use client";

import { useEffect, useState } from 'react';

interface VocabularyWord {
  word: string;
  definition: string;
}

interface VocabularyData {
  [age: string]: VocabularyWord;
}

const Vocabulary = () => {
  const [loading, setLoading] = useState(true);
  const [vocabularyData, setVocabularyData] = useState<VocabularyData>({});
  const [error, setError] = useState<string | null>(null);

  const fetchVocabularyWords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/vocabulary');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setVocabularyData(data);
    } catch (error) {
      console.error('Error fetching vocabulary words:', error);
      setError('Error loading vocabulary words.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocabularyWords();
  }, []);

  const ageGroups = ['6', '9', '12', '14'];

  return (
    <div className="container">
      <h1>Vocabulary Words of the Day</h1>
      {loading && <div className="loading">Loading vocabulary words...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && (
        <>
          <div className="vocabulary-grid">
            {ageGroups.map((age) => (
              <div key={age} className="vocabulary-card">
                <h2>Age {age}</h2>
                <div className="word-section">
                  <h3 className="word">{vocabularyData[age]?.word || 'No word available'}</h3>
                  <p className="definition">{vocabularyData[age]?.definition || 'No definition available'}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="regenerate-button" onClick={fetchVocabularyWords}>
            Get New Words
          </button>
        </>
      )}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          min-height: 100vh;
          text-align: center;
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .vocabulary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          width: 100%;
          margin-bottom: 30px;
        }
        
        .vocabulary-card {
          background-color: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .vocabulary-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }
        
        .vocabulary-card h2 {
          color: #495057;
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          border-bottom: 2px solid #0070f3;
          padding-bottom: 8px;
        }
        
        .word-section {
          text-align: left;
        }
        
        .word {
          color: #0070f3;
          font-size: 24px;
          font-weight: bold;
          margin: 0 0 12px 0;
          text-transform: capitalize;
        }
        
        .definition {
          color: #495057;
          font-size: 16px;
          line-height: 1.5;
          margin: 0;
        }
        
        .regenerate-button {
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          background-color: #0070f3;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.2s;
        }
        
        .regenerate-button:hover {
          background-color: #005bb5;
          transform: translateY(-1px);
        }
        
        .regenerate-button:active {
          transform: translateY(0);
        }
        
        .loading, .error {
          font-style: italic;
          color: #666;
          font-size: 18px;
          margin: 40px 0;
        }
        
        .error {
          color: #dc3545;
        }
        
        h1 {
          color: #333;
          margin-bottom: 30px;
          font-size: 32px;
        }
        
        @media (max-width: 768px) {
          .vocabulary-grid {
            grid-template-columns: 1fr;
          }
          
          .container {
            padding: 15px;
          }
          
          h1 {
            font-size: 28px;
          }
          
          .word {
            font-size: 20px;
          }
          
          .definition {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default Vocabulary;