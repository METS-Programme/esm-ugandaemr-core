import React, { useEffect, useMemo, useState } from 'react';
import {
  DataTable,
  DataTableSkeleton,
  Layer,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Tag,
} from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { usePatientQueuesList } from '../active-visits/patient-queues.resource';
import { isDesktop, useLayoutType, usePagination, useSession } from '@openmrs/esm-framework';
import {
  buildStatusString,
  formatWaitTime,
  getProviderTagColor,
  getTagColor,
  trimVisitNumber,
} from '../helpers/functions';
import StatusIcon from '../queue-entry-table-components/status-icon.component';
import EmptyState from '../utils/empty-state/empty-state.component';
import styles from './lab-results.scss';
import { getPatientEncounterWithOrders } from './lab-results.resource';

const LabResultsTable = () => {
  const { t } = useTranslation();
  const session = useSession();
  const layout = useLayoutType();

  const { patientQueueEntries, isLoading } = usePatientQueuesList(
    session?.sessionLocation?.uuid,
    'pending',
    session.user.systemId,
  );

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);
  const [labEncounters, setLabEncounters] = useState([]);
  const [filteredQueueEntries, setFilteredQueueEntries] = useState([]);

  const { goTo, results: paginatedQueueEntries, currentPage } = usePagination(patientQueueEntries, currentPageSize);

  // useEffect(() => {
  //   const fetchLabEncountersAndFilter = async () => {
  //     try {
  //       if (paginatedQueueEntries.length > 0) {
  //         const encountersPromises = paginatedQueueEntries.map((item) =>
  //           getPatientEncounterWithOrders({
  //             patientUuid: item?.patient?.uuid,
  //             encountertype: '214e27a1-606a-4b1e-a96e-d736c87069d5',
  //           }),
  //         );

  //         const labEncountersData = await Promise.all(encountersPromises);
  //         const labEncountersResults = labEncountersData.map((res) => res.data.results);
  //         setLabEncounters(labEncountersResults);

  //         // Filter patientQueueEntries based on the presence of lab encounters
  //         const filteredEntries = paginatedQueueEntries.filter((entry) =>
  //           labEncountersResults.some((labEntry) => labEntry?.patient?.uuid === entry?.patient?.uuid),
  //         );

  //         setFilteredQueueEntries(filteredEntries);
  //       } else {
  //         return;
  //       }
  //     } catch (error) {
  //       console.error('Error fetching lab encounters:', error);
  //     }
  //   };

  //   fetchLabEncountersAndFilter();
  // }, [paginatedQueueEntries]);

  const tableHeaders = useMemo(
    () => [
      { id: 0, header: t('visitNumber', 'Visit Number'), key: 'visitNumber' },
      { id: 1, header: t('name', 'Name'), key: 'name' },
      { id: 2, header: t('provider', 'Provider'), key: 'provider' },
      { id: 3, header: t('status', 'Status'), key: 'status' },
      { id: 4, header: t('waitTime', 'Wait time'), key: 'waitTime' },
    ],
    [t],
  );

  const tableRows = useMemo(() => {
    return paginatedQueueEntries.map((entry) => ({
      ...entry,
      visitNumber: {
        content: <span>{trimVisitNumber(entry.visitNumber)}</span>,
      },
      name: {
        content: entry.name,
      },
      provider: {
        content: (
          <Tag>
            <span style={{ color: `${getProviderTagColor(entry.provider, session.user.person.display)}` }}>
              {entry.provider}
            </span>
          </Tag>
        ),
      },
      status: {
        content: (
          <span className={styles.statusContainer}>
            <StatusIcon status={entry.status.toLowerCase()} />
            <span>{buildStatusString(entry.status.toLowerCase())}</span>
          </span>
        ),
      },
      waitTime: {
        content: (
          <Tag>
            <span className={styles.statusContainer} style={{ color: `${getTagColor(entry.waitTime)}` }}>
              {formatWaitTime(entry.waitTime, t)}
            </span>
          </Tag>
        ),
      },
    }));
  }, [paginatedQueueEntries, session.user.person.display, t]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (paginatedQueueEntries?.length) {
    return (
      <div className={styles.container}>
        <DataTable
          data-floating-menu-container
          headers={tableHeaders}
          overflowMenuOnHover={isDesktop(layout)}
          rows={tableRows}
          useZebraStyles
        >
          {({ rows, headers, getHeaderProps, getTableProps, getRowProps, onInputChange }) => (
            <TableContainer className={styles.tableContainer}>
              <TableToolbar
                style={{ position: 'static', height: '3rem', overflow: 'visible', backgroundColor: 'color' }}
              >
                <TableToolbarContent className={styles.toolbarContent}>
                  <Layer>
                    <TableToolbarSearch
                      expanded
                      className={styles.search}
                      onChange={onInputChange}
                      placeholder={t('searchThisList', 'Search this list')}
                      size="sm"
                    />
                  </Layer>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()} className={styles.activeVisitsTable}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <React.Fragment key={row.id}>
                      <TableRow {...getRowProps({ row })}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
                        ))}
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>

              <Pagination
                forwardText="Next page"
                backwardText="Previous page"
                page={currentPage}
                pageSize={currentPageSize}
                pageSizes={pageSizes}
                totalItems={paginatedQueueEntries?.length}
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
      </div>
    );
  }

  return <EmptyState msg="No queue items with lab encounters to display" helper="" />;
};

export default LabResultsTable;
