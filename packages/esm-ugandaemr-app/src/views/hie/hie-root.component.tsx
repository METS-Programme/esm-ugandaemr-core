import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HieHome from './hie-home.component';

const HieRoot: React.FC = () => {
  return (
    <BrowserRouter basename={`${window.spaBase}/home/reporting`}>
      <Routes>
        <Route path="/" element={<HieHome />} />
      </Routes>
    </BrowserRouter>
  );
};

export default HieRoot;
