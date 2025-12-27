import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EarthStoreSutra from './pages/EarthStoreSutra';
import HeartSutra from './pages/HeartSutra';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/earth-store" element={<EarthStoreSutra />} />
                <Route path="/heart-sutra" element={<HeartSutra />} />
            </Routes>
        </Router>
    );
};

export default App;
