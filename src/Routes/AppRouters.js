
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../Pages/LandingPage';
import Login from '../Pages/Login';
import Signup from '../Pages/Signup';
import ForgotPassword from '../Pages/ForgotPassword';
import Logout from '../Pages/Logout';
import LogAnalysisDashboard from '../Pages/LogAnalysisDashboard';
import LogDashboard from '../Pages/LogDashboard';


const AppRouters = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/xn" element={<LogAnalysisDashboard />} />
      <Route path="/x" element={<LogDashboard />} />
    </Routes>
  );
};

export default AppRouters;
