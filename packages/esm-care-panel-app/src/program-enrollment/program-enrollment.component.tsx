import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './program-enrollment.scss';
import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import dayjs from 'dayjs';
import orderBy from 'lodash/orderBy';
import { mutate } from 'swr';
import { parseStageFromDisplay, usePatientObservations } from './program-enrollment.resource';
import { ProgramData } from '../types/index';
import { usePatient } from '@openmrs/esm-framework';
import { configSchema } from '../config-schema';
import { ProgramEnrollmentProps } from '../hooks/useCarePrograms';

const ProgramEnrollment: React.FC<ProgramEnrollmentProps> = ({ enrollments = [], patientUuid }) => {
  const { t } = useTranslation();

  const { patient } = usePatient(patientUuid);

  const observationConfig = useMemo(
    () => [
      {
        key: 'artStartDate',
        uuidConfig: configSchema.artStartDateUuid._default,
        processValue: (date) => {
          return date && dayjs(date).isValid() ? dayjs(date).format('DD-MM-YYYY') : '--';
        },
      },
      {
        key: 'currentRegimen',
        uuidConfig: configSchema.currentRegimenUuid._default,
      },
      {
        key: 'baselineRegimen',
        uuidConfig: configSchema.baselineRegimenUuid._default,
      },
      {
        key: 'whoClinicalStage',
        uuidConfig: configSchema.whoClinicalStageUuid._default,
        processValue: parseStageFromDisplay,
      },
      {
        key: 'dateConfirmedHivPositive',
        uuidConfig: configSchema.dateConfirmedHivPositiveUuid._default,
        processValue: (date) => {
          return date && dayjs(date).isValid() ? dayjs(date).format('DD-MM-YYYY') : '--';
        },
      },
      {
        key: 'baselineCd4',
        uuidConfig: configSchema.baselineCd4Uuid._default,
      },
      {
        key: 'hivViralLoadDate',
        uuidConfig: configSchema.hivViralLoadDateUuid._default,
        processValue: (date) => {
          return date && dayjs(date).isValid() ? dayjs(date).format('DD-MM-YYYY') : '--';
        },
      },
      {
        key: 'hivViralLoadQualitative',
        uuidConfig: configSchema.hivViralLoadQualitativeUuid._default,
      },
      {
        key: 'hivViralLoad',
        uuidConfig: configSchema.hivViralLoadUuid._default,
      },
      {
        key: 'currentARVDuration',
        uuidConfig: configSchema.currentARVDurationUuid._default,
      },
    ],
    [],
  );
  const conceptUuids = observationConfig.map((config) => config.uuidConfig);

  const orderedEnrollments = orderBy(enrollments, 'dateEnrolled', 'desc');

  const [programData, setProgramData] = useState<ProgramData>({
    artStartDate: '--',
    currentRegimen: '--',
    baselineRegimen: '--',
    whoClinicalStage: '--',
    dateConfirmedHivPositive: '--',
    baselineCd4: '--',
    hivViralLoadDate: '--',
    hivViralLoadQualitative: '--',
    hivViralLoad: '--',
    currentARVDuration: '--',
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
  console.info(programData.artStartDate);

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.card}>
        <h6>{t('baseline', 'Baseline Information')}</h6>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('artStartDate', 'ART Start Date')}</p>
            <p>
              <span className={styles.value}>{programData.artStartDate}</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('dateConfirmedHivPositive', 'Date Positive HIV Test Confirmed')}</p>
            <p>
              <span className={styles.value}>{programData.dateConfirmedHivPositive}</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('baselineRegimen', 'Baseline Regimen')}</p>
            <p>
              <span className={styles.value}>{programData.baselineRegimen}</span>
            </p>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('baselineCd4', 'baseline CD4')}</p>
            <p>
              <span className={styles.value}>{programData.baselineCd4}</span>
            </p>
          </div>
        </div>
        <br></br>
        <h6>{t('lastArtVisitSummary', 'Last ART Visit Summary')}</h6>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('currentRegimen', 'Current Regimen')}</p>
            <p>
              <span className={styles.value}>{programData.currentRegimen}</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('whoStage', 'WHO Stage')}</p>
            <p>
              <span className={styles.value}>{programData.whoClinicalStage}</span>
            </p>
          </div>
        </div>
        <br></br>
        <h6>{t('lastViralLoadResults', 'Last Viral Load Results')}</h6>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('viralLoadDate', 'HIV Viral Load Date')}</p>
            <p>
              <span className={styles.value}>{programData.hivViralLoadDate}</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('viralLoadQual', 'Viral Load Qualitative')}</p>
            <p>
              <span className={styles.value}>{programData.hivViralLoadQualitative}</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('hivViralLoad', 'HIV Viral Load')}</p>
            <p>
              <span className={styles.value}>{programData.hivViralLoad}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProgramEnrollment;
