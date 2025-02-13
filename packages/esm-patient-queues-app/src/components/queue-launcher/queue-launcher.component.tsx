import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './queue-launcher.scss';
import { Button } from '@carbon/react';
import { MessageQueue } from '@carbon/react/icons';
import { navigate } from '@openmrs/esm-framework';
import { spaBasePath } from '../../constants';

const QueueLauncher: React.FC = () => {
  const { t } = useTranslation();
  const queueScreenText = t('queueScreen', 'Queue screen');
  const navigateToQueueScreen = () => {
    navigate({ to: `${spaBasePath}/patient-queues/screen` });
  };

  return (
    <div className={styles.launcherContainer}>
      <Button
        onClick={navigateToQueueScreen}
        kind="tertiary"
        renderIcon={(props) => <MessageQueue size={32} {...props} />}
        iconDescription={queueScreenText}
      >
        {queueScreenText}
      </Button>
    </div>
  );
};

export default QueueLauncher;
