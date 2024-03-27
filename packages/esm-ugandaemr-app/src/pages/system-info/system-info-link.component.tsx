import { ConfigurableLink } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SystemInfoMenuLink() {
  const { t } = useTranslation();
  return <ConfigurableLink to="${openmrsSpaBase}/about">{t('systemInfo', 'System Info')}</ConfigurableLink>;
}
