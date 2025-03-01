import React from 'react';
import { useTranslation } from 'react-i18next';
import SummaryTile from '../summary-tiles/summary-tile.component';
import { usePatientQueuePages } from '../active-visits/patient-queues.resource';
import { useSession } from '@openmrs/esm-framework';
import { QueueEnumStatus, QueueStatus } from '../utils/utils';

const QueueCompletedTile: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();

  const { items } = usePatientQueuePages(session.sessionLocation.uuid, '');

  return (
    <SummaryTile
      label={t('noOfPatientsServed', 'No. of Patients Served')}
      value={items.filter((item) => item.status === QueueEnumStatus.COMPLETED).length}
      headerLabel={t('finished', 'Finished')}
    />
  );
};

export default QueueCompletedTile;
