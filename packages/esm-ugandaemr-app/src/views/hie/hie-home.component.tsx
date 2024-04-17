import React from 'react';
import { useTranslation } from 'react-i18next';

const HieHome = () => {
  const { t } = useTranslation();
  const headerTitle = t('hieHome', 'HIE Home');

  return <span>Comming soon</span>;
};

export default HieHome;
