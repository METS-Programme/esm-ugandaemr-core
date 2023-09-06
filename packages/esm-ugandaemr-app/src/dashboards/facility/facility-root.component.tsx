import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FacilityDashboard from './facility-dashboard.component';

const FacilityRoot: React.FC = () => {
  return (
    <BrowserRouter basename={`${window.spaBase}/home/facility-dashboard`}>
      <Routes>
        <Route path="/" element={<FacilityDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default FacilityRoot;
