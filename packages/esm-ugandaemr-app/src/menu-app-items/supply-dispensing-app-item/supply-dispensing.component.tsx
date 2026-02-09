import React from 'react';
import styles from '../item.scss';
import { Medication } from '@carbon/react/icons';
import Item from '../item.component';

const SuppliesDispensingApp: React.FC<{ title?: string }> = ({ title }) => {
  return <Item className={styles.customTile} title="Supplies Dispensing" icon={Medication} to="supplies-dispensing" />;
};
export default SuppliesDispensingApp;
