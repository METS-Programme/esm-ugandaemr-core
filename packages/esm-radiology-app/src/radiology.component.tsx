import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './root.scss';
import { RadiologyHeader } from './header/radiology-header.component';

const Radiology: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={`omrs-main-content`}>
      <RadiologyHeader />
    </div>
  );
};

export default Radiology;
