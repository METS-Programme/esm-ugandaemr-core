import { ClickableTile } from '@carbon/react';
import React from 'react';
import styles from './cohort-builder-item.scss';
import { Events } from '@carbon/react/icons';

const Item = () => {
  // items
  const openmrsSpaBase = window['getOpenmrsSpaBase']();

  return (
    <ClickableTile className={styles.customTile} id="menu-item" href={`${openmrsSpaBase}cohort-builder`}>
      <div className="customTileTitle">{<Events size={24} />}</div>
      <div>Cohort Builder</div>
    </ClickableTile>
  );
};
export default Item;
