import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurableLink } from '@openmrs/esm-framework';

export default function SystemInfoMenuLink() {
  const { t } = useTranslation();
  return <ConfigurableLink to="${openmrsSpaBase}/about">{t('systemInfo', 'System Info')}</ConfigurableLink>;
}
