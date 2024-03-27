import React from 'react';

import PatientQueueHeader from './patient-queue-header/patient-queue-header.component';
import ActiveVisitsTabs from './active-visits/active-visits-tab.component';
import { PRIVILEGE_CLINICIAN_QUEUE_LIST } from './constants';
import { useSession, userHasAccess } from '@openmrs/esm-framework';

const ClinicalRoomHome: React.FC = () => {
  const session = useSession();

  return (
    <div>
      <PatientQueueHeader title="Clinical Room" />
      {session?.user && userHasAccess(PRIVILEGE_CLINICIAN_QUEUE_LIST, session.user) && <ActiveVisitsTabs />}{' '}
    </div>
  );
};

export default ClinicalRoomHome;
