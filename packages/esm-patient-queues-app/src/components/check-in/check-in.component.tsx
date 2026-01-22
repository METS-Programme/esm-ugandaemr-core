import React from 'react';
import { Button } from '@carbon/react';
import styles from './check-in.scss';
import { launchStartVisitForm } from '../../active-visits/patient-queues.resource';

const CheckInLauncher: React.FC = () => {
  
  return (
    <div className={styles.launcherContainer}>
      <Button
        kind="primary"
        iconDescription="Check in"
        onClick={() => {
          launchStartVisitForm();
        }}
      >
        Check In
      </Button>
    </div>
  );
};

export default CheckInLauncher;
