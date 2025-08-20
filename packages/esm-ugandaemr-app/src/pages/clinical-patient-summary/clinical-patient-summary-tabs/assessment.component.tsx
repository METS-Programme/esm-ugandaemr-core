import React from 'react';
import { TextArea, TextInput } from '@carbon/react';
import styles from './clinical-patient-summary-tabs.scss';

export const AssessmentComponent = () => {
  return (
    <>
      <div className={styles.tabContent}>
        <TextInput id="testOrdered" type="text" labelText="Test Ordered" />
      </div>
      <div className={styles.tabContent}>
        <TextArea labelText="Results" />
      </div>
      <div className={styles.tabContent}>
        <TextArea labelText="Diagnosis which is guiding the treatment plan" />
      </div>
    </>
  );
};

export default AssessmentComponent;
