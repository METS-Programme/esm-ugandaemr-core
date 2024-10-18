import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './program-enrollment.scss';
import dayjs from 'dayjs';
import orderBy from 'lodash/orderBy';
import { parseStageFromDisplay, usePatientObservations } from './program-enrollment.resource';
import { ProgramData } from '../types/index';
import { usePatient } from '@openmrs/esm-framework';
import { configSchema } from '../config-schema';
import { ProgramEnrollmentProps } from '../hooks/useCarePrograms';
import RegimenButton from '../regimen-editor/regimen-button.component';

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
        key: 'currentARVDuration',
        uuidConfig: configSchema.currentARVDurationUuid._default,
      },
      {
        key: 'tptStatus',
        uuidConfig: configSchema.tptStatusUuid._default,
      },
      {
        key: 'tptStartDate',
        uuidConfig: configSchema.tptStartDateUuid._default,
        processValue: (date) => {
          return date && dayjs(date).isValid() ? dayjs(date).format('DD-MM-YYYY') : '--';
        },
      },
      {
        key: 'tptCompletionDate',
        uuidConfig: configSchema.tptCompletionDateUuid._default,
        processValue: (date) => {
          return date && dayjs(date).isValid() ? dayjs(date).format('DD-MM-YYYY') : '--';
        },
      },
    ],
    [],
  );
  const conceptUuids = observationConfig.map((config) => config.uuidConfig);

  const orderedEnrollments = orderBy(enrollments, 'dateEnrolled', 'desc');

  const [programData, setProgramData] = useState<ProgramData>({
    currentRegimen: '--',
    baselineRegimen: '--',
    whoClinicalStage: '--',
    dateConfirmedHivPositive: '--',
    baselineCd4: '--',
    currentARVDuration: '--',
    tptStatus: '--',
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
  }, [conceptUuids, observationConfig, observations]);

  if (orderedEnrollments?.length === 0) {
    return null;
  }

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.card}>
        <div className={styles.sectionTitle}>{t('baseline', 'Baseline Information')}</div>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('artStartDate', 'ART Start Date')}</p>
            <span className={styles.value}>{programData.artStartDate}</span>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('dateConfirmedHivPositive', 'Date Positive HIV Test Confirmed')}</p>
            <span className={styles.value}>{programData.dateConfirmedHivPositive}</span>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('baselineRegimen', 'Baseline Regimen')}</p>
            <span className={styles.value}>{programData.baselineRegimen}</span>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('baselineCd4', 'baseline CD4')}</p>
            <span className={styles.value}>{programData.baselineCd4}</span>
          </div>
        </div>
        <br></br>
        <div className={styles.sectionTitle}>{t('lastArtVisitSummary', 'Last ART Visit Summary')}</div>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('currentRegimen', 'Current Regimen')}</p>

            <span className={styles.value}>{programData.currentRegimen}</span>
            <span>
              <RegimenButton />
            </span>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('whoStage', 'WHO Stage')}</p>
            <span className={styles.value}>{programData.whoClinicalStage}</span>
          </div>
        </div>
        <br></br>
        <div className={styles.sectionTitle}>{t('tptDetails', 'TPT Details')}</div>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('tptStatus', 'TPT Status')}</p>
            <span className={styles.value}>{programData.tptStatus}</span>
          </div>
          {programData.tptStatus === 'Treatment complete' && (
            <>
              <div className={styles.content}>
                <p className={styles.label}>{t('tptStartDate', 'TPT Start Date')}</p>
                <span className={styles.value}>{programData.tptStartDate}</span>
              </div>
              <div className={styles.content}>
                <p className={styles.label}>{t('tptCompletionDate', 'TPT Completion Date')}</p>
                <span className={styles.value}>{programData.tptCompletionDate}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProgramEnrollment;
