import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './clinical-patient-summary.scss';
import { usePatient } from '@openmrs/esm-framework';
import ClinicalPatientSummaryTabs from './clinical-patient-summary-tabs/clinical-patient-summary-tabs.component';

export interface ClinicalPatientProps {
  patientUuid: string;
}

const ClinicalPatientSummary: React.FC<ClinicalPatientProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const { patient } = usePatient(patientUuid);

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.card}>
        <div className={styles.sectionTitle}>{t('facilityDetails', 'Facility Details')}</div>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('facilityCode', 'Facility Unique Identifier')}</p>
            <span className={styles.value}>cybn8909</span>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('facilityPatientIdentifier', 'Facility Patient Unique Identifier')}</p>
            <span className={styles.value}>MOH/09099</span>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('healthWorkerID', 'National Healthworker Unique Identifier')}</p>
            <span className={styles.value}>UG/989009</span>
          </div>
        </div>
        <br></br>
        <div className={styles.sectionTitle}>{t('vitalsDetails', 'Vitals Details')}</div>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('visitDate', 'Visit Date')}</p>
            <span className={styles.value}>15-07-2024</span>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('bp', 'BP')}</p>
            <span className={styles.value}>119/80</span>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('weight', 'Weight')}</p>
            <span className={styles.value}>67</span>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('height', 'Height')}</p>
            <span className={styles.value}>157</span>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('bmi', 'BMI')}</p>
            <span className={styles.value}>27.2</span>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('muac', 'MUAC')}</p>
            <span className={styles.value}>25</span>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('pulse', 'Heart rate')}</p>
            <span className={styles.value}>57</span>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('respRate', 'Respiratian rate')}</p>
            <span className={styles.value}>57</span>
          </div>
        </div>
        <ClinicalPatientSummaryTabs />
      </div>
    </div>
  );
};
export default ClinicalPatientSummary;
