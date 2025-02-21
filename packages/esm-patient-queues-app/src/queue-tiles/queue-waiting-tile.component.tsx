import React from 'react';
import { useTranslation } from 'react-i18next';
import SummaryTile from '../summary-tiles/summary-tile.component';
import { useSession } from '@openmrs/esm-framework';
import { usePatientQueuePages } from '../active-visits/patient-queues.resource';
import { QueueEnumStatus } from '../utils/utils';
const QueueWaitingTile: React.FC = () => {
  const { t } = useTranslation();

  const session = useSession();

  const { items } = usePatientQueuePages(session.sessionLocation.uuid, '');

  return (
    <SummaryTile
      label={t('patientsWaiting', 'Patients Waiting')}
      value={items.filter((item) => item.status === QueueEnumStatus.PENDING).length}
      headerLabel={t('inQueue', 'In Queue')}
    />
  );
};

export default QueueWaitingTile;
