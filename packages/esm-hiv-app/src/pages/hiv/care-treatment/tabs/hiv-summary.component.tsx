import React from 'react';
import { EmptyStateComingSoon } from '@ugandaemr/esm-ugandaemr-commons-lib/src/index';
import { useTranslation } from 'react-i18next';
import { PatientChartProps } from '../../../../types';

const HIVSummary: React.FC<PatientChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t('hivsummary', 'HIV Summary');

  return <EmptyStateComingSoon headerTitle={headerTitle} displayText={headerTitle} />;
};

export default HIVSummary;
