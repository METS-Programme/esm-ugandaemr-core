import {
  DataTable,
  DataTableSkeleton,
  DefinitionTooltip,
  Dropdown,
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
  Tag,
  Tile,
} from '@carbon/react';
import { usePagination, useSession } from '@openmrs/esm-framework';
import {
  buildStatusString,
  getTagType,
  trimVisitNumber,
} from '@ugandaemr/esm-patient-queues-app/src/helpers/functions';
import {
  updateSelectedQueueRoomLocationName,
  updateSelectedQueueRoomLocationUuid,
  useSelectedQueueRoomLocationName,
  useSelectedQueueRoomLocationUuid,
} from '@ugandaemr/esm-patient-queues-app/src/helpers/helpers';
import { useQueueRoomLocations } from '@ugandaemr/esm-patient-queues-app/src/patient-search/hooks/useQueueRooms';
import StatusIcon from '@ugandaemr/esm-patient-queues-app/src/queue-entry-table-components/status-icon.component';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getOriginFromPathName, usePatientNextRoomQueuesList } from './patients-in-next-room.resource';
import styles from './patients-in-next-room.scss';

function PatientsInNextQueueRoomTable() {
  const { t } = useTranslation();
  const session = useSession();

  const { queueRoomLocations } = useQueueRoomLocations(session?.sessionLocation?.uuid);

  const currentQueueRoomLocationUuid = useSelectedQueueRoomLocationUuid();
  const currentQueueRoomLocationName = useSelectedQueueRoomLocationName();

  const currentPathName: string = window.location.pathname;
  const fromPage: string = getOriginFromPathName(currentPathName);

  const { patientQueueEntries, isLoading } = usePatientNextRoomQueuesList(currentQueueRoomLocationUuid);

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);

  const { goTo, results: paginatedQueueEntries, currentPage } = usePagination(patientQueueEntries, currentPageSize);

  const tableHeaders = useMemo(
    () => [
      {
        id: 0,
        header: t('visitNumber', 'Visit Number'),
        key: 'visitNumber',
      },
      {
        id: 1,
        header: t('name', 'Name'),
        key: 'name',
      },
      {
        id: 2,
        header: t('priority', 'Priority'),
        key: 'priority',
      },
      {
        id: 3,
        header: t('status', 'Status'),
        key: 'status',
      },
    ],
    [t],
  );

  const handleQueueRoomLocationChange = ({ selectedItem }) => {
    updateSelectedQueueRoomLocationUuid(selectedItem.uuid);
    updateSelectedQueueRoomLocationName(selectedItem.display);
  };

  const tableRows = useMemo(() => {
    return paginatedQueueEntries?.map((entry) => ({
      ...entry,
      visitNumber: {
        content: <span>{trimVisitNumber(entry.visitNumber)}</span>,
      },
      name: entry.name,
      priority: {
        content: (
          <>
            {entry?.priorityComment ? (
              <DefinitionTooltip className={styles.tooltip} align="bottom-left" definition={entry.priorityComment}>
                <Tag
                  role="tooltip"
                  className={entry.priority === 'Priority' ? styles.priorityTag : styles.tag}
                  type={getTagType(entry.priority as string)}
                >
                  {entry.priority}
                </Tag>
              </DefinitionTooltip>
            ) : (
              <Tag
                className={entry.priority === 'Priority' ? styles.priorityTag : styles.tag}
                type={getTagType(entry.priority as string)}
              >
                {entry.priority}
              </Tag>
            )}
          </>
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
    }));
  }, [paginatedQueueEntries]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (patientQueueEntries?.length) {
    return (
      <div className={styles.container}>
        <DataTable data-floating-menu-container headers={tableHeaders} rows={tableRows} size="xs" useZebraStyles>
          {({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
            <TableContainer className={styles.tableContainer}>
              <TableToolbar
                style={{ position: 'static', height: '3rem', overflow: 'visible', backgroundColor: 'color' }}
              >
                <TableToolbarContent className={styles.toolbarContent}>
                  <div className={styles.filterContainer}>
                    <Dropdown
                      id="queuelocationFilter"
                      titleText={t('showPatientsIn', 'Show patients in') + ':'}
                      label={currentQueueRoomLocationName ?? queueRoomLocations?.[0]?.display}
                      type="inline"
                      items={[...queueRoomLocations]}
                      itemToString={(item) => (item ? item.display : 'Not Set')}
                      onChange={handleQueueRoomLocationChange}
                      size="sm"
                    />
                  </div>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
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
                        <TableRow {...getRowProps({ row })}>
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
                      <p className={styles.content}>{t('noPatientsToDisplay', 'No patients to display')}</p>
                      <p className={styles.helper}>{t('checkFilters', 'Check the filters above')}</p>
                    </div>
                    <p className={styles.separator}>{t('or', 'or')}</p>
                  </Tile>
                </div>
              ) : null}
              <Pagination
                forwardText="Next page"
                backwardText="Previous page"
                page={currentPage}
                pageSize={currentPageSize}
                pageSizes={pageSizes}
                totalItems={patientQueueEntries?.length}
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
}

export default PatientsInNextQueueRoomTable;
