import { UserHasAccess, useSession } from '@openmrs/esm-framework';
import React, { useState } from 'react';
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
  useAppointmentList,
  usePatientsBeingServed,
  usePatientsServed,
  useQueuePatients,
  useServicePointCount,
} from './clinic-metrics.resource';
import styles from './clinic-metrics.scss';
import MetricsCard from './metrics-card.component';
import { useParentLocation } from '../active-visits/patient-queues.resource';
import { usePatientQueuesList } from '../active-visit-patient-reception/active-visits-reception.resource';

function ClinicMetrics() {
  const { t } = useTranslation();

  const session = useSession();
  const creatorUuid = session?.user?.person?.display;

  const { location: locations, isLoading: loading } = useParentLocation(session?.sessionLocation?.uuid);

  const { patientQueueCount, isLoading } = usePatientsBeingServed(
    session?.sessionLocation?.uuid,
    'pending',
    creatorUuid,
  );

  const { servedCount } = usePatientsServed(session?.sessionLocation?.uuid, 'picked');

  const { patientQueueCount: pendingCount } = usePatientQueuesList(locations?.parentLocation?.uuid);

  const { appointmentList, isLoading: loadingExpectedAppointments } = useAppointmentList('Scheduled');

  const { location: childLocations, isLoading: loadingChildLocations } = useParentLocation(
    locations?.parentLocation?.uuid,
  );

  let rooms = [];
  childLocations?.childLocations.map((location) => {
    return rooms.push({
      label: location?.display,
      value: 0,
    });
  });

  const { stats: patientStats } = useServicePointCount(locations?.parentLocation?.uuid, '', '');

  // receptionist ui
  return (
    <>
      <div className={styles.cardContainer}>
        <UserHasAccess privilege={PRIVILEGE_RECEPTION_METRIC}>
          <MetricsCard
            values={[{ label: 'Patients', value: pendingCount }]}
            headerLabel={t('checkedInPatients', 'Checked in patients')}
          />
          <MetricsCard
            values={[{ label: 'Expected Appointments', value: appointmentList?.length }]}
            headerLabel={t('noOfExpectedAppointments', 'No. of Expected Appointments')}
          />
          <MetricsCard
            values={[
              { label: 'Triage', value: patientStats.find((item) => item.locationTag.display === 'Triage').serving },
              {
                label: 'Clinical Room',
                value: patientStats.find((item) => item.locationTag.display === 'Clinical Room').serving,
              },
              {
                label: 'Laboratory',
                value: patientStats.find((item) => item.locationTag.display === 'Triage').serving,
              },
              {
                label: 'Radiology',
                value: patientStats.find((item) => item.locationTag.display === 'Radiology').serving,
              },
              {
                label: 'Pharmacy',
                value: patientStats.find((item) => item.locationTag.display === 'Main Pharmacy').serving,
              },
            ]}
            headerLabel={t('currentlyServing', 'No. of Currently being Served')}
          />
        </UserHasAccess>

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
    </>
  );
}

export default ClinicMetrics;
