import React, { useMemo, useState } from 'react';
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
  useGetARTStartDate,
  useGetCurrentBaselineWeight,
  useGetCurrentHIVClinicalStage,
  useGetCurrentRegimen,
} from './program-enrollment.resource';
import { PatientChartProps } from '../types/index';
import { usePatient } from '@openmrs/esm-framework';

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
  const handleArtStartDateDataReceived = (newArtStartDate: string) => {
    setArtStartDate(newArtStartDate);
  };

  const [currentRegimen, setCurrentRegimen] = useState('');
  const handleCurrentRegimenReceived = (newCurrentRegimen: string) => {
    setCurrentRegimen(newCurrentRegimen);
  };

  const [baselineWeight, setBaselineWeight] = useState('');
  const handleBaselineWeightReceived = (newBaselineWeight: string) => {
    setBaselineWeight(newBaselineWeight);
  };

  const [whoClinicalStage, setWhoClinicalStage] = useState('');
  const handleWhoClinicalStageReceived = (newWhoClinicalStage) => {
    setWhoClinicalStage(newWhoClinicalStage);
  };

  useGetARTStartDate(
    {
      patientuuid: patientUuid,
    },
    handleArtStartDateDataReceived,
    'ab505422-26d9-41f1-a079-c3d222000440',
  );

  useGetCurrentRegimen(
    {
      patientuuid: patientUuid,
    },
    handleCurrentRegimenReceived,
    'dd2b0b4d-30ab-102d-86b0-7a5022ba4115',
  );

  useGetCurrentBaselineWeight(
    {
      patientuuid: patientUuid,
    },
    handleBaselineWeightReceived,
    '900b8fd9-2039-4efc-897b-9b8ce37396f5',
  );

  useGetCurrentHIVClinicalStage(
    {
      patientuuid: patientUuid,
    },
    handleWhoClinicalStageReceived,
    'dcdff274-30ab-102d-86b0-7a5022ba4115',
  );

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
  console.info(whoClinicalStage);

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
            <p className={styles.label}>{t('weight', 'Weight')}</p>
            <p>
              <span className={styles.value}>{baselineWeight || '--'}</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('bmi', 'BMI')}</p>
            <p>
              <span className={styles.value}>{'--'}</span>
            </p>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('durationArt', 'Duration on ART')}</p>
            <p>
              <span className={styles.value}>{'--'}</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('whoStage', 'WHO Stage')}</p>
            <p>
              <span className={styles.value}>{whoClinicalStage || '--'}</span>
            </p>
          </div>
        </div>

        <h6>{t('lastvist', 'Last Visit')}</h6>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('currentRegimen', 'Current Regimen')}</p>
            <p>
              <span className={styles.value}>{currentRegimen}</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t('vlStatus', 'VL Status')}</p>
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
