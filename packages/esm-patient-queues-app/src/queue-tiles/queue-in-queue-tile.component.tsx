import React from 'react';
import { useTranslation } from 'react-i18next';
import SummaryTile from '../summary-tiles/summary-tile.component';
import { useSession } from '@openmrs/esm-framework';
import { usePatientQueuePages } from '../active-visits/patient-queues.resource';
import { QueueEnumStatus } from '../utils/utils';
const QueueInQueueTile: React.FC = () => {
  const { t } = useTranslation();

  const session = useSession();

  const { items } = usePatientQueuePages(session.sessionLocation.uuid, '');

  return (
    <SummaryTile
      label={t('patientsWaitingToBeServed', 'Patients waiting to be Served')}
      value={items.filter((item) => item.status === (QueueEnumStatus.PICKED || QueueEnumStatus.PENDING)).length}
      headerLabel={t('byYou', 'By You')}
    />
  );
};

export default QueueInQueueTile;
