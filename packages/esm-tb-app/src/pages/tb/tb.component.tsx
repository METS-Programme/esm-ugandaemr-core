import React from 'react';
import { useTranslation } from 'react-i18next';
import capitalize from 'lodash-es/capitalize';
import {
  DataTable,
  DataTableSkeleton,
  InlineNotification,
  Table,
  InlineLoading,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import { launchPatientWorkspace, CardHeader, EmptyState, ErrorState } from '@openmrs/esm-patient-common-lib';
import {
  ConfigObject,
  formatDate,
  formatDatetime,
  useConfig,
  useLayoutType,
  isDesktop as desktopLayout,
} from '@openmrs/esm-framework';
import { usePrograms } from '../../program.resource';
import ProgramActionButton from '../../program-action-button/program-action-button.component';
import { ConfigurableProgram } from '../../types';
import styles from '../common.scss';

interface ProgramsOverviewProps {
  basePath: string;
  patientUuid: string;
}

const ProgramsOverview: React.FC<ProgramsOverviewProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const displayText = t('programs', 'Program enrollments');
  const headerTitle = t('carePrograms', 'Care Programs');
  // const isConfigurable = config.customUrl ? true : false;
  const layout = useLayoutType();
  const isTablet = layout === 'tablet';
  const isDesktop = desktopLayout(layout);

  const {
    activeEnrollments,
    availablePrograms,
    configurablePrograms,
    eligiblePrograms,
    enrollments,
    isError,
    isLoading,
    isValidating,
    groupProgramsByUUIDandDisplay,
  } = usePrograms(patientUuid);

  const launchProgramsForm = React.useCallback(() => launchPatientWorkspace('programs-form-workspace'), []);

  const tableHeaders = [
    {
      key: 'display',
      header: t('activePrograms', 'Active programs'),
    },
    {
      key: 'location',
      header: t('location', 'Location'),
    },
    {
      key: 'dateEnrolled',
      header: t('dateEnrolled', 'Date enrolled'),
    },
    {
      key: 'status',
      header: t('status', 'Status'),
    },
    {
      key: 'actions',
      header: t('actions', 'Actions'),
    },
  ];

  const tableRows = React.useMemo(() => {
    return groupProgramsByUUIDandDisplay?.map(({ uuid, display, enrollment }: ConfigurableProgram) => {
      const programDetails = { uuid, display, enrollment };

      return {
        id: uuid,
        display,
        location: enrollment.length ? enrollment[0].location?.display : '--',
        dateEnrolled: enrollment.length ? formatDatetime(new Date(enrollment[0].dateEnrolled)) : '--',
        status: !enrollment.length
          ? '--'
          : capitalize(enrollment[0].enrollmentStatus)
          ? t('active', 'Active')
          : `${t('completedOn', 'Completed On')} ${formatDate(new Date(enrollment[0].dateCompleted))}`,
        actions: <ProgramActionButton enrollment={programDetails} />,
      };
    });
  }, [groupProgramsByUUIDandDisplay, t]);

  if (isLoading) return <DataTableSkeleton role="progressbar" compact={isDesktop} zebra />;
  if (isError) return <ErrorState error={isError} headerTitle={headerTitle} />;
  if (tableRows.length) {
    return (
      <div className={styles.widgetCard}>
        <CardHeader title={headerTitle}>
          <span>{isValidating ? <InlineLoading /> : null}</span>
        </CardHeader>
        {availablePrograms?.length && eligiblePrograms?.length === 0 && (
          <InlineNotification
            style={{ minWidth: '100%', margin: '0rem', padding: '0rem' }}
            kind={'info'}
            lowContrast
            subtitle={t('noEligibleEnrollments', 'There are no more programs left to enroll this patient in')}
            title={t('fullyEnrolled', 'Enrolled in all programs')}
          />
        )}
        <DataTable rows={tableRows} headers={tableHeaders} isSortable size={isTablet ? 'lg' : 'sm'} useZebraStyles>
          {({ rows, headers, getHeaderProps, getTableProps }) => (
            <TableContainer>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader
                        className={`${styles.productiveHeading01} ${styles.text02}`}
                        {...getHeaderProps({
                          header,
                          isSortable: header.isSortable,
                        })}
                      >
                        {header.header?.content ?? header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      </div>
    );
  }
  return <EmptyState displayText={displayText} headerTitle={headerTitle} launchForm={launchProgramsForm} />;
};

export default ProgramsOverview;
