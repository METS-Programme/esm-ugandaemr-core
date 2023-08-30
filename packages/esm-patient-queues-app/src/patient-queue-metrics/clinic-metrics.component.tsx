import { UserHasAccess, useSession } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PRIVILEGE_RECEPTION_METRIC, PRIVILIGE_TRIAGE_METRIC } from '../constants';
import {
  useSelectedQueueLocationUuid,
  useSelectedQueueRoomLocationName,
  useSelectedQueueRoomLocationUuid,
} from '../helpers/helpers';
import { useQueueRoomLocations } from '../patient-search/hooks/useQueueRooms';
import {
  useActiveVisits,
  usePatientsBeingServed,
  usePatientsServed,
  useQueuePatients,
} from './clinic-metrics.resource';
import styles from './clinic-metrics.scss';
import MetricsCard from './metrics-card.component';
import { use } from 'i18next';

function ClinicMetrics() {
  const { t } = useTranslation();

  const session = useSession();
  const userLocation = session?.sessionLocation?.uuid;

  const { patientQueueCount, isLoading } = usePatientsBeingServed(userLocation, 'pending');

  const { servedCount } = usePatientsServed(userLocation, 'picked');

  // overall checked in patients stats

  // overall expected appointments

  // overall patients being served
  const { count } = useQueuePatients('picked');

  const { count: pendingCount } = useQueuePatients('pending');

  // receptionist ui
  return (
    <>
      <div className={styles.cardContainer}>
        <UserHasAccess privilege={PRIVILEGE_RECEPTION_METRIC}>
          <MetricsCard
            label={t('patients', 'Patients')}
            value={pendingCount ?? 0}
            headerLabel={t('checkedInPatients', 'Checked in patients')}
          />
          <MetricsCard
            label={t('expectedAppointments', 'Expected Appointments')}
            value={0}
            headerLabel={t('noOfExpectedAppointments', 'No. Of Expected Appointments')}
          />
          <MetricsCard
            label={t('serving', 'Serving')}
            value={count ?? 0}
            headerLabel={t('currentlyServing', 'No. of Currently being Served')}
          />
        </UserHasAccess>

        <UserHasAccess privilege={PRIVILIGE_TRIAGE_METRIC}>
          <MetricsCard
            label={t('pendingServing', 'Patients waiting to be Served')}
            value={patientQueueCount ?? 0}
            headerLabel={t('pendingTriageServing', 'Patients waiting to be Served')}
          />
          <MetricsCard
            label={t('served', 'Patients Served')}
            value={servedCount ?? 0}
            headerLabel={t('noOfPatientsServed', 'No. Of Patients Served')}
          />
        </UserHasAccess>
      </div>
    </>
  );
}

export default ClinicMetrics;
