import { UserHasAccess, useSession } from '@openmrs/esm-framework';
import React from 'react';
import ActiveVisitsReceptionTable from './active-visit-patient-reception/active-visits-reception-table.component';
import ActiveVisitsTabs from './active-visits/active-visits-tab.component';
import {
  PRIVILEGE_CLINICIAN_QUEUE_LIST,
  PRIVILEGE_RECEPTION_QUEUE_LIST,
  PRIVILEGE_TRIAGE_QUEUE_LIST,
} from './constants';
import PatientQueueHeader from './patient-queue-header/patient-queue-header.component';
import ClinicMetrics from './patient-queue-metrics/clinic-metrics.component';
import QueueLauncher from './queue-launcher/queue-launcher.component';

interface HomeProps {}

const Home: React.FC<HomeProps> = (props) => {
  const session = useSession();

  return (
    <div>
      <PatientQueueHeader />
      <UserHasAccess privilege={PRIVILEGE_RECEPTION_QUEUE_LIST}>
        <QueueLauncher />
      </UserHasAccess>
      <ClinicMetrics />
      <UserHasAccess privilege={PRIVILEGE_RECEPTION_QUEUE_LIST}>
        <ActiveVisitsReceptionTable />
      </UserHasAccess>
      <UserHasAccess privilege={PRIVILEGE_CLINICIAN_QUEUE_LIST}>
        <ActiveVisitsTabs />
      </UserHasAccess>
      <UserHasAccess privilege={PRIVILEGE_TRIAGE_QUEUE_LIST}>
        <ActiveVisitsTabs />
      </UserHasAccess>
    </div>
  );
};

export default Home;
