"use client";

const Home = () => {
  return (
    <div className="container">
      <h1>Welcome to the Spelling Bee Generator</h1>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Home;