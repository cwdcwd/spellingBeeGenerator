"use client";

const Home = () => {
  return (
    <div className="container">
      <h1>Welcome to the Spelling Bee Generator</h1>
      <p className="description">
        Generate spelling lists and vocabulary words for different age groups using AI.
      </p>
      <div className="features">
        <div className="feature">
          <h3>📝 Spelling Lists</h3>
          <p>Generate 7-day spelling schedules for ages 6, 9, 12, and 14</p>
        </div>
        <div className="feature">
          <h3>📚 Vocabulary Words</h3>
          <p>Daily vocabulary words with definitions for each age group</p>
        </div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .description {
          font-size: 18px;
          color: #666;
          margin-bottom: 40px;
          line-height: 1.6;
        }
        
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          width: 100%;
        }
        
        .feature {
          background-color: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .feature:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }
        
        .feature h3 {
          color: #333;
          margin-bottom: 12px;
          font-size: 20px;
        }
        
        .feature p {
          color: #666;
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
        }
        
        h1 {
          color: #333;
          margin-bottom: 20px;
        }
        
        @media (max-width: 768px) {
          .features {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;