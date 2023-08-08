import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import ActiveVisitsList from './active-visits/home-active-visits.component';

function HomeVisitTabs() {
  const { t } = useTranslation();
  const [showOverlay, setShowOverlay] = useState(false);
  const [view, setView] = useState('');
  const [viewState, setViewState] = useState<{ selectedPatientUuid: string }>(null);
  const [overlayHeader, setOverlayTitle] = useState('');

  return <div></div>;
}

export default HomeVisitTabs;
