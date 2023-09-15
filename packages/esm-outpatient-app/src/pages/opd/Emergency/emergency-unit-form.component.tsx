import React from 'react';
import { EmptyStateComingSoon, PatientChartProps } from '@ohri/openmrs-esm-ohri-commons-lib/src/index';
import { useTranslation } from 'react-i18next';

const EmergencyUnit: React.FC<PatientChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t('emergency');

  return <EmptyStateComingSoon headerTitle={headerTitle} displayText={headerTitle} />;
};

export default EmergencyUnit;
