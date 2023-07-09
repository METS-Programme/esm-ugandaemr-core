import { Group, InProgress } from '@carbon/react/icons';
import React from 'react';

function StatusIcon({ status }) {
  switch (status) {
    case 'pending':
      return <InProgress size={16} />;
    case 'picked':
      return <Group size={16} />;
    case 'completed':
      return <Group size={16} />;
    default:
      return null;
  }
}

export default StatusIcon;
