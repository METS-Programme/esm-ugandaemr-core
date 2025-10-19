import React from 'react';
import styles from '../item.scss';
import { DocumentAdd } from '@carbon/react/icons';
import Item from '../item.component';

const FormBuilderApp = () => {
  return <Item className={styles.customTile} title="Form Builder" to="form-builder" icon={DocumentAdd} />;
};
export default FormBuilderApp;
