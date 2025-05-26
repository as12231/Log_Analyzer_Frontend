import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../Pages/LandingPage';
import Login from '../Pages/Login';
import Signup from '../Pages/Signup';
import ForgotPassword from '../Pages/ForgotPassword';
import Logout from '../Pages/Logout';
import LogAnalysisDashboard from '../Pages/LogAnalysisDashboard';

// import AuthGuard from './AuthGuard';
// import ErrorPage from '../Components/Pages/ErrorPage'; // If you have a 404 error page

const AppRouters = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/xn" element={<LogAnalysisDashboard />} />
      
    </Routes>
  );
};

export default AppRouters;
