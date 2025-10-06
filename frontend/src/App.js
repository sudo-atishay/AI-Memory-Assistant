import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import MemoryAssistant from './components/MemoryAssistant';
import MemoryStats from './components/MemoryStats';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              🧠 AI Memory Assistant
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/memory" className="nav-link">
                  Memory Assistant
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/stats" className="nav-link">
                  Statistics
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/memory" element={<MemoryAssistant />} />
            <Route path="/stats" element={<MemoryStats />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
