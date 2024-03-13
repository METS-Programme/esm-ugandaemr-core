import { UserHasAccess, useSession } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PRIVILEGE_RECEPTION_METRIC, PRIVILIGE_TRIAGE_METRIC } from '../constants';

import {
  useAppointmentList,
  usePatientsBeingServed,
  usePatientsServed,
  useServicePointCount,
} from './clinic-metrics.resource';
import styles from './clinic-metrics.scss';
import MetricsCard from './metrics-card.component';
import { useParentLocation } from '../active-visits/patient-queues.resource';
import { usePatientQueuesList } from '../active-visit-patient-reception/active-visits-reception.resource';
import { CheckmarkOutline, Pending, ProgressBarRound } from '@carbon/react/icons';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const ClinicMetrics: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();
  const { location } = useParentLocation(session?.sessionLocation?.uuid);
  const { servedCount } = usePatientsServed(session?.sessionLocation?.uuid, 'picked');
  const { patientQueueCount: pendingCount } = usePatientQueuesList(location?.parentLocation?.uuid);
  const { appointmentList } = useAppointmentList('Scheduled');
  const creatorUuid = session?.user?.person?.display;
  const { patientQueueCount } = usePatientsBeingServed(session?.sessionLocation?.uuid, 'pending', creatorUuid);

  const { stats } = useServicePointCount(location?.parentLocation?.uuid, new Date(), new Date());

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
        <MetricsCard values={stats} headerLabel={t('currentlyServing', 'No. of Currently being Served')} />
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
  );
};

export const getMetrics = (locationTag, patientStats) => {
  const stats = patientStats?.find((item) => item.locationTag?.display === locationTag) || {
    pending: 0,
    serving: 0,
    completed: 0,
  };
  return {
    label: locationTag,
    value: stats.serving + stats.completed + stats.pending,
    status: [
      {
        status: (
          <>
            <Pending data-tooltip-id="tooltip-pending" />
            <ReactTooltip id="tooltip-pending" place="right" content="Pending" variant="warning" />
          </>
        ),
        value: stats.pending,
        color: 'orange',
      },
      {
        status: (
          <>
            <ProgressBarRound data-tooltip-id="tooltip-serving" />
            <ReactTooltip id="tooltip-serving" place="right" content="Serving" variant="info" />
          </>
        ),
        value: stats.serving,
        color: 'blue',
      },
      {
        status: (
          <>
            <CheckmarkOutline data-tooltip-id="tooltip-completed" />
            <ReactTooltip id="tooltip-completed" place="right" content="Completed" variant="success" />
          </>
        ),
        value: stats.completed,
        color: 'green',
      },
    ],
  };
};

export default ClinicMetrics;
