import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SWRConfig } from 'swr';
import Home from './home.component';
import QueueBoardComponent from './queue-board/queue-board.component';

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
            <Route path="/screen" element={<QueueBoardComponent />} />
          </Routes>
        </BrowserRouter>
      </SWRConfig>
    </main>
  );
};

export default Root;
