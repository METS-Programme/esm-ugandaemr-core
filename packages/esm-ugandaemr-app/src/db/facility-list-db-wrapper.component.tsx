import React from 'react';

import { ExtensionSlot } from '@openmrs/esm-framework';

export function FacilityListDashboardWrapper() {
  return (
    <ExtensionSlot name="facility-list-db-wrapper" state={{ programme: 'facility-landing-page', dashboardTitle: 'Facility Home' }} />
  );
}


