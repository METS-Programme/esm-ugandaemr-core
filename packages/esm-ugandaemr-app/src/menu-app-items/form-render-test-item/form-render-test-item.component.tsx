import { ClickableTile } from '@carbon/react';
import { DocumentImport } from '@carbon/react/icons';
import React from 'react';
import styles from './form-render-test.scss';

const Item = () => {
  // items
  const openmrsSpaBase = window['getOpenmrsSpaBase']();

  return (
    <ClickableTile className={styles.customTile} id="menu-item" href={`${openmrsSpaBase}form-render-test`}>
      <div className="customTileTitle">{<DocumentImport size={24} />}</div>
      <div>Form Render Test</div>
    </ClickableTile>
  );
};
export default Item;
