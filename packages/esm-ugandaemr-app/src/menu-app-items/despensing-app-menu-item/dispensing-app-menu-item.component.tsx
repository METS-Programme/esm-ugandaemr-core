import { ClickableTile } from '@carbon/react';
import React from 'react';
import styles from './dispensing-app-menu-item.scss';
import { Medication } from '@carbon/react/icons';

const Item = () => {
  // items
  const openmrsSpaBase = window['getOpenmrsSpaBase']();

  return (
    <ClickableTile className={styles.customTile} id="menu-item" href={`${openmrsSpaBase}dispensing`}>
      <div className="customTileTitle">{<Medication  size={24} />}</div>
      <div>Dispensing</div>
    </ClickableTile>
  );
};
export default Item;
