import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurableLink } from '@openmrs/esm-framework';

export default function TheatreAppMenuLink() {
  const { t } = useTranslation();
  return <ConfigurableLink to="${openmrsSpaBase}/theatre">{t('theatre', 'Theatre')}</ConfigurableLink>;
}
