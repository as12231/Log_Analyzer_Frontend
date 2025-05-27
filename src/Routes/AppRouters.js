
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../Pages/LandingPage';
import Login from '../Pages/Login';
import Signup from '../Pages/Signup';
import ForgotPassword from '../Pages/ForgotPassword';
import Logout from '../Pages/Logout';
import LogAnalysisDashboard from '../Pages/LogAnalysisDashboard';
import LogDashboard from '../Pages/LogDashboard';
import LogFileDashboard from '../Pages/LogFileDashboard';

import AuthGuard from './AuthGuard'
const AppRouters = () => {
  return (
    <Routes>
      <Route path="/" element={<LogAnalysisDashboard />} />
      <Route path="/dashboard" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot_password" element={<ForgotPassword />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/history_insights" element={<LogDashboard />} />
      <Route path="/log_insights" element={<LogFileDashboard />} />
    </Routes>
  );
};

export default AppRouters;
