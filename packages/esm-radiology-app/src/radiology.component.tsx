import React from 'react';
import { useTranslation } from 'react-i18next';
import { RadiologyHeader } from './header/radiology-header.component';
import RadiologyQueueList from './queue-list/radiology-queue.component';
import RadiologySummaryTiles from './summary-tiles/radiology-summary-tiles.component';

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
