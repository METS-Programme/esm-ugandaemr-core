import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurableLink } from '@openmrs/esm-framework';

export default function RadiologyAppMenuLink() {
  const { t } = useTranslation();
  return <ConfigurableLink to="${openmrsSpaBase}/radiology">{t('radiology', 'Radiology')}</ConfigurableLink>;
}
