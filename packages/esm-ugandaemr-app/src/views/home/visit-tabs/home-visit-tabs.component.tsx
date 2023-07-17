import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import ActiveVisitsList from './active-visits/home-active-visits.component';
import FacilitiesList from '../../facilities/facility-list/ug-emr-facilities.component';
import styles from '../visit-tabs/active-visits/home-active-visits.scss';

function HomeVisitTabs() {
  const { t } = useTranslation();
  const [showOverlay, setShowOverlay] = useState(false);
  const [view, setView] = useState('');
  const [viewState, setViewState] = useState<{ selectedPatientUuid: string }>(null);
  const [overlayHeader, setOverlayTitle] = useState('');

  return (
    <div className={styles.container}>
      <FacilitiesList />
    </div>
  );
}

export default HomeVisitTabs;
