import React, { useMemo, useState } from 'react';
import { parseValueString, useViralLoadOservations } from './vl-history.resource';
import { usePagination } from '@openmrs/esm-framework';
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
  Tile,
} from '@carbon/react';
import styles from '../dsdm-history/dsdm-history.scss';
import { useTranslation } from 'react-i18next';

interface ViralLoadProps {
  patientUuid: string;
}

const ViralLoadList: React.FC<ViralLoadProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const { data, isLoading } = useViralLoadOservations(patientUuid);

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);

  const tableHeaders = [
    { id: 0, header: t('hivViralLoadDate', 'Viral Load Date'), key: 'hivViralLoadDate' },
    { id: 1, header: t('hivViralLoadQualitative', 'Viral Load Qualitative'), key: 'hivViralLoadQualitative' },
    { id: 2, header: t('hivViralLoad', 'HIV Viral Load'), key: 'hivViralLoad' },
  ];

  const tableRows = useMemo(() => {
    return data?.map((item) => {
      const { date, qualitative, viralLoad } = parseValueString(item?.valueString || '');

      return {
        id: item?.id,
        hivViralLoadDate: date,
        hivViralLoadQualitative: qualitative,
        hivViralLoad: viralLoad,
      };
    });
  }, [data]);

  const { goTo, results: paginatedData, currentPage } = usePagination(tableRows, currentPageSize);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  return (
    <DataTable rows={paginatedData} headers={tableHeaders} useZebraStyles overflowMenuOnHover={true}>
      {({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
        <TableContainer className={styles.tableContainer}>
          <Table {...getTableProps()} className={styles.activePatientsTable}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow {...getRowProps({ row })} key={row.id}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {rows.length === 0 ? (
            <div className={styles.tileContainer}>
              <Tile className={styles.tile}>
                <div className={styles.tileContent}>
                  <p className={styles.content}>{t('noVlHistoryToDisplay', 'Patient has no viral load history')}</p>
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
};

export default ViralLoadList;
