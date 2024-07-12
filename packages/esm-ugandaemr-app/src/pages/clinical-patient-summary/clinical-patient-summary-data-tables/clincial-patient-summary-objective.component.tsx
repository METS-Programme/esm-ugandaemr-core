import React, { useState } from 'react';
import {
  DataTable,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  Layer,
  Tile,
} from '@carbon/react';

import { useTranslation } from 'react-i18next';
import { usePagination } from '@openmrs/esm-framework';
import styles from './clinical-patient-summary-subjective-findings.scss';

interface subjectiveFindingsProps {
  patientUuid: string;
}

const ObjectiveFindings: React.FC<subjectiveFindingsProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);

  let columns = [
    { id: 0, header: t('generalExamination', 'Physical Findings'), key: 'generalExamination' },
    {
      id: 1,
      header: t('systemicExamination', 'Narrative of abnormal findings'),
      key: 'systemicExamination',
    },
  ];

  const tableRows = [
    {
      id: 'reason-1',
      generalExamination: 'Stomache',
      systemicExamination: 'I started feeling stomache last night',
    },
    {
      id: 'reason-2',
      generalExamination: 'Stomache',
      systemicExamination: 'I started feeling stomache last night',
    },
    {
      id: 'reason-3',
      generalExamination: 'Stomache',
      systemicExamination: 'I started feeling stomache last night',
    },
  ];

  const { goTo, results: paginatedDSDM, currentPage } = usePagination(tableRows, currentPageSize);

  if (paginatedDSDM?.length >= 0) {
    return (
      <DataTable rows={tableRows} headers={columns} useZebraStyles overflowMenuOnHover={true}>
        {({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
          <TableContainer className={styles.tableContainer}>
            <TableToolbar
              style={{
                position: 'static',
              }}
            ></TableToolbar>
            <Table {...getTableProps()} className={styles.activePatientsTable}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => {
                  return (
                    <React.Fragment key={row.id}>
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
                        ))}
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
            {rows.length === 0 ? (
              <div className={styles.tileContainer}>
                <Tile className={styles.tile}>
                  <div className={styles.tileContent}>
                    <p className={styles.content}>{t('noDSDMToDisplay', 'Patient not enrolled on any DSDM')}</p>
                  </div>
                </Tile>
              </div>
            ) : null}
            <Pagination
              forwardText="Next page"
              backwardText="Previous page"
              page={currentPage}
              pageSize={currentPageSize}
              pageSizes={pageSizes}
              totalItems={tableRows?.length}
              className={styles.pagination}
              onChange={({ pageSize, page }) => {
                if (pageSize !== currentPageSize) {
                  setPageSize(pageSize);
                }
                if (page !== currentPage) {
                  goTo(page);
                }
              }}
            />
          </TableContainer>
        )}
      </DataTable>
    );
  }
};

export default ObjectiveFindings;
