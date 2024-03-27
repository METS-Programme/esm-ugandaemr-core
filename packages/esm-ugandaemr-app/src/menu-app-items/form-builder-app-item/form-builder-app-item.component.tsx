import { ClickableTile } from '@carbon/react';
import { DocumentAdd } from '@carbon/react/icons';
import React from 'react';
import styles from './form-builder-app-item.scss';

const Item = () => {
  // items
  const openmrsSpaBase = window['getOpenmrsSpaBase']();

  return (
    <ClickableTile className={styles.customTile} id="menu-item" href={`${openmrsSpaBase}form-builder`}>
      <div className="customTileTitle">{<DocumentAdd size={24} />}</div>
      <div>Form Builder</div>
    </ClickableTile>
  );
};
export default Item;
