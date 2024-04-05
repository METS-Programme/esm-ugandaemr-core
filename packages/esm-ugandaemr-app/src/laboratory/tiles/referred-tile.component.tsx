import React from 'react';
import { useTranslation } from 'react-i18next';
import SummaryTile from './summary-tile.component';

const ReferredTile = () => {
  const { t } = useTranslation();

  return (
    <SummaryTile
      label={t('transferred', 'Transferred')}
      value={0}
      headerLabel={t('referredTests', 'Ex-Referred tests')}
    />
  );
};

export default ReferredTile;
