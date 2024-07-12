import React from 'react';
import { TextArea } from '@carbon/react';
import styles from './clinical-patient-summary-tabs.scss';

export const TreatmentPlanComponent = () => {
  return (
    <>
      <div className={styles.tabContent}>
        <TextArea type="text" labelText="Medical Prescriptions" />
      </div>
      <div className={styles.tabContent}>
        <TextArea labelText="Surgical Procedures" />
      </div>
      <div className={styles.tabContent}>
        <TextArea labelText="Admissions" />
      </div>
    </>
  );
};

export default TreatmentPlanComponent;
