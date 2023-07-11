import { Button } from '@carbon/react';
import { ShoppingCart } from '@carbon/react/icons';
import { useLayoutType } from '@openmrs/esm-framework';
import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './active-queue-patients-wsp.scss';

const ActiveQueuePatientsActionButton: React.FC = () => {
  const layout = useLayoutType();
  const { t } = useTranslation();

  const handleClick = useCallback(() => launchPatientWorkspace('active-queue-patients'), []);

  if (layout === 'tablet') {
    return (
      <Button
        kind="ghost"
        className={`${styles.container}`}
        role="button"
        tabIndex={0}
        iconDescription={t('activeQueuePatients', 'Active Queue Patients')}
        onClick={handleClick}
      ></Button>
    );
  }

  return (
    <Button
      className={styles.container}
      kind="ghost"
      size="sm"
      renderIcon={(props) => (
        <div className={styles.elementContainer}>
          <ShoppingCart size={20} {...props} />{' '}
        </div>
      )}
      hasIconOnly
      iconDescription={t('activeQueuePatients', 'Active Queue Patients')}
      enterDelayMs={1000}
      tooltipAlignment="center"
      tooltipPosition="left"
      onClick={handleClick}
    />
  );
};

export default ActiveQueuePatientsActionButton;
