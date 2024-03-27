import { ClickableTile } from '@carbon/react';
import { VolumeFileStorage } from '@carbon/react/icons';
import React from 'react';
import styles from './system-info-app-item.scss';

const Item = () => {
  // items
  const openmrsSpaBase = window['getOpenmrsSpaBase']();

  return (
    <ClickableTile className={styles.customTile} id="menu-item" href={`${openmrsSpaBase}about`}>
      <div className="customTileTitle">{<VolumeFileStorage size={24} />}</div>
      <div>System Info</div>
    </ClickableTile>
  );
};
export default Item;
