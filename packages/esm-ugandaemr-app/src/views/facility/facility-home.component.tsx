import React from 'react';
import { useTranslation } from 'react-i18next';

const FacilityHome = () => {
  const { t } = useTranslation();
  const headerTitle = t('facilityDashboard', 'Facility Dashboard');

  return <span>Comming soon ..</span>;
};

export default FacilityHome;
