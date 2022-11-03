import React from 'react';
import { EmptyStateComingSoon } from '@ohri/openmrs-esm-ohri-commons-lib';
import { useTranslation } from 'react-i18next';
import { PatientChartProps } from '../../types';

const Opd: React.FC<PatientChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const pageTitle = t('opd', 'OutPatient Department');

  return <EmptyStateComingSoon headerTitle={pageTitle} displayText={pageTitle} />;
};

export default Opd;
