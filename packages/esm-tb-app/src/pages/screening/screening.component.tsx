import React from 'react';
import { EmptyStateComingSoon } from '@ohri/openmrs-esm-ohri-commons-lib/src/index';
import { useTranslation } from 'react-i18next';

export interface PatientChartProps {
  patientUuid: string;
}

const TBScreening: React.FC<PatientChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t('tbscreening', 'Screening');

  return <EmptyStateComingSoon headerTitle={headerTitle} displayText={headerTitle} />;
};

export default TBScreening;
