import React, { useCallback, useMemo } from 'react';
import {
  InlineLoading,
  Button,
  DataTable,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  Tile,
} from '@carbon/react';
import { Close, DocumentAdd } from '@carbon/react/icons';
import {
  CardHeader,
  EmptyState,
  launchPatientWorkspace,
  launchStartVisitPrompt,
  ErrorState,
} from '@openmrs/esm-patient-common-lib';
import { useTranslation } from 'react-i18next';
import { Result, useCarePrograms } from '../hooks/useCarePrograms';
import { useLayoutType, useVisit } from '@openmrs/esm-framework';
import capitalize from 'lodash/capitalize';
import { mutate } from 'swr';

import styles from './care-programs.scss';

type CareProgramsProps = {
  patientUuid: string;
};

const CarePrograms: React.FC<CareProgramsProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { carePrograms, isLoading, isValidating, error } = useCarePrograms(patientUuid);
  const isTablet = useLayoutType() === 'tablet';
  const { currentVisit } = useVisit(patientUuid);
  // function handleCareProgramClick(careProgram: Result) {
  //   throw new Error('Function not implemented.');
  // }
  const handleCareProgramClick = useCallback(
    (careProgram: Result) => {
      const isEnrolled = careProgram.name === 'active';
      const formUuid = isEnrolled ? careProgram.name : careProgram.name;
      const workspaceTitle = isEnrolled
        ? `${careProgram.name} Discontinuation form`
        : `${careProgram.name} Enrollment form`;

      currentVisit
        ? launchPatientWorkspace('patient-form-entry-workspace', {
            workspaceTitle: workspaceTitle,
            mutateForm: () => {
              mutate((key) => true, undefined, {
                revalidate: true,
              });
            },
            formInfo: {
              encounterUuid: '',
              formUuid,
              additionalProps: { enrollmenrDetails: careProgram.name } ?? {},
            },
          })
        : launchStartVisitPrompt();
    },
    [currentVisit],
  );
  const rows = useMemo(
    () =>
      carePrograms.map((careProgram) => {
        return {
          id: `${careProgram.uuid}`,
          programName: careProgram.name,
          status: (
            <div className={styles.careProgramButtonContainer}>
              <span>
                {capitalize(
                  `
                  ${careProgram.name}`,
                )}
              </span>
              <Button
                size="sm"
                className="cds--btn--sm cds--layout--size-sm"
                kind={careProgram.name == 'active' ? 'danger--ghost' : 'ghost'}
                iconDescription="Dismiss"
                onClick={() => handleCareProgramClick(careProgram)}
                renderIcon={careProgram.name == 'active' ? Close : DocumentAdd}
              >
                {careProgram.name == 'active' ? 'Discontinue' : 'Enroll'}
              </Button>
            </div>
          ),
        };
      }),
    [carePrograms],
  );

  const headers = [
    {
      key: 'programName',
      header: 'Program name',
    },
    {
      key: 'status',
      header: 'Detail',
    },
  ];

  if (isLoading) {
    return (
      <InlineLoading
        status="active"
        iconDescription={t('loading', 'Loading')}
        description={t('loadingDescription', 'Loading data...')}
      />
    );
  }

  if (error) {
    return <ErrorState headerTitle={t('errorCarePrograms', 'Care programs')} error={error} />;
  }

  if (carePrograms.length === 0) {
    return <EmptyState headerTitle={t('careProgram', 'Care program')} displayText={t('careProgram', 'care program')} />;
  }

  return (
    <Tile>
      <CardHeader title={t('carePrograms', 'Care Programs')}>
        {isValidating && (
          <InlineLoading
            status="active"
            iconDescription={t('validating', 'Loading')}
            description={t('validating', 'Validating data...')}
          />
        )}
      </CardHeader>
      <DataTable size={isTablet ? 'lg' : 'sm'} useZebraStyles rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <TableContainer>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </Tile>
  );
};

export default CarePrograms;
