import React from 'react';
import { EmptyStateComingSoon } from '@ohri/openmrs-esm-ohri-commons-lib/src/index';
import { useTranslation } from 'react-i18next';

export interface HivScreeningProps {
  patientUuid: string;
}

const HIVScreening: React.FC<HivScreeningProps> = ({ patientUuid }) => {
  const headerTitle = 'HIV Screening';

  return <EmptyStateComingSoon headerTitle={headerTitle} displayText={headerTitle} />;
};

export default HIVScreening;
