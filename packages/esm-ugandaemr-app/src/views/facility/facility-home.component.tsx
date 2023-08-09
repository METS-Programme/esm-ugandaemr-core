import { EmptyStateComingSoon } from '@ohri/openmrs-esm-ohri-commons-lib';
import React from 'react';
import { useTranslation } from 'react-i18next';

const FacilityHome = () => {
  const { t } = useTranslation();
  const headerTitle = t('facilityDashboard', 'Facility Dashboard');

  return <EmptyStateComingSoon headerTitle={headerTitle} displayText={headerTitle} />;
};

export default FacilityHome;
