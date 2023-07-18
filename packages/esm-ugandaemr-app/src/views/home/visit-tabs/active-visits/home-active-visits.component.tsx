import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useLayoutType,
  navigate,
  interpolateUrl,
  isDesktop,
  ExtensionSlot,
  usePagination,
  useConfig,
  ConfigObject,
} from '@openmrs/esm-framework';
import styles from './home-active-visits.scss';

const ActiveVisitsList: React.FC = () => {
  const { t } = useTranslation();

  return <div className={styles.container}></div>;
};

export default ActiveVisitsList;
