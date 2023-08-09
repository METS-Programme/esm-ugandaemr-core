import { EmptyStateComingSoon } from '@ohri/openmrs-esm-ohri-commons-lib';
import React from 'react';
import { useTranslation } from 'react-i18next';

const MedicationsHome = () => {
  const { t } = useTranslation();
  const headerTitle = t('mediationsHome', 'Medications Home');

  return <EmptyStateComingSoon headerTitle={headerTitle} displayText={headerTitle} />;
};

export default MedicationsHome;
