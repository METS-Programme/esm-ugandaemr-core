import React from 'react';
import { TextArea, TextInput } from '@carbon/react';
import styles from './clinical-patient-summary-tabs.scss';

export const ObjectiveFindingsComponent = () => {
  return (
    <>
      <div className={styles.tabContent}>
        <TextArea labelText="List of physical findings on general examinations" />
      </div>
      <div className={styles.tabContent}>
        <TextArea labelText="Narrative of abnormal findings in the examination of body systems" />
      </div>
    </>
  );
};

export default ObjectiveFindingsComponent;
