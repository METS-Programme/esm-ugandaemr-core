import React from 'react';
import styles from '../item.scss';
import { VolumeFileStorage } from '@carbon/react/icons';
import Item from '../item.component';

const SystemInfoApp = () => {
  return <Item className={styles.customTile} title="System Info" to="about" icon={VolumeFileStorage} />;
};
export default SystemInfoApp;
