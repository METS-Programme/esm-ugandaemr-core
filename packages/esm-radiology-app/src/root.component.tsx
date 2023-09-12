import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Radiology from './radiology.component';

const Root: React.FC = () => {
  return (
    <BrowserRouter basename={`${window.spaBase}/home/radiology`}>
      <Routes>
        <Route path="/" element={<Radiology />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
