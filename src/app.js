import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './navigation-bar';
import Home from './home/home';
import AdminDashboard from './person/AdminDashboard';
import PersonContainer from './person/person-container';
import ClientContainer from './person/ClientDashboard'; 
import LoginForm from './commons/login/components/LoginForm'; 
import ErrorPage from './commons/errorhandling/error-page';
import * as API_USERS from './person/api/person-api';
import './commons/styles/project-style.css';

const App = () => {
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !loggedIn) {
            API_USERS.getCurrentUser((result, status) => {
                if (status === 200) {
                    setUser(result);
                    setLoggedIn(true);
                } else {
                    setUser(null);
                    setLoggedIn(false);
                }
            });
        }
    }, [loggedIn]);

    const handleLogin = (user) => {
        setUser(user);
        setLoggedIn(true);
    };

    const handleLogout = () => {
        API_USERS.logout();
        localStorage.removeItem('token');
        setUser(null);
        setLoggedIn(false);
    };

    return (
        <Router>
            <NavigationBar user={user} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={loggedIn ? <Navigate to="/" /> : <LoginForm onLogin={handleLogin} />} />

                {/* Admin Routes */}
                <Route path="/admin" element={loggedIn && user.role === 'Admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
                <Route path="/admin/users" element={loggedIn && user.role === 'Admin' ? <PersonContainer /> : <Navigate to="/login" />} />
                
                {/* Client Route */}
                <Route path="/client" element={loggedIn && user.role.toLowerCase() === 'client' ? <ClientContainer userId={user.id} /> : <Navigate to="/login" />} />

                {/* Error Route */}
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </Router>
    );
};

export default App;
