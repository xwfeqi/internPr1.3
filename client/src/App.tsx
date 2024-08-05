import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProfilePage from './components/ProfilePage';
import ActivationPage from './components/ActivationPage';
import SelectStudyDate from './components/SelectStudyDate';
import { UserProvider } from './context/UserContext';
import AdminPanel from './components/AdminPanel';

function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/activation-page" element={<ActivationPage />} />
                    <Route path="/select-study-date" element={<SelectStudyDate />} />
                    <Route path="/admin/students" element={<AdminPanel />} />
                    <Route path="*" element={<Navigate to="login" />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
