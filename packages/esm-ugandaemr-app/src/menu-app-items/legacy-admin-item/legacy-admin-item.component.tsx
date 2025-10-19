import React from 'react';
import styles from '../item.scss';
import { User } from '@carbon/react/icons';
import Item from '../item.component';

const LegacyAdminApp = () => {
  return <Item className={styles.customTile} title="Legacy Admin" href="/openmrs/index.htm" icon={User} />;
};
export default LegacyAdminApp;
