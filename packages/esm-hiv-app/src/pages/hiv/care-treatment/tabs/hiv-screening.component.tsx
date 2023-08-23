import React from 'react';
import { EmptyStateComingSoon } from '@ohri/openmrs-esm-ohri-commons-lib/src/index';
import { useTranslation } from 'react-i18next';

export interface hivScreeningProps {
    patientUuid: string;
  }

const HivScreening: React.FC<hivScreeningProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t('hivscreening', 'HIV Screening');

  return <EmptyStateComingSoon headerTitle={headerTitle} displayText={headerTitle} />;
};

export default HivScreening;