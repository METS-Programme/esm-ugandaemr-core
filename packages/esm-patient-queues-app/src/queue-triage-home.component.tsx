import React from 'react';

import PatientQueueHeader from './components/patient-queue-header/patient-queue-header.component';
import MetricsCard from './components/patient-queue-metrics/metrics-card.component';
import { useTranslation } from 'react-i18next';
import { useSession } from '@openmrs/esm-framework';
import styles from './patient-queue-metrics/clinic-metrics.scss';

import { useParentLocation } from './active-visits/patient-queues.resource';
import { usePatientQueuesList } from './active-visits/active-visits-patients-reception/active-visits-reception.resource';
import { usePatientsBeingServed, usePatientsServed } from './components/patient-queue-metrics/clinic-metrics.resource';
import ActiveTriageVisitsTabs from './active-visits/active-visits-triage-tab.component';

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
      </div>
      <ActiveTriageVisitsTabs />
    </div>
  );
};

export default TriageHome;
