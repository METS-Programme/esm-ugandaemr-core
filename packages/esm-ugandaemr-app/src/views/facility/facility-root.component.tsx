import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FacilityHome from './facility-home.component';

const FacilityRoot: React.FC = () => {
  return (
    <BrowserRouter basename={`${window.spaBase}/home/facility-dashboard`}>
      <Routes>
        <Route path="/" element={<FacilityHome />} />
      </Routes>
    </BrowserRouter>
  );
};

export default FacilityRoot;
