import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Home() {
  return <h1 className="text-2xl font-bold text-center mt-10">Welcome to Healthcare MVP</h1>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes here later */}
      </Routes>
    </Router>
  );
}

export default App;
