import React from 'react';
import styles from '../item.scss';
import { Medication } from '@carbon/react/icons';
import Item from '../item.component';

const DispensingAppMenu = () => {
  return <Item className={styles.customTile} icon={Medication} title="Dispensing" to="dispensing" />;
};
export default DispensingAppMenu;
