import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Tile,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  OverflowMenu,
  OverflowMenuItem,
  TableContainer,
} from '@carbon/react';
import styles from './program-enrollment.scss';
import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import isEmpty from 'lodash/isEmpty';
import dayjs from 'dayjs';
import orderBy from 'lodash/orderBy';
import { mutate } from 'swr';
import PrintComponent from '../print-layout/print.component';
import {
  parseStageFromDisplay,
  useGetARTStartDate,
  useGetBaselineRegimen,
  useGetCurrentHIVClinicalStage,
  useGetCurrentRegimen,
  usePatientObservations,
} from './program-enrollment.resource';
import { PatientChartProps } from '../types/index';
import { usePatient } from '@openmrs/esm-framework';
import { configSchema } from '../config-schema';

export interface ProgramEnrollmentProps {
  patientUuid: string;
  programName: string;
  enrollments: Array<any>;
  formEntrySub: any;
  launchPatientWorkspace: Function;
  PatientChartProps: string;
}
const shareObjProperty = { dateEnrolled: 'Enrolled on', dateCompleted: 'Date Completed' };
const programDetailsMap = {
  HIV: {
    dateEnrolled: 'Enrolled on',
    whoStage: 'WHO Stage',
    entryPoint: 'Entry Point',
    regimenShortDisplay: 'Regimen',
    changeReasons: 'Reason for regimen change',
  },
  TB: {
    ...shareObjProperty,
    startDate: 'Date started regimen',
    regimenShortName: 'Regimen',
  },
  TPT: {
    ...shareObjProperty,
    tptDrugName: 'Regimen',
    tptDrugStartDate: 'Date started regimen',
    tptIndication: 'Indication for TPT',
  },
  'MCH - Mother Services': {
    ...shareObjProperty,
    lmp: 'LMP',
    eddLmp: 'EDD',
    gravida: 'Gravida',
    parity: 'Parity',
    gestationInWeeks: 'Gestation in weeks',
  },
  'MCH - Child Services': { ...shareObjProperty, entryPoint: 'Entry Point' },
  mchMother: {},
  mchChild: {},
  VMMC: {
    ...shareObjProperty,
  },
};

const ProgramEnrollment: React.FC<ProgramEnrollmentProps> = ({ enrollments = [], programName, patientUuid }) => {
  const { t } = useTranslation();

  const { patient } = usePatient(patientUuid);

  const artStartDateUuidConfig = configSchema.regimenObs.artStartDateUuid._default;
  const currentRegimenUuidConfig = configSchema.regimenObs.currentRegimenUuid._default;
  const whoClinicalStageUuidConfig = configSchema.regimenObs.whoClinicalStageUuid._default;
  const baselineRegimenUuidConfig = configSchema.regimenObs.baselineRegimenUuid._default;
  const dateConfirmedHivPositiveConfig = configSchema.regimenObs.dateConfirmedHivPositiveUuid._default;
  const baselineCd4Config = configSchema.regimenObs.baselineCd4Uuid._default;

  const orderedEnrollments = orderBy(enrollments, 'dateEnrolled', 'desc');
  const headers = useMemo(
    () =>
      Object.entries(programDetailsMap[programName] ?? { ...shareObjProperty }).map(([key, value]) => ({
        key,
        header: value,
      })),
    [programName],
  );
  const rows = useMemo(
    () =>
      orderedEnrollments?.map((enrollment) => {
        const firstEncounter = enrollment?.firstEncounter ?? {};
        const enrollmentEncounterUuid = enrollment?.enrollmentEncounterUuid;
        return {
          id: `${enrollment.enrollmentUuid}`,
          ...enrollment,
          ...firstEncounter,
          changeReasons: enrollment?.firstEncounter?.changeReasons?.join(', '),
          enrollmentEncounterUuid: enrollmentEncounterUuid,
        };
      }),
    [orderedEnrollments],
  );

  const handleDiscontinue = (enrollment) => {
    launchPatientWorkspace('patient-form-entry-workspace', {
      workspaceTitle: enrollment?.discontinuationFormName,
      mutateForm: () => {
        mutate((key) => true, undefined, {
          revalidate: true,
        });
      },
      formInfo: {
        encounterUuid: '',
        formUuid: enrollment?.discontinuationFormUuid,
        additionalProps:
          { enrollmenrDetails: { dateEnrolled: new Date(enrollment.dateEnrolled), uuid: enrollment.enrollmentUuid } } ??
          {},
      },
    });
  };

  const [artStartDate, setArtStartDate] = useState('');
  const [currentRegimen, setCurrentRegimen] = useState('');
  const [baselineRegimen, setBaselineRegimen] = useState('');
  const [whoClinicalStage, setWhoClinicalStage] = useState('');
  const [dateConfirmedHIVPositive, setDateConfirmedHIVPositive] = useState('');
  const [baselineCd4, setBaselineCd4] = useState('');

  const [programData, setProgramData] = useState({
    artStartDate,
    currentRegimen,
    baselineRegimen,
    whoClinicalStage,
    dateConfirmedHIVPositive,
    baselineCd4,
  });

  const conceptUuids = [
    configSchema.regimenObs.artStartDateUuid._default,
    configSchema.regimenObs.currentRegimenUuid._default,
    configSchema.regimenObs.whoClinicalStageUuid._default,
    configSchema.regimenObs.baselineRegimenUuid._default,
    configSchema.regimenObs.dateConfirmedHivPositiveUuid._default,
  ];

  const { observations, isLoading, isError } = usePatientObservations(patientUuid, conceptUuids);
  useEffect(() => {
    if (observations) {
      const artStartDate =
        observations[artStartDateUuidConfig]?.map((date) => dayjs(date).format('DD-MM-YYYY'))[0] || '--';
      const currentRegimen = observations[currentRegimenUuidConfig]?.[0] || '--';
      const baselineRegimen = observations[baselineRegimenUuidConfig]?.[0] || '--';
      const whoClinicalStage = parseStageFromDisplay(observations[whoClinicalStageUuidConfig]?.[0]) || '--';
      const dateConfirmedHIVPositive =
        observations[dateConfirmedHivPositiveConfig]?.map((date) => dayjs(date).format('DD-MM-YYYY'))?.[0] || '--';
      const baselineCd4 = observations[baselineCd4Config]?.[0] || '--';

      setProgramData({
        artStartDate,
        currentRegimen,
        baselineRegimen,
        whoClinicalStage,
        dateConfirmedHIVPositive,
        baselineCd4,
      });
    }
  }, [
    observations,
    artStartDateUuidConfig,
    currentRegimenUuidConfig,
    baselineRegimenUuidConfig,
    whoClinicalStageUuidConfig,
    dateConfirmedHivPositiveConfig,
    baselineCd4Config,
  ]);

  console.info(programData);

  const handleEditEnrollment = (enrollment) => {
    launchPatientWorkspace('patient-form-entry-workspace', {
      workspaceTitle: enrollment?.enrollmentFormName,
      mutateForm: () => {
        mutate((key) => true, undefined, {
          revalidate: true,
        });
      },
      formInfo: {
        encounterUuid: enrollment?.enrollmentEncounterUuid,
        formUuid: enrollment?.enrollmentFormUuid,
        additionalProps:
          { enrollmenrDetails: { dateEnrolled: new Date(enrollment.dateEnrolled), uuid: enrollment.enrollmentUuid } } ??
          {},
      },
    });
  };

  if (orderedEnrollments?.length === 0) {
    return null;
  }

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.card}>
        <h6>{t('baseline', 'Baseline Information')}</h6>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('artStartDate', 'ART Start Date')}</p>
            <p>
              <span className={styles.value}>{artStartDate || '--'}</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('dateConfirmedHivPositive', 'Date Positive HIV Test Confirmed')}</p>
            <p>
              <span className={styles.value}>{'--'}</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('baselineRegimen', 'Baseline Regimen')}</p>
            <p>
              <span className={styles.value}>{baselineRegimen || '--'}</span>
            </p>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('baselineCd4', 'baseline CD4')}</p>
            <p>
              <span className={styles.value}>{'--'}</span>
            </p>
          </div>
        </div>

        <h6>{t('lastArtVisitSummary', 'Last ART Visit Summary')}</h6>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('currentRegimen', 'Current Regimen')}</p>
            <p>
              <span className={styles.value}>{currentRegimen || '--'}</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('whoStage', 'WHO Stage')}</p>
            <p>
              <span className={styles.value}>{whoClinicalStage || '--'}</span>
            </p>
          </div>
        </div>
        <br></br>
        <h6>{t('viralLoadHistory', 'Viral Load History')}</h6>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('encounterDate', 'Encounter Date')}</p>
            <p>
              <span className={styles.value}>{'--'}</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('viralLoadDate', 'HIV Viral Load Date')}</p>
            <p>
              <span className={styles.value}>{'--'}</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('viralLoadResults', 'Viral Load Results')}</p>
            <p>
              <span className={styles.value}>{'--'}</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('hivViralLoad', 'HIV Viral Load')}</p>
            <p>
              <span className={styles.value}>{'--'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProgramEnrollment;
