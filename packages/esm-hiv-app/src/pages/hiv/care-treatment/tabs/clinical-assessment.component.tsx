import React from 'react';
import { EmptyStateComingSoon } from '@ugandaemr/esm-ugandaemr-commons-lib/src/index';
import { useTranslation } from 'react-i18next';
import { PatientChartProps } from '../../../../types';

const ClinicalAssessment: React.FC<PatientChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t('clinicalAssessment', 'Clinical Assessment');

  return <EmptyStateComingSoon headerTitle={headerTitle} displayText={headerTitle} />;
};

export default ClinicalAssessment;
