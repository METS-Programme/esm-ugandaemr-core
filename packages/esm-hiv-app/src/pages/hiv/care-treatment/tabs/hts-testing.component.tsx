import React from 'react';
import { EmptyStateComingSoon } from '@ohri/openmrs-esm-ohri-commons-lib/src/index';
import { useTranslation } from 'react-i18next';

export interface hivTestingProps {
    patientUuid: string;
  }

const hivTesting: React.FC<hivTestingProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t('htstesting', 'HTS Testing');

  return <EmptyStateComingSoon headerTitle={headerTitle} displayText={headerTitle} />;
};

export default hivTesting;