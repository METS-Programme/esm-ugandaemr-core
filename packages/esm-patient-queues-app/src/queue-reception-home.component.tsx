import React from 'react';
import PatientQueueHeader from './patient-queue-header/patient-queue-header.component';
import ActiveVisitsReceptionTable from './active-visit-patient-reception/active-visits-reception-table.component';
import MetricsCard from './patient-queue-metrics/metrics-card.component';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import styles from './patient-queue-metrics/clinic-metrics.scss';

import { useParentLocation } from './active-visits/patient-queues.resource';
import { usePatientQueuesList } from './active-visit-patient-reception/active-visits-reception.resource';
import { useAppointmentList, useServicePointCount } from './patient-queue-metrics/clinic-metrics.resource';
import { UserHasAccess, useSession } from '@openmrs/esm-framework';
import QueueLauncher from './queue-launcher/queue-launcher.component';
import { PRIVILEGE_RECEPTION_QUEUE_LIST } from './constants';

const ReceptionHome: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();
  const { location } = useParentLocation(session?.sessionLocation?.uuid);
  const { patientQueueCount: pendingCount } = usePatientQueuesList(location?.parentLocation?.uuid);
  const { appointmentList } = useAppointmentList('Scheduled');
  const { stats } = useServicePointCount(
    location?.parentLocation?.uuid,
    dayjs(new Date()).format('YYYY-MM-DD'),
    dayjs(new Date()).format('YYYY-MM-DD'),
  );

  return (
    <div>
      <PatientQueueHeader title="Reception" />
      <UserHasAccess privilege={PRIVILEGE_RECEPTION_QUEUE_LIST}>
        <QueueLauncher />
      </UserHasAccess>
      <div className={styles.cardContainer}>
        <MetricsCard
          values={[{ label: 'Patients', value: pendingCount }]}
          headerLabel={t('checkedInPatients', 'Checked in patients')}
        />
        <MetricsCard
          values={[{ label: 'Expected Appointments', value: appointmentList?.length }]}
          headerLabel={t('noOfExpectedAppointments', 'No. Of Expected Appointments')}
        />
        <MetricsCard values={stats} headerLabel={t('currentlyServing', 'No. of Currently being Served')} />
      </div>

      <ActiveVisitsReceptionTable />
    </div>
  );
};

export default ReceptionHome;
