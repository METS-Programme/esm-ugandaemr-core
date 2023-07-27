import { UserHasAccess } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PRIVILEGE_RECEPTION_METRIC, PRIVILIGE_TRIAGE_METRIC } from '../constants';
import { useActiveVisits } from './clinic-metrics.resource';
import styles from './clinic-metrics.scss';
import MetricsCard from './metrics-card.component';

function ClinicMetrics() {
  const { t } = useTranslation();

  const { activeVisitsCount, isLoading: loading } = useActiveVisits();
  // receptionist ui
  return (
    <>
      <div className={styles.cardContainer}>
        <UserHasAccess privilege={PRIVILEGE_RECEPTION_METRIC}>
          <MetricsCard
            label={t('patients', 'Patients')}
            value={loading ? '--' : activeVisitsCount}
            headerLabel={t('checkedInPatients', 'Checked in patients')}
            service="scheduled"
          />
          <MetricsCard
            label={t('expectedAppointments', 'Expected Appointments')}
            value={0}
            headerLabel={t('noOfExpectedAppointments', 'No. Of Expected Appointments')}
          />
          <MetricsCard
            label={t('serving', 'Serving')}
            value={0}
            headerLabel={t('currentlyServing', 'No. of Currently being Served')}
          />
        </UserHasAccess>

        <UserHasAccess privilege={PRIVILIGE_TRIAGE_METRIC}>
          <MetricsCard
            label={t('served', 'Patients Served')}
            value={0}
            headerLabel={t('noOfPatientsServed', 'No. Of Patients Served')}
          />
          <MetricsCard
            label={t('pendingServing', 'Patients waiting to be Served')}
            value={0}
            headerLabel={t('pendingTriageServing', 'Patients waiting to be Served')}
          />
          <MetricsCard label={t('workloads', 'Workloads')} value={'--'} headerLabel={t('workLoad', 'Workload')} />
        </UserHasAccess>
      </div>
    </>
  );
}

export default ClinicMetrics;
