import React, { useCallback, useMemo, useState } from 'react';

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
  TableToolbarContent,
  TableToolbarSearch,
  Tag,
  Tile,
} from '@carbon/react';
import { Add } from '@carbon/react/icons';

import { ExtensionSlot, isDesktop, useLayoutType, usePagination, useSession } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import { getOriginFromPathName } from '../active-visits-table.resource';
import EditActionsMenu from '../edit-action-menu.components';
import PrintActionsMenu from '../print-action-menu.components';
import { buildStatusString, formatWaitTime, getTagColor, trimVisitNumber } from '../../helpers/functions';
import StatusIcon from '../../queue-entry-table-components/status-icon.component';
import { usePatientQueuesList } from './active-visits-reception.resource';
import styles from './active-visits-reception.scss';
import { useParentLocation } from '../patient-queues.resource';
import QueueLauncher from '../../components/queue-launcher/queue-launcher.component';

function ActiveVisitsReceptionTable() {
  const { t } = useTranslation();
  const session = useSession();
  const layout = useLayoutType();

  const [viewState, setViewState] = useState<{ selectedPatientUuid: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { location } = useParentLocation(session?.sessionLocation?.uuid);

  const { patientQueueEntries, isLoading } = usePatientQueuesList(location?.parentLocation?.uuid);

  const currentPathName: string = window.location.pathname;

  const fromPage: string = getOriginFromPathName(currentPathName);

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);
  const { goTo, results: paginatedQueueEntries, currentPage } = usePagination(patientQueueEntries, currentPageSize);

  const handleSearchInputChange = useCallback((event) => {
    const searchText = event?.target?.value?.trim().toLowerCase();
    setSearchTerm(searchText);
  }, []);

  const tableHeaders = useMemo(
    () => [
      { id: 0, header: t('visitNumber', 'Visit Number'), key: 'visitNumber' },
      { id: 1, header: t('name', 'Name'), key: 'name' },
      { id: 2, header: t('currentlocation', 'Current Location'), key: 'location' },
      { id: 3, header: t('status', 'Status'), key: 'status' },
      { id: 4, header: t('waitTime', 'Wait time'), key: 'waitTime' },
      { id: 5, header: t('actions', 'Actions'), key: 'actions' },
    ],
    [t],
  );

  const filteredPatientQueueEntries = useMemo(() => {
    let entries = paginatedQueueEntries || [];

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      entries = entries.filter((entry) => entry.name?.toLowerCase().includes(lowercasedTerm));
    }

    entries.sort((a, b) => {
      const aCreatedTime = new Date(a.dateCreated).getTime();
      const bCreatedTime = new Date(b.dateCreated).getTime();
      return aCreatedTime - bCreatedTime;
    });

    return entries;
  }, [paginatedQueueEntries, searchTerm]);

  // Prepare table rows
  const tableRows = useMemo(() => {
    return filteredPatientQueueEntries.map((entry) => ({
      ...entry,
      visitNumber: { content: <span>{trimVisitNumber(entry.visitNumber)}</span> },
      name: { content: <span>{entry.name}</span> },
      location: { content: <span>{entry.queueRoom}</span> },
      status: {
        content: (
          <span className={styles.statusContainer}>
            <StatusIcon status={entry.status?.toLowerCase()} />
            <span>{buildStatusString(entry.status?.toLowerCase())}</span>
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
      actions: {
        content: (
          <div style={{ display: 'flex' }}>
            <EditActionsMenu to={`\${openmrsSpaBase}/patient/${entry?.patientUuid}/edit`} from={fromPage} />
            <PrintActionsMenu patient={entry} />
          </div>
        ),
      },
    }));
  }, [filteredPatientQueueEntries, fromPage, t]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <QueueLauncher />
        <div className={styles.headerButtons}>
          <ExtensionSlot
            name="patient-search-button-slot"
            state={{
              buttonText: t('checkIn', 'CheckIn'),
              overlayHeader: t('checkIn', 'CheckIn'),
              buttonProps: {
                kind: 'secondary',
                renderIcon: (props) => <Add size={16} {...props} />,
              },
              selectPatientAction: (selectedPatientUuid) => {
                setViewState({ selectedPatientUuid });
              },
            }}
          />
        </div>
      </div>

      <DataTable
        data-floating-menu-container
        headers={tableHeaders}
        rows={tableRows}
        useZebraStyles
        overflowMenuOnHover={isDesktop(layout)}
      >
        {({ rows, headers, getHeaderProps, getRowProps, getTableProps, getToolbarProps, getTableContainerProps }) => (
          <TableContainer className={styles.tableContainer} {...getTableContainerProps()}>
            <TableToolbar
              {...getToolbarProps()}
              style={{ position: 'static', overflow: 'visible', backgroundColor: 'color' }}
            >
              <TableToolbarContent
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0',
                }}
              >
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>CheckedIn Patients</span>
                <TableToolbarSearch
                  expanded
                  className={styles.search}
                  onChange={handleSearchInputChange}
                  placeholder={t('searchThisList', 'Search this list')}
                  size="sm"
                />
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()} className={styles.activeVisitsTable}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader key={header.key} {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
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
                </Tile>
              </div>
            ) : null}
            <Pagination
              forwardText="Next page"
              backwardText="Previous page"
              page={currentPage}
              pageSize={currentPageSize}
              pageSizes={pageSizes}
              totalItems={filteredPatientQueueEntries?.length || 0} // Updated to use filteredPatientQueueEntries
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

export default ActiveVisitsReceptionTable;
