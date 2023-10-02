import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserDashboard from './user-dashboard.component';

const UserDashboardRoot: React.FC = () => {
  return (
    <BrowserRouter basename={`${window.spaBase}/home/user-dashboard`}>
      <Routes>
        <Route path="/" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default UserDashboardRoot;
