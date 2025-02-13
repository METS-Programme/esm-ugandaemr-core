import React from 'react';
import PatientQueueHeader from './components/patient-queue-header/patient-queue-header.component';
import ActiveVisitsReceptionTable from './active-visits/active-visits-patients-reception/active-visits-reception-table.component';
import MetricsCard from './components/patient-queue-metrics/metrics-card.component';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import styles from "./components/patient-queue-metrics/clinic-metrics.scss"

import { useParentLocation } from './active-visits/patient-queues.resource';
import { usePatientQueuesList } from './active-visits/active-visits-patients-reception/active-visits-reception.resource';
import {  useServicePointCount } from './components/patient-queue-metrics/clinic-metrics.resource';
import { useSession } from '@openmrs/esm-framework';

const ReceptionHome: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();
  const { location } = useParentLocation(session?.sessionLocation?.uuid);
  const { patientQueueCount: pendingCount } = usePatientQueuesList(location?.parentLocation?.uuid);
  const { stats } = useServicePointCount(
    location?.parentLocation?.uuid,
    dayjs(new Date()).format('YYYY-MM-DD'),
    dayjs(new Date()).format('YYYY-MM-DD'),
  );

  return (
    <div>
      <PatientQueueHeader title="Reception" />
      <div className={styles.cardContainer}>
        <MetricsCard
          values={[{ label: 'Patients', value: pendingCount }]}
          headerLabel={t('checkedInPatients', 'Checked in patients')}
        />
        <MetricsCard
          values={[{ label: 'Expected Appointments', value: 0 }]}
          headerLabel={t('noOfExpectedAppointments', 'No. Of Expected Appointments')}
        />
        <MetricsCard values={stats} headerLabel={t('currentlyServing', 'No. of Currently being Served')} />
      </div>
      <ActiveVisitsReceptionTable />
    </div>
  );
};

export default ReceptionHome;
