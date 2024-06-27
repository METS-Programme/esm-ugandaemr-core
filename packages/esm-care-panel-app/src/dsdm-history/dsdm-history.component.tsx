import React, { useMemo, useState } from 'react';
import {
  DataTable,
  DataTableSkeleton,
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
import { formatDate, parseDate, usePagination } from '@openmrs/esm-framework';
import styles from './dsdm-history.scss';
import { getAcronym, usePatientPrograms } from '../hooks/usePatientPrograms';

interface dsdmnProps {
  patientUuid: string;
}

const DSDMHistory: React.FC<dsdmnProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const { isLoading, error, dsdmModels } = usePatientPrograms(patientUuid);

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);

  const { goTo, results: paginatedDSDM, currentPage } = usePagination(dsdmModels, currentPageSize);
  let columns = [
    { id: 0, header: t('model', 'Model'), key: 'model' },

    { id: 1, header: t('dateEnrolled', 'Date Enrolled'), key: 'dateEnrolled' },
    { id: 2, header: t('dateCompleted', 'Date Completed'), key: 'dateCompleted' },
  ];

  const tableRows = useMemo(() => {
    const currentDate = new Date();

    return paginatedDSDM?.map((model) => {
      const enrolledDate = model.startDate ? parseDate(model.startDate) : null;
      const formattedEnrolledDate = enrolledDate ? formatDate(enrolledDate) : '';

      const completedDate = model.endDate ? parseDate(model.endDate) : currentDate;
      const formattedCompletedDate = model.endDate ? formatDate(completedDate) : 'Current';

      return {
        ...model,
        id: model?.state?.concept?.uuid,
        model: getAcronym(model?.state?.concept?.display),
        dateEnrolled: formattedEnrolledDate,
        dateCompleted: formattedCompletedDate,
      };
    });
  }, [paginatedDSDM]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

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
              totalItems={dsdmModels?.length}
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

export default DSDMHistory;
