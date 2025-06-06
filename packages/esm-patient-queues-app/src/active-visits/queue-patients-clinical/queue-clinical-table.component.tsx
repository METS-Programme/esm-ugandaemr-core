import React, { AnchorHTMLAttributes, useCallback, useEffect, useMemo, useState } from 'react';

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
  Tag,
  Tile,
  Toggle,
  TableToolbarSearch,
} from '@carbon/react';

import { useTranslation } from 'react-i18next';
import { useSession, useLayoutType, isDesktop, useConfig } from '@openmrs/esm-framework';
import { getOriginFromPathName, useParentLocation, usePatientQueuePages } from '../patient-queues.resource';
import {
  buildStatusString,
  formatWaitTime,
  getProviderTagColor,
  getTagColor,
  getWaitTimeInMinutes,
  trimVisitNumber,
} from '../../helpers/functions';
import PickPatientActionMenu from '../pick-queue-patient-action-action.component';
import NotesActionsMenu from '../notes/notes-action-menu.components';
import styles from '../active-visits-table.scss';
import dayjs from 'dayjs';
import StatusIcon, { QueueStatus } from '../../utils/utils';
import { PatientQueueConfig } from '../../config-schema';
import MovetoNextServicePointReassignAction from '../move-to-next-service-point-re-assign-action.component';
import ViewQueuePatientActionMenu from '../view-queue-patient-action-menu.component';

interface ActiveVisitsTableProps {
  status: string;
}

export interface PatientQueueInfoProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  patientUuid: string;
  patientName: string;
}

const ActiveClinicalVisitsTable: React.FC<ActiveVisitsTableProps> = ({ status }) => {
  const { t } = useTranslation();
  const session = useSession();
  const layout = useLayoutType();
  const [searchTerm, setSearchTerm] = useState('');
  const [tick, setTick] = useState(0);

  const { clinicalRoomTag } = useConfig<PatientQueueConfig>();

  const [isToggled, setIsToggled] = useState(false);

  // Use `useCallback` to prevent function recreation on re-renders
  const handleToggleChange = useCallback(() => {
    setIsToggled((prev) => !prev);
  }, []);

  const { location } = useParentLocation(session?.sessionLocation?.uuid);

  const activeLocationUuid = useMemo(
    () => (isToggled ? location?.parentLocation?.uuid : session?.sessionLocation?.uuid),
    [isToggled, location?.parentLocation?.uuid, session?.sessionLocation?.uuid],
  );

  const currentPathName = useMemo(() => window.location.pathname, []);
  const fromPage = useMemo(() => getOriginFromPathName(currentPathName), [currentPathName]);

  const handleSearchInputChange = useCallback((event) => {
    setSearchTerm(event?.target?.value?.trim().toLowerCase());
  }, []);

  const { isLoading, items, totalCount, currentPageSize, setPageSize, pageSizes, currentPage, setCurrentPage } =
    usePatientQueuePages(activeLocationUuid, status, isToggled, true);

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
      { id: 3, header: t('currentlocation', 'Current Location'), key: 'location' },

      {
        id: 4,
        header: t('status', 'Status'),
        key: 'status',
      },
      {
        id: 5,
        header: t('waitTime', 'Wait time'),
        key: 'waitTime',
      },
      {
        id: 6,
        header: t('actions', 'Actions'),
        key: 'actions',
      },
    ],
    [t],
  );

  const filteredPatientQueueEntries = useMemo(() => {
    let entries = items || [];

    // Filter by `status`
    switch (status) {
      case QueueStatus.Completed:
        entries = entries.filter((entry) => entry.status === 'COMPLETED');
        break;
      case QueueStatus.Pending:
        entries = entries.filter((entry) => entry.status === 'PENDING' || entry.status === 'PICKED');
        break;
      default:
        if (status) {
          entries = entries.filter((entry) => entry.status === status);
        }
        break;
    }

    // Filter by `searchTerm` if provided
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      entries = entries.filter((entry) => entry?.patient?.person?.display?.toLowerCase()?.includes(lowercasedTerm));
    }

    // Correct filtering for queueRoom tags
    entries = entries.filter((entry) => entry?.queueRoom?.tags?.some((item) => item.uuid === clinicalRoomTag));

    // Sort entries based on `status` and creation time
    entries.sort((a, b) => {
      if (a.status === 'PICKED' && b.status !== 'PICKED') {
        return 1;
      } else if (a.status !== 'PICKED' && b.status === 'PICKED') {
        return -1;
      }
      return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
    });

    return entries;
  }, [items, searchTerm, status, clinicalRoomTag]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const tableRows = useMemo(() => {
    return filteredPatientQueueEntries.map((patientqueue, index) => ({
      ...patientqueue,
      id: patientqueue.uuid,
      visitNumber: {
        content: <span>{trimVisitNumber(patientqueue.visitNumber)}</span>,
      },
      name: {
        content: patientqueue?.patient?.person?.display,
      },
      provider: {
        content: (
          <Tag>
            <span
              style={{
                color: `${getProviderTagColor(patientqueue?.provider?.identifier, session?.user?.systemId)}`,
              }}
            >
              {patientqueue?.provider?.display}
            </span>
          </Tag>
        ),
      },
      location: { content: <span>{patientqueue?.locationTo?.display}</span> },

      status: {
        content: (
          <span className={styles.statusContainer}>
            <StatusIcon status={patientqueue?.status.toLowerCase()} />
            <span>{buildStatusString(patientqueue?.status.toLowerCase())}</span>
          </span>
        ),
      },
      waitTime: {
        content: (() => {
          const minutes = getWaitTimeInMinutes(patientqueue);

          return (
            <Tag>
              <span
                className={styles.statusContainer}
                style={{
                  color: getTagColor((minutes ?? 0).toString()),
                }}
              >
                {formatWaitTime(minutes, t)}
              </span>
            </Tag>
          );
        })(),
      },
      actions: {
        content: (
          <div style={{ display: 'flex' }}>
            {patientqueue?.status === 'PENDING' && (
              <PickPatientActionMenu queueEntry={patientqueue} closeModal={() => true} />
            )}

            {(patientqueue?.status === 'COMPLETED' || patientqueue?.status === 'PICKED') && (
              <ViewQueuePatientActionMenu
                to={`\${openmrsSpaBase}/patient/${patientqueue?.patient?.uuid}/chart`}
                from={fromPage}
                queueUuid={filteredPatientQueueEntries[index]?.uuid}
              />
            )}

            <NotesActionsMenu note={patientqueue} />

            {patientqueue?.status === 'PENDING' && isToggled && (
              <MovetoNextServicePointReassignAction patientUuid={filteredPatientQueueEntries[index].uuid} />
            )}
          </div>
        ),
      },
    }));
  }, [filteredPatientQueueEntries, session.user, t, fromPage, isToggled]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  return (
    <>
      <DataTable
        data-floating-menu-container
        headers={tableHeaders}
        overflowMenuOnHover={isDesktop(layout)}
        rows={tableRows}
        useZebraStyles
      >
        {({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
          <TableContainer className={styles.tableContainer}>
            <TableToolbar
              style={{
                position: 'static',
                overflow: 'visible',
                backgroundColor: 'color',
              }}
            >
              <TableToolbarContent
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <TableToolbarSearch
                  expanded
                  className={styles.search}
                  onChange={handleSearchInputChange}
                  placeholder={t('searchThisList', 'Search this list')}
                  size="sm"
                />
                <Toggle
                  className={styles.toggle}
                  labelA="My Location"
                  labelB="All Locations"
                  id="all-queue-locations-toggle"
                  toggled={isToggled}
                  onToggle={handleToggleChange}
                />
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()} className={styles.activeVisitsTable}>
              <TableHead>
                <TableRow>
                  {headers
                    .filter((header) => isToggled || header.key !== 'provider')
                    .map((header) => (
                      <TableHeader key={header.key} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.cells
                      .filter((cell, index) => isToggled || headers[index]?.key !== 'provider')
                      .map((cell) => (
                        <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
                      ))}
                  </TableRow>
                ))}
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
          </TableContainer>
        )}
      </DataTable>
      <Pagination
        page={currentPage}
        pageSize={currentPageSize}
        pageSizes={pageSizes}
        totalItems={totalCount}
        onChange={({ page, pageSize }) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
        className={styles.paginationOverride}
      />
    </>
  );
};
export default ActiveClinicalVisitsTable;
