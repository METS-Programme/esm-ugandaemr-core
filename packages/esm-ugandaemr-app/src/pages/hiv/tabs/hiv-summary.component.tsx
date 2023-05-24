import React from 'react';
import { EmptyStateComingSoon } from '@ohri/openmrs-esm-ohri-commons-lib/src/index';
import { useTranslation } from 'react-i18next';
import { PatientChartProps } from '../../../types';

const ARTSummary: React.FC<PatientChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t('artSummary', 'ART Summary');

  return <EmptyStateComingSoon headerTitle={headerTitle} displayText={headerTitle} />;
};

export default ARTSummary;
