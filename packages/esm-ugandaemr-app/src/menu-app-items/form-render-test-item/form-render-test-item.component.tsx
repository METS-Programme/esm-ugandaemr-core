import React from 'react';
import styles from '../item.scss';
import { DocumentImport } from '@carbon/react/icons';
import Item from '../item.component';

const FormRenderApp = () => {
  return <Item className={styles.customTile} to="form-render-test" title="Form Render" icon={DocumentImport} />;
};
export default FormRenderApp;
