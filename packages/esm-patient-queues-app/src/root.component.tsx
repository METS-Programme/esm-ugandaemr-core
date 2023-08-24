import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SWRConfig } from 'swr';
import ServicesTable from './queue-patient-linelists/queue-services-table.component';
import AppointmentsTable from './queue-patient-linelists/scheduled-appointments-table.component';

const swrConfiguration = {
  errorRetryCount: 3,
};

const Root: React.FC = () => {
  return (
    <main>
      <SWRConfig value={swrConfiguration}>
        <BrowserRouter basename={`${window.spaBase}/home/patient-queues`}>
          <Routes>
            <Route path="/" element={<ServicesTable />} />
            <Route path="/appointments-list/:value/" element={<AppointmentsTable />} />
          </Routes>
        </BrowserRouter>
      </SWRConfig>
    </main>
  );
};

export default Root;
