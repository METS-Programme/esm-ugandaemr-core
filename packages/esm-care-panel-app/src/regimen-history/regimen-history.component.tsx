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
import { usePatientRegimenObservations } from '../regimen-editor/regimen.resource';

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

  const { observations, isLoading } = usePatientRegimenObservations(patientUuid, regimenHistoryConceptUuids);
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

    const groupedRows = observations.reduce((acc, obs) => {
      const resource = obs?.resource;
      const date = resource?.effectiveDateTime;

      if (!date) return acc;

      let row = acc.find((r) => r.regimenChangeDate === dayjs(date).format('DD-MM-YYYY'));

      if (!row) {
        row = {
          id: date,
          regimenChangeDate: dayjs(date).format('DD-MM-YYYY'),
          regimenChangeAction: '',
          priorArvRegimen: '',
          currentArvRegimen: '',
        };
        acc.push(row);
      }

      if (resource?.code?.coding?.some((coding) => coding.code === configSchema.regimenChangeActionUuid._default)) {
        row.regimenChangeAction = resource.valueCodeableConcept?.coding?.[0]?.display || '';
      } else if (resource?.code?.coding?.some((coding) => coding.code === configSchema.priorArvRegimenUuid._default)) {
        row.priorArvRegimen = resource.valueCodeableConcept?.coding?.[0]?.display || '';
      } else if (resource?.code?.coding?.some((coding) => coding.code === configSchema.currentRegimenUuid._default)) {
        row.currentArvRegimen = resource.valueCodeableConcept?.coding?.[0]?.display || '';
      }

      return acc;
    }, []);

    return groupedRows;
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
