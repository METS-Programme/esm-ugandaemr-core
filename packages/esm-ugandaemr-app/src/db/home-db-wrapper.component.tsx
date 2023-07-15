import React from 'react';

import { ExtensionSlot } from '@openmrs/esm-framework';

export function HomeDashboardWrapper() {
  return (
    <ExtensionSlot name="home-db-wrapper" state={{ programme: 'home-landing-page', dashboardTitle: 'General Home' }} />
  );
}
