import React from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@openmrs/esm-patient-common-lib';

const RegimenHistory: React.FC = () => {
  const { t } = useTranslation();

  return <EmptyState displayText={'Regimen History'} headerTitle={'Regimen History'} />;
};

export default RegimenHistory;
