import { Button } from '@carbon/react';
import { UserMultiple } from '@carbon/react/icons';
import { useLayoutType } from '@openmrs/esm-framework';
import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './queue-patients-wsp.scss';

const QueuePatientsActionButton: React.FC = () => {
  const layout = useLayoutType();
  const { t } = useTranslation();

  const handleClick = useCallback(() => launchPatientWorkspace('queue-patients-workspace'), []);

  if (layout === 'tablet') {
    return (
      <Button
        kind="ghost"
        className={`${styles.container}`}
        role="button"
        tabIndex={0}
        iconDescription={t('activeQueuePatients', 'Active Queue Patients')}
        onClick={handleClick}
      />
    );
  }

  return (
    <Button
      className={styles.container}
      kind="ghost"
      size="sm"
      renderIcon={(props) => (
        <div className={styles.elementContainer}>
          <UserMultiple size={20} {...props} />{' '}
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

export default QueuePatientsActionButton;
