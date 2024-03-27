import React from 'react';

import PatientQueueHeader from './patient-queue-header/patient-queue-header.component';
import MetricsCard from './patient-queue-metrics/metrics-card.component';
import { useTranslation } from 'react-i18next';
import { UserHasAccess, useSession, userHasAccess } from '@openmrs/esm-framework';
import styles from './patient-queue-metrics/clinic-metrics.scss';

import { useParentLocation } from './active-visits/patient-queues.resource';
import { usePatientQueuesList } from './active-visit-patient-reception/active-visits-reception.resource';
import { usePatientsBeingServed, usePatientsServed } from './patient-queue-metrics/clinic-metrics.resource';
import ActiveVisitsTabs from './active-visits/active-visits-tab.component';
import { PRIVILEGE_TRIAGE_QUEUE_LIST, PRIVILIGE_TRIAGE_METRIC } from './constants';

const TriageHome: React.FC = () => {
  const { t } = useTranslation();

  const session = useSession();

  const { location } = useParentLocation(session?.sessionLocation?.uuid);
  const { servedCount } = usePatientsServed(session?.sessionLocation?.uuid, 'picked');
  const { patientQueueCount: pendingCount } = usePatientQueuesList(location?.parentLocation?.uuid);
  const { patientQueueCount } = usePatientsBeingServed(
    session?.sessionLocation?.uuid,
    'pending',
    session?.user?.person?.display,
  );

  return (
    <div>
      <PatientQueueHeader title="Triage" />
      <div className={styles.cardContainer}>
        <UserHasAccess privilege={PRIVILIGE_TRIAGE_METRIC}>
          <MetricsCard
            values={[{ label: 'In Queue', value: pendingCount }]}
            headerLabel={t('inQueueTriage', 'Patients Waiting')}
          />
          <MetricsCard
            values={[{ label: t('byTriage', 'By you'), value: patientQueueCount }]}
            headerLabel={t('pendingTriageServing', 'Patients waiting to be Served')}
          />
          <MetricsCard
            values={[{ label: 'Patients Served', value: servedCount }]}
            headerLabel={t('noOfPatientsServed', 'No. of Patients Served')}
          />
        </UserHasAccess>
      </div>

      {session?.user && userHasAccess(PRIVILEGE_TRIAGE_QUEUE_LIST, session.user) && <ActiveVisitsTabs />}
    </div>
  );
};

export default TriageHome;
