import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './root.scss';
import { RadiologyHeader } from './header/radiology-header.component';
import RadiologySummaryTiles from './summary-tiles/radiology-summary-tiles.component';
import RadiologyQueueList from './queue-list/radiology-queue.component';

const Radiology: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={`omrs-main-content`}>
      <RadiologyHeader />
      <RadiologySummaryTiles />
      <RadiologyQueueList />
    </div>
  );
};

export default Radiology;
