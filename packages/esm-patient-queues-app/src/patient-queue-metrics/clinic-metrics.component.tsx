import { Dropdown } from '@carbon/react';
import { useSession, userHasAccess } from '@openmrs/esm-framework';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVisitQueueEntries } from '../active-visits/active-visits-table.resource';
import { RECEPTION_METRIC, TRIAGE_METRIC } from '../constants';
import {
  updateSelectedQueueRoomLocationName,
  updateSelectedQueueRoomLocationUuid,
  useSelectedQueueRoomLocationName,
  useSelectedQueueRoomLocationUuid,
} from '../helpers/helpers';
import { useQueueRoomLocations } from '../patient-search/hooks/useQueueRooms';
import { useActiveVisits, useAverageWaitTime } from './clinic-metrics.resource';
import styles from './clinic-metrics.scss';
import MetricsCard from './metrics-card.component';

export interface Service {
  uuid: string;
  display: string;
}

function ClinicMetrics() {
  const { t } = useTranslation();
  const userSession = useSession();

  // queue rooms
  const { queueRoomLocations } = useQueueRoomLocations(userSession?.sessionLocation?.uuid);
  const currentQueueRoomLocationName = useSelectedQueueRoomLocationName();
  const currentQueueRoomLocationUuid = useSelectedQueueRoomLocationUuid();

  const [initialSelectedItem, setInitialSelectItem] = useState(() => {
    if (currentQueueRoomLocationName && currentQueueRoomLocationUuid) {
      return false;
    } else if (currentQueueRoomLocationName === t('all', 'All')) {
      return true;
    } else {
      return true;
    }
  });
  const { visitQueueEntriesCount } = useVisitQueueEntries(currentQueueRoomLocationName, currentQueueRoomLocationUuid);
  const { activeVisitsCount, isLoading: loading } = useActiveVisits();
  const { waitTime } = useAverageWaitTime(currentQueueRoomLocationUuid, '');

  const handleQueueLocationChange = ({ selectedItem }) => {
    updateSelectedQueueRoomLocationUuid(selectedItem.uuid);
    updateSelectedQueueRoomLocationName(selectedItem.name);
    if (selectedItem.uuid == undefined) {
      setInitialSelectItem(true);
    } else {
      setInitialSelectItem(false);
    }
  };

  // receptionist ui

  return (
    <>
      <div className={styles.cardContainer}>
        {userHasAccess(RECEPTION_METRIC, userSession.user) && (
          <MetricsCard
            label={t('expectedAppointments', 'Expected Appointments')}
            value={0}
            headerLabel={t('noOfExpectedAppointments', 'No. Of Expected Appointments')}
          />
        )}
        {userHasAccess(RECEPTION_METRIC, userSession.user) && (
          <MetricsCard
            label={t('serving', 'Serving')}
            value={0}
            headerLabel={t('currentlyServing', 'No. of Currently being Served')}
          />
        )}
        {userHasAccess(TRIAGE_METRIC, userSession.user) && (
          <MetricsCard
            label={t('served', 'Patients Served')}
            value={0}
            headerLabel={t('noOfPatientsServed', 'No. Of Patients Served')}
          />
        )}
        {userHasAccess(TRIAGE_METRIC, userSession.user) && (
          <MetricsCard
            label={t('pendingServing', 'Patients waiting to be Served')}
            value={0}
            headerLabel={t('pendingTriageServing', 'Patients waiting to be Served')}
          />
        )}
        <MetricsCard
          label={t('patients', 'Patients')}
          value={loading ? '--' : activeVisitsCount}
          headerLabel={t('checkedInPatients', 'Checked in patients')}
          service="scheduled"
        />
        <MetricsCard
          label={t('patients', 'Patients')}
          value={initialSelectedItem ? visitQueueEntriesCount : 0}
          headerLabel={`${t('waitingFor', 'Waiting for')}:`}
          locationUuid={currentQueueRoomLocationUuid}
        >
          <Dropdown
            id="locationFilter"
            label={currentQueueRoomLocationName ?? queueRoomLocations?.[0]?.display}
            items={[...queueRoomLocations]}
            itemToString={(item) => (item ? item.display : '')}
            type="inline"
            onChange={handleQueueLocationChange}
          />
        </MetricsCard>
        <MetricsCard
          label={t('minutes', 'Minutes')}
          value={waitTime ? waitTime.averageWaitTime : '--'}
          headerLabel={t('averageWaitTime', 'Average wait time today')}
          service="waitTime"
        />
        <MetricsCard label={t('workloads', 'Workloads')} value={'--'} headerLabel={t('workLoad', 'Workload')} />
      </div>
    </>
  );
}

export default ClinicMetrics;
