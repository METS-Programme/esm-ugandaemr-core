import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './program-enrollment.scss';
import dayjs from 'dayjs';
import orderBy from 'lodash/orderBy';
import {  usePatientObservations } from './program-enrollment.resource';
import { ProgramData } from '../types/index';
import { usePatient } from '@openmrs/esm-framework';
import { configSchema } from '../config-schema';
import { ProgramEnrollmentProps } from '../hooks/useCarePrograms';

const ProgramEnrollmentTB: React.FC<ProgramEnrollmentProps> = ({ enrollments = [], patientUuid }) => {
  const { t } = useTranslation();

  const { patient } = usePatient(patientUuid);

  const observationConfig = useMemo(
    () => [
      {
        key: 'dateStartedTBFirstLineRegimen',
        uuidConfig: configSchema.dateStartedTBFirstRegimenUuid._default,
        processValue: (date) => {
          return date && dayjs(date).isValid() ? dayjs(date).format('DD-MM-YYYY') : '--';
        },
      },
      {
        key: 'dsTBRegimen',
        uuidConfig: configSchema.dsTbRegmimenUuid._default,
      },
      {
        key: 'tbPatientType',
        uuidConfig: configSchema.tbPatientTypeUuid._default,
      },
      {
        key: 'tbDiseaseClassification',
        uuidConfig: configSchema.tbDiseaseClassificationUuid._default,
      },
    ],
    [],
  );
  const conceptUuids = observationConfig.map((config) => config.uuidConfig);

  const orderedEnrollments = orderBy(enrollments, 'dateEnrolled', 'desc');

  const [programData, setProgramData] = useState<ProgramData>({
    dateStartedTBFirstLineRegimen: '--',
    dsTBRegimen: '--',
    tbDiseaseClassification: '--',
    tbPatientType: '--',
  });

  const { observations, isLoading, isError } = usePatientObservations(patientUuid, conceptUuids);
  useEffect(() => {
    if (observations) {
      const newData = observationConfig.reduce((acc, { key, uuidConfig, processValue }) => {
        const value = observations[uuidConfig]?.[0] || '--';
        acc[key] = processValue ? processValue(value) : value;
        return acc;
      }, {});

      setProgramData((prevState) => ({ ...prevState, ...newData }));
    }
  }, [observationConfig, observations]);

  if (orderedEnrollments?.length === 0) {
    return null;
  }
  return (
    <div className={styles.bodyContainer}>
      <div className={styles.card}>
        <h6>{t('diseasClassification', 'Disease Classification/Patient Type')}</h6>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('diseaseClassification', 'TB Disease Classification')}</p>
            <p>
              <span className={styles.value}>{programData.tbDiseaseClassification}</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('tbPatientType', 'Patient Type')}</p>
            <p>
              <span className={styles.value}>{programData.tbPatientType}</span>
            </p>
          </div>
        </div>
        <br></br>
        <h6>{t('firstLineTreatment', 'First Line Treatment')}</h6>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('dateStarted', 'Date Started')}</p>
            <p>
              <span className={styles.value}>{programData.dateStartedTBFirstLineRegimen}</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('dsTbRegmien', 'DS TB Regimen')}</p>
            <p>
              <span className={styles.value}>{programData.dsTBRegimen}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProgramEnrollmentTB;
