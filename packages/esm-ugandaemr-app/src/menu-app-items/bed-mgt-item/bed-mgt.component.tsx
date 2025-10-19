import React from 'react';
import styles from '../item.scss';
import { HospitalBed } from '@carbon/react/icons';
import Item from '../item.component';

const BedManagementApp: React.FC<{ title?: string }> = ({ title }) => {
  return <Item className={styles.customTile} title="Bed Management" icon={HospitalBed} to="bed-management" />;
};
export default BedManagementApp;
