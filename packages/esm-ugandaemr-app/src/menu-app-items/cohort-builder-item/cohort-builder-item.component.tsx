import React from 'react';
import styles from '../item.scss';
import { Events } from '@carbon/react/icons';
import Item from '../item.component';

const CohortBuilderApp = () => {
  return <Item className={styles.customTile} icon={Events} title="Cohort Builder" to="cohort-builder" />;
};
export default CohortBuilderApp;
