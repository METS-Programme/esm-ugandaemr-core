import { UserHasAccess } from '@openmrs/esm-framework';
import React from 'react';
import ActiveVisitsTabs from './active-visits/active-visits-tab.component';
import ActiveVisitsTable from './active-visits/active-visits-table.component';
import {
  PRIVILEGE_CLINICIAN_QUEUE_LIST,
  PRIVILEGE_RECEPTION_QUEUE_LIST,
  PRIVILEGE_TRIAGE_QUEUE_LIST,
} from './constants';
import PatientQueueHeader from './patient-queue-header/patient-queue-header.component';
import ClinicMetrics from './patient-queue-metrics/clinic-metrics.component';

interface HomeProps {}

const Home: React.FC<HomeProps> = (props) => {
  return (
    <div>
      <PatientQueueHeader />
      <ClinicMetrics />
      <UserHasAccess privilege={PRIVILEGE_RECEPTION_QUEUE_LIST}>
        <ActiveVisitsTable status={''} />
      </UserHasAccess>
      <UserHasAccess privilege={PRIVILEGE_TRIAGE_QUEUE_LIST}>
        <ActiveVisitsTabs />
      </UserHasAccess>
      <UserHasAccess privilege={PRIVILEGE_CLINICIAN_QUEUE_LIST}>
        <ActiveVisitsTable status={'pending'} />
      </UserHasAccess>
    </div>
  );
};

export default Home;
