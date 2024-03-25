import React from 'react';

import PatientQueueHeader from './patient-queue-header/patient-queue-header.component';
import ActiveVisitsTabs from './active-visits/active-visits-tab.component';

const ClinicalRoomHome: React.FC = () => {
  return (
    <div>
      <PatientQueueHeader title="Clinical Room" />
      <ActiveVisitsTabs />
    </div>
  );
};

export default ClinicalRoomHome;
