import { UserHasAccess, useSession, userHasAccess } from '@openmrs/esm-framework';
import React from 'react';
import ActiveVisitsReceptionTable from './active-visit-patient-reception/active-visits-reception-table.component';
import ActiveVisitsTabs from './active-visits/active-visits-tab.component';
import {
  PRIVILEGE_CLINICIAN_QUEUE_LIST,
  PRIVILEGE_RECEPTION_QUEUE_LIST,
  PRIVILEGE_TRIAGE_QUEUE_LIST,
} from './constants';
import ClinicMetrics from './patient-queue-metrics/clinic-metrics.component';
import QueueLauncher from './queue-launcher/queue-launcher.component';
import { useTranslation } from 'react-i18next';
import { HomeHeader } from '@ugandaemr/esm-ugandaemr-commons-lib/src/index';
import { Events } from '@carbon/react/icons';

interface HomeProps {}

const Home: React.FC<HomeProps> = (props) => {
  const session = useSession();
  const { t } = useTranslation();

  return (
    <div>
      <HomeHeader headerTitle={t('patientqueues', 'Patient queue')} icon={<Events size={16} />} />
      <UserHasAccess privilege={PRIVILEGE_RECEPTION_QUEUE_LIST}>
        <QueueLauncher />
      </UserHasAccess>
      <ClinicMetrics />
      {session?.user && userHasAccess(PRIVILEGE_RECEPTION_QUEUE_LIST, session.user) && <ActiveVisitsReceptionTable />}
      {session?.user && userHasAccess(PRIVILEGE_TRIAGE_QUEUE_LIST, session.user) && <ActiveVisitsTabs />}
      {session?.user && userHasAccess(PRIVILEGE_CLINICIAN_QUEUE_LIST, session.user) && <ActiveVisitsTabs />}
    </div>
  );
};

export default Home;
