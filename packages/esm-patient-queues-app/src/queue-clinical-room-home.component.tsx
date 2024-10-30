import React from 'react';

import PatientQueueHeader from './patient-queue-header/patient-queue-header.component';
import ActiveClinicalVisitsTabs from './active-visits/active-visits-clinical-tab.component';

const ClinicalRoomHome: React.FC = () => {
  return (
    <div>
      <PatientQueueHeader title="Clinical Room" />
      <ActiveClinicalVisitsTabs />
    </div>
  );
};

export default ClinicalRoomHome;
