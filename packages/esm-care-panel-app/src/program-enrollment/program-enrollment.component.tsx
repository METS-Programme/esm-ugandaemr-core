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
    whoStage: 'WHO Stage',
    entryPoint: 'Entry Point',
    regimenShortDisplay: 'Regimen',
    changeReasons: 'Reason for regimen change',
    dateEnrolled: 'Enrolled on', // Include "Enrolled on" only once
  },
  TB: {
    startDate: 'Date started regimen',
    regimenShortName: 'Regimen',
    dateEnrolled: 'Enrolled on', // Include "Enrolled on" only once
  },
  TPT: {
    tptDrugName: 'Regimen',
    tptDrugStartDate: 'Date started regimen',
    tptIndication: 'Indication for TPT',
    dateEnrolled: 'Enrolled on', // Include "Enrolled on" only once
  },
  'MCH - Mother Services': {
    lmp: 'LMP',
    eddLmp: 'EDD',
    gravida: 'Gravida',
    parity: 'Parity',
    gestationInWeeks: 'Gestation in weeks',
    dateEnrolled: 'Enrolled on', // Include "Enrolled on" only once
  },
  'MCH - Child Services': {
    entryPoint: 'Entry Point',
    dateEnrolled: 'Enrolled on', // Include "Enrolled on" only once
  },
  mchMother: {},
  mchChild: {},
  VMMC: {
    dateEnrolled: 'Enrolled on', // Include "Enrolled on" only once
  },
};


const ProgramEnrollment: React.FC<ProgramEnrollmentProps> = ({ enrollments = [], programName }) => {
  const { t } = useTranslation();

  const orderedEnrollments = orderBy(enrollments, 'dateEnrolled', 'desc');

  const headers = useMemo(() => {
    const programDetails = programDetailsMap[programName];
    const fallbackHeaders = { ...shareObjProperty };
  
    if (!programDetails) {
      console.warn(`Program details not found for ${programName}. Falling back to default headers.`);
      return Object.entries(fallbackHeaders).map(([key, value]) => ({ key, header: value }));
    }
  
    const uniqueHeaders = new Map();
  
    Object.entries(programDetails).forEach(([key, value]) => {
      uniqueHeaders.set(key, value);
    });
  
    return Array.from(uniqueHeaders.entries()).map(([key, value]) => ({ key, header: value }));
  }, [programDetailsMap, programName]);
  
  
  
  const rows = useMemo(() =>
  orderedEnrollments?.map((enrollment) => {
    console.info('enrollment object:', enrollment); // Log the enrollment object
    const firstEncounter = enrollment?.firstEncounter ?? {};
    const enrollmentEncounterUuid = enrollment?.enrollmentEncounterUuid;

    const formattedDateEnrolled = dayjs(enrollment?.dateEnrolled).isValid()
      ? formatDate(dayjs(enrollment?.dateEnrolled).toDate())
      : '--';

    console.info('Formatted Date Enrolled:', formattedDateEnrolled); // Log the formatted date

    return {
      id: `${enrollment?.uuid}`,
      ...enrollment,
      ...firstEncounter,
      changeReasons: enrollment?.firstEncounter?.changeReasons?.join(', '),
      enrollmentEncounterUuid: enrollmentEncounterUuid,
      dateEnrolled: formattedDateEnrolled,
    };
  }),
  [orderedEnrollments]
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
    <Tile className={styles.whiteBackground}>
      <div className={styles.tileWrapper}>
        <DataTable size="sm" useZebraStyles rows={rows} headers={headers}>
          {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
            <TableContainer title={t('EnrollmentDetails', 'Enrollment History')} description="">
              <Table {...getTableProps()} aria-label="">
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader
                        key={header.key}
                        {...getHeaderProps({
                          header,
                        })}
                      >
                        {header.header}
                      </TableHeader>
                    ))}
                    <TableHeader />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      {...getRowProps({
                        row,
                      })}
                    >
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>
                          {isEmpty(cell.value)
                            ? '--'
                            : dayjs(cell.value).isValid()
                              ? formatDate(new Date(cell.value))
                              : cell.value}
                        </TableCell>
                      ))}
                      <TableCell className="cds--table-column-menu">
                        {isEmpty(orderedEnrollments[index]?.dateCompleted) && (
                          <OverflowMenu size="sm" flipped>
                            <OverflowMenuItem
                              hasDivider
                              itemText={t('edit', 'Edit')}
                              onClick={() => handleEditEnrollment(orderedEnrollments[index])}
                            />
                            <OverflowMenuItem
                              isDelete
                              hasDivider
                              itemText={t('discontinue', 'Discontinue')}
                              onClick={() => handleDiscontinue(orderedEnrollments[index])}
                            />
                          </OverflowMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      </div>
    </Tile>
  );
};
export default ProgramEnrollment;
