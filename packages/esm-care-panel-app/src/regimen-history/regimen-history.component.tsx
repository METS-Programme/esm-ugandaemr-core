import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePagination, usePatient } from '@openmrs/esm-framework';
import { configSchema } from '../config-schema';
import { usePatientObservations } from '../vl-history/vl-history.resource';
import {
  DataTable,
  DataTableSkeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tile,
  Pagination,
} from '@carbon/react';
import styles from '../dsdm-history/dsdm-history.scss';
import dayjs from 'dayjs';

interface regimenHistoryProps {
  patientUuid: string;
}

const RegimenHistory: React.FC<regimenHistoryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { patient } = usePatient(patientUuid);
  const observationConfig = useMemo(
    () => [
      {
        key: 'regimenChangeAction',
        uuidConfig: configSchema.regimenChangeActionUuid._default,
      },
      {
        key: 'priorArvRegimen',
        uuidConfig: configSchema.priorArvRegimenUuid._default,
      },
      {
        key: 'currentArvRegimen',
        uuidConfig: configSchema.currentRegimenUuid._default,
      },
    ],
    [],
  );

  const regimenHistoryConceptUuids = observationConfig.map((config) => config.uuidConfig);

  const { observations, isLoading } = usePatientObservations(patientUuid, regimenHistoryConceptUuids);
  console.info(observations);

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);

  const tableHeaders = [
    { id: 0, header: t('regimenChangeDate', 'Date'), key: 'regimenChangeDate' },
    { id: 1, header: t('regimenChangeAction', 'Regimen Change Action'), key: 'regimenChangeAction' },
    { id: 2, header: t('priorArvRegimen', 'Prior ARV Regimen'), key: 'priorArvRegimen' },
    { id: 2, header: t('currentArvRegimen', 'Current ARV Regimen'), key: 'currentArvRegimen' },
  ];

  const tableRows = useMemo(() => {
    if (!observations) return [];

    return observations?.filter((item) =>
      item?.code?.coding
        ?.some((coding) => coding.code === configSchema.priorArvRegimenUuid._default)
        .map((item) => {
          const date = item?.effectiveDateTime ? dayjs(item?.effectiveDateTime).format('DD-MM-YYYY') : '';
          const priorArvRegimen = item?.valueCodeableConcept?.coding[0]?.display || '';
        }),
    );
  }, [observations]);

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

export default RegimenHistory;
