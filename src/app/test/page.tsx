"use client";

const Test = () => {
  return (
    <div className="container">
      <h1>Test Page</h1>
      <p>This is the test page.</p>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          min-height: 100vh;
          text-align: center;
          padding-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default Test;