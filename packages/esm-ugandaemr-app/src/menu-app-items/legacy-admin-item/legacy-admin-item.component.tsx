import { ClickableTile } from '@carbon/react';
import { User } from '@carbon/react/icons';
import React from 'react';
import styles from './legacy-admin-item.scss';

const Item = () => {
  // items
  const openmrsSpaBase = window['getOpenmrsSpaBase']();

  return (
    <ClickableTile className={styles.customTile} id="menu-item" href={`/openmrs/index.htm`}>
      <div className="customTileTitle">{<User size={24} />}</div>
      <div>Legacy Admin</div>
    </ClickableTile>
  );
};
export default Item;
