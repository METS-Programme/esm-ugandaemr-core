import React, { useMemo } from 'react';
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
import { formatDate } from '@openmrs/esm-framework';
import orderBy from 'lodash/orderBy';
import { mutate } from 'swr';
import PrintComponent from "../print-layout/print.component";

export interface ProgramEnrollmentProps {
  patientUuid: string;
  programName: string;
  enrollments: Array<any>;
  formEntrySub: any;
  launchPatientWorkspace: Function;
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

const ProgramEnrollment: React.FC<ProgramEnrollmentProps> = ({ enrollments = [], programName }) => {
  const { t } = useTranslation();
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
                <span className={styles.value}>
                  { '--'}
                </span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t('weight', 'Weight')}
            </p>
            <p>
                <span className={styles.value}>
                  {'--'}
                </span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t('bmi', 'BMI')}
            </p>
            <p>
                <span className={styles.value}>
                  {'--'}
                </span>
            </p>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('durationArt', 'Duration on ART')}</p>
            <p>
                <span className={styles.value}>
                  { '--'}
                </span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t('whoStage', 'WHO Stage')}
            </p>
            <p>
                <span className={styles.value}>
                  {'--'}
                </span>
            </p>
          </div>
        </div>


        <h6>{t('lastvist', 'Last Visit')}</h6>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t('currentRegimen', 'Current Regimen')}</p>
            <p>
                <span className={styles.value}>
                  { '--'}
                </span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t('vlStatus', 'VL Status')}
            </p>
            <p>
                <span className={styles.value}>
                  {'--'}
                </span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
export default ProgramEnrollment;
