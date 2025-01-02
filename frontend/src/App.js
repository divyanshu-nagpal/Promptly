import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import NewPrompt from './pages/NewPrompt';
import Header from './components/Header';
import Footer from './components/Footer';
import CommunityPage from './pages/communityPage/CommunityPage';
import ProfilePage from './pages/profilePage/ProfilePage';
import VerifyPage from './pages/VerificationPage';

const App = () => {
    return (
        <Router>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/home" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/add-prompt" element={<NewPrompt />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/verify-email/:verificationtoken" element={<VerifyPage />} />
                </Routes>
            </main>
            <FooterWrapper />
        </Router>
    );
};

// New FooterWrapper component that conditionally renders Footer
const FooterWrapper = () => {
    const location = useLocation(); // Now it's inside Router
    return location.pathname !== '/community' ? <Footer /> : null;
};

export default App;
