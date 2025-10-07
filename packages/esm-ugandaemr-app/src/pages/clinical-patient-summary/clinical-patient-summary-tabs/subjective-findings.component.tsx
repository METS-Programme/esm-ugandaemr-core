import React from 'react';
import { TextArea, TextInput } from '@carbon/react';
import styles from './clinical-patient-summary-tabs.scss';

export const SubjectiveFindingsComponent = () => {
  return (
    <>
      <div className={styles.tabContent}>
        <TextInput id="visitReason" type="text" labelText="Reason for today's patient visit" />
      </div>
      <div className={styles.tabContent}>
        <TextArea labelText="Narrative explaining the progression of the presenting complaint" />
      </div>
      <div className={styles.tabContent}>
        <TextArea labelText="Narrative of only abnormal findings from the body system review" />
      </div>
    </>
  );
};

export default SubjectiveFindingsComponent;
