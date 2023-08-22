import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './root.scss';

const Root: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h3 className={styles.welcome}>{t('welcomeText', 'Welcome to Laboratory')}</h3>
    </div>
  );
};

export default Root;
