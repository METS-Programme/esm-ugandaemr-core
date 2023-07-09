import { DefaultWorkspaceProps } from '@openmrs/esm-patient-common-lib';
import React from 'react';
import ActiveQueuePatients from '../../../esm-patient-queues-app/src/active-visits/active-visits-table.component';

export default function ActiveQueuePatientsWorkSpace({}: DefaultWorkspaceProps) {
  return <ActiveQueuePatients />;
}
