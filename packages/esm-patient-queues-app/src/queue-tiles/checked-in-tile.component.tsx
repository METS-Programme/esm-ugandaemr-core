import React from 'react';
import SummaryTile from '../summary-tiles/summary-tile.component';
import { useTranslation } from 'react-i18next';
import { usePatientQueuePages } from '../active-visits/patient-queues.resource';

const CheckedInTile: React.FC = () => {
  const { t } = useTranslation();

  const { totalCount } = usePatientQueuePages('', '');

  return (
    <SummaryTile
      label={t('checkedInPatients', 'Checked In Patients')}
      value={totalCount}
      headerLabel={t('pending', 'Pending')}
    />
  );
};

export default CheckedInTile;
