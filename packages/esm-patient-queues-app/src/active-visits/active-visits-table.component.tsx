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
  Tile,
} from '@carbon/react';

import { isDesktop, useLayoutType, usePagination, userHasAccess, useSession } from '@openmrs/esm-framework';
import React, { AnchorHTMLAttributes, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  buildStatusString,
  formatWaitTime,
  getProviderTagColor,
  getTagColor,
  trimVisitNumber,
} from '../helpers/functions';
import StatusIcon from '../queue-entry-table-components/status-icon.component';
import { getOriginFromPathName } from './active-visits-table.resource';
import styles from './active-visits-table.scss';
import EditActionsMenu from './edit-action-menu.components';
import { usePatientQueuesList } from './patient-queues.resource';
import PickPatientActionMenu from '../queue-entry-table-components/pick-patient-queue-entry-menu.component';
import ViewActionsMenu from './view-action-menu.components';
import NotesActionsMenu from './notes-action-menu.components';
import { PRIVILEGE_ENABLE_EDIT_DEMOGRAPHICS } from '../constants';
import PatientSearch from '../patient-search/patient-search.component';
import { QueueStatus } from '../utils/utils';

interface ActiveVisitsTableProps {
  status: string;
}

export interface PatientQueueInfoProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  patientUuid: string;
  patientName: string;
}

const ActiveVisitsTable: React.FC<ActiveVisitsTableProps> = ({ status }) => {
  const { t } = useTranslation();
  const session = useSession();
  const layout = useLayoutType();

  const { patientQueueEntries, isLoading } = usePatientQueuesList(
    session?.sessionLocation?.uuid,
    status,
    session.user.systemId,
  );

  const [showOverlay, setShowOverlay] = useState(false);
  const [view, setView] = useState('');
  const [viewState, setViewState] = useState<{ selectedPatientUuid: string }>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [overlayHeader, setOverlayTitle] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);

  const currentPathName: string = window.location.pathname;
  const fromPage: string = getOriginFromPathName(currentPathName);

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);
  const { goTo, results: paginatedQueueEntries, currentPage } = usePagination(patientQueueEntries, currentPageSize);

  const handleSearchInputChange = useCallback((event) => {
    const searchText = event?.target?.value?.trim().toLowerCase();
    setSearchTerm(searchText);
  }, []);

  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const filteredResults = searchTerm
      ? patientQueueEntries.filter((patient) => patient.name.toLowerCase().includes(lowercasedTerm))
      : patientQueueEntries;

    setFilteredPatients(filteredResults);
  }, [searchTerm, patientQueueEntries]);

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
        header: t('provider', 'Provider'),
        key: 'provider',
      },
      {
        id: 3,
        header: t('status', 'Status'),
        key: 'status',
      },
      {
        id: 4,
        header: t('waitTime', 'Wait time'),
        key: 'waitTime',
      },
      {
        id: 5,
        header: t('actions', 'Actions'),
        key: 'actions',
      },
    ],
    [t],
  );

  const filteredPatientQueueEntries = useMemo(() => {
    let entries;
    switch (status) {
      case QueueStatus.Completed:
        entries = paginatedQueueEntries.filter((entry) => entry.status === 'COMPLETED');
        break;
      case '':
        entries = paginatedQueueEntries.filter((entry) => entry.status === 'PENDING' || entry.status === 'PICKED');
        break;
      default:
        entries = paginatedQueueEntries.filter((entry) => entry.status === status);
        break;
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      entries = entries.filter((entry) => entry.name.toLowerCase().includes(lowercasedTerm));
    }

    // Sorting entries such that those with picked come first
    entries.sort((a, b) => {
      if (a.status === 'PICKED' && b.status !== 'PICKED') {
        return 1;
      } else if (a.status !== 'PICKED' && b.status === 'PICKED') {
        return -1;
      }
      return 0;
    });

    return entries;
  }, [paginatedQueueEntries, searchTerm, status]);

  const tableRows = useMemo(() => {
    return filteredPatientQueueEntries?.map((entry) => ({
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
      actions: {
        content: (
          <>
            {entry.status === 'COMPLETED' ||
              (entry.status === 'PENDING' && (
                <>
                  <PickPatientActionMenu queueEntry={entry} closeModal={() => true} />
                  {session?.user && userHasAccess(PRIVILEGE_ENABLE_EDIT_DEMOGRAPHICS, session.user) && (
                    <EditActionsMenu to={`\${openmrsSpaBase}/patient/${entry?.patientUuid}/edit`} from={fromPage} />
                  )}
                </>
              ))}
            <ViewActionsMenu to={`\${openmrsSpaBase}/patient/${entry?.patientUuid}/chart`} from={fromPage} />
            <NotesActionsMenu note={entry} />
          </>
        ),
      },
    }));
  }, [filteredPatientQueueEntries, session.user, t, fromPage]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  return (
    <div className={styles.container}>
      <DataTable
        data-floating-menu-container
        headers={tableHeaders}
        overflowMenuOnHover={isDesktop(layout)}
        rows={tableRows}
        useZebraStyles
      >
        {({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
          <TableContainer className={styles.tableContainer}>
            <TableToolbar style={{ position: 'static', height: '3rem', overflow: 'visible', backgroundColor: 'color' }}>
              <TableToolbarContent className={styles.toolbarContent}>
                <Layer>
                  <TableToolbarSearch
                    expanded
                    className={styles.search}
                    onChange={handleSearchInputChange}
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
      {showOverlay && (
        <PatientSearch
          view={view}
          closePanel={() => setShowOverlay(false)}
          viewState={{
            selectedPatientUuid: viewState.selectedPatientUuid,
          }}
          headerTitle={overlayHeader}
        />
      )}
    </div>
  );
};
export default ActiveVisitsTable;
