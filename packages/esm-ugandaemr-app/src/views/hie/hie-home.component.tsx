import { EmptyStateComingSoon } from '@ohri/openmrs-esm-ohri-commons-lib';
import React from 'react';
import { useTranslation } from 'react-i18next';

const HieHome = () => {
  const { t } = useTranslation();
  const headerTitle = t('hieHome', 'HIE Home');

  return <EmptyStateComingSoon headerTitle={headerTitle} displayText={headerTitle} />;
};

export default HieHome;
