import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurableLink } from '@openmrs/esm-framework';

export default function LaboratoryAppMenuLink() {
  const { t } = useTranslation();
  return <ConfigurableLink to="${openmrsSpaBase}/laboratory">{t('laboratory', 'Laboratory')}</ConfigurableLink>;
}
