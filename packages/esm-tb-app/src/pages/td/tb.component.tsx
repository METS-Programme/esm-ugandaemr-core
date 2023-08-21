import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../common.scss';

const root: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h3 className={styles.welcome}>{t('welcomeText', 'Welcome to the O3 Template app')}</h3>
      <p className={styles.explainer}>
        {t('explainer', 'The following examples demonstrate some key features of the O3 framework')}.
      </p>
    </div>
  );
};

export default root;
