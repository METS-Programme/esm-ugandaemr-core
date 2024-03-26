import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SWRConfig } from 'swr';
import Home from './home.component';
import QueueBoardComponent from './queue-board/queue-board.component';
import TriageHome from './queue-triage-home.component';
import ReceptionHome from './queue-reception-home.component';
import ClinicalRoomHome from './queue-clinical-room-home.component';

const swrConfiguration = {
  errorRetryCount: 3,
};

const Root: React.FC = () => {
  return (
    <main>
      <SWRConfig value={swrConfiguration}>
        <BrowserRouter basename={`${window.getOpenmrsSpaBase()}` + 'home/patient-queues'}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/triage" element={<TriageHome />} />
            <Route path="/reception" element={<ReceptionHome />} />
            <Route path="/clinical-room" element={<ClinicalRoomHome />} />
            <Route path="/screen" element={<QueueBoardComponent />} />
          </Routes>
        </BrowserRouter>
      </SWRConfig>
    </main>
  );
};

export default Root;
