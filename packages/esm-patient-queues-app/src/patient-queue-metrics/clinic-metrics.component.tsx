import { UserHasAccess, useSession } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PRIVILEGE_RECEPTION_METRIC, PRIVILIGE_TRIAGE_METRIC } from '../constants';

import { useAppointmentList, usePatientsServed, useServicePointCount } from './clinic-metrics.resource';
import styles from './clinic-metrics.scss';
import MetricsCard from './metrics-card.component';
import { useParentLocation } from '../active-visits/patient-queues.resource';
import { usePatientQueuesList } from '../active-visit-patient-reception/active-visits-reception.resource';

function ClinicMetrics() {
  const { t } = useTranslation();
  const session = useSession();
  const { location } = useParentLocation(session?.sessionLocation?.uuid);
  const { servedCount } = usePatientsServed(session?.sessionLocation?.uuid, 'picked');
  const { patientQueueCount: pendingCount } = usePatientQueuesList(location?.parentLocation?.uuid);
  const { appointmentList } = useAppointmentList('Scheduled');

  const { stats: patientStats } = useServicePointCount(location?.parentLocation?.uuid, new Date(), new Date());

  const getMetrics = (locationTag) => {
    const stats = patientStats?.find((item) => item.locationTag?.display === locationTag) || {
      pending: 0,
      serving: 0,
      completed: 0,
    };
    return {
      label: locationTag,
      value: stats.serving + stats.completed + stats.pending,
      status: [
        { status: 'Pending', value: stats.pending, color: 'orange' },
        { status: 'Serving', value: stats.serving, color: 'green' },
        { status: 'Completed', value: stats.completed, color: 'blue' },
      ],
    };
  };

  const triage = getMetrics('Triage');
  const clinicalRoom = getMetrics('Clinical Room');
  const laboratory = getMetrics('Laboratory');
  const radiology = getMetrics('Radiology');
  const pharmacy = getMetrics('Main Pharmacy');

  return (
    <div className={styles.cardContainer}>
      <UserHasAccess privilege={PRIVILEGE_RECEPTION_METRIC}>
        <MetricsCard
          values={[{ label: 'Patients', value: pendingCount }]}
          headerLabel={t('checkedInPatients', 'Checked in patients')}
        />
        <MetricsCard
          values={[{ label: 'Expected Appointments', value: appointmentList?.length }]}
          headerLabel={t('noOfExpectedAppointments', 'No. Of Expected Appointments')}
        />
        <MetricsCard
          values={[triage, clinicalRoom, laboratory, radiology, pharmacy]}
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
