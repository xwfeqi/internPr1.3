import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import ProfilePage from './components/ProfilePage';
import ActivationPage from './components/ActivationPage';
import { UserProvider, useUser } from './context/UserContext';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
    const store = useUser();
    return store.isAuth && store.user?.isActivated ? element : <Navigate to="/activation-page" />;
};

const App: React.FC = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/activate/:link" element={<ActivationPage />} />
                    <Route path="/activation-page" element={<ActivationPage />} />
                    <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;
