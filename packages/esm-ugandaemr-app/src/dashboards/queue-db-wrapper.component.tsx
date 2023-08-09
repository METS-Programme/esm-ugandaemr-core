import React from 'react';

import { ExtensionSlot } from '@openmrs/esm-framework';

export function QueueDashboardWrapper() {
  return (
    <ExtensionSlot name="queue-db-wrapper" state={{ programme: 'queue-landing-page', dashboardTitle: 'Queue Home' }} />
  );
}
