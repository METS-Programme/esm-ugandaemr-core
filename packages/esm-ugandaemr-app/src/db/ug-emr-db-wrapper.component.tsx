import React from 'react';

import { ExtensionSlot } from '@openmrs/esm-framework';

export function DashboardWrapper() {
  return (
    <ExtensionSlot name="ug-emr-db-wrapper" state={{ programme: 'landing-page', dashboardTitle: 'General Home' }} />
  );
}
