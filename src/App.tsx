// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Todos/Todos';
import DashboardWithCharts from './pages/Dashboard/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import Recoveryimport from './components/RecoveryPassword/RecoveryPassword';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/forgot-password" element={<Recoveryimport />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <DashboardWithCharts />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/todos"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Login />} />
                    <Route path='/profile' element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
