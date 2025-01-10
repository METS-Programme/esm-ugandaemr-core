import React, { AnchorHTMLAttributes, useCallback, useMemo, useState } from 'react';

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
  Toggle,
} from '@carbon/react';

import { useTranslation } from 'react-i18next';
import { useSession, useLayoutType, usePagination, isDesktop } from '@openmrs/esm-framework';
import { useParentLocation } from '../patient-queues.resource';
import { getOriginFromPathName } from '../active-visits-table.resource';
import {
  buildStatusString,
  formatWaitTime,
  getProviderTagColor,
  getTagColor,
  trimVisitNumber,
} from '../../helpers/functions';
import StatusIcon from '../../queue-entry-table-components/status-icon.component';
import PickPatientActionMenu from '../../queue-entry-table-components/pick-patient-queue-entry-menu.component';
import ViewActionsMenu from '../view-action-menu.components';
import NotesActionsMenu from '../notes-action-menu.components';
import styles from '../active-visits-table.scss';
import { QueueStatus } from '../../utils/utils';
import { getLocationByUuid, usePatientQueuesList } from './active-visits-clinical.resource';

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
  const [isToggled, setIsToggled] = useState(false);

  const [locationTags, setLocationTags] = useState([]);

  const handleToggleChange = () => {
    setIsToggled(!isToggled);
  };
  const { location } = useParentLocation(session?.sessionLocation?.uuid);

  const activeLocationUuid = isToggled ? location?.parentLocation?.uuid : session?.sessionLocation?.uuid;

  const { patientQueueEntries, isLoading } = usePatientQueuesList(activeLocationUuid || '', status, isToggled);

  const [searchTerm, setSearchTerm] = useState('');

  const currentPathName: string = window.location.pathname;
  const fromPage: string = getOriginFromPathName(currentPathName);

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);
  const { goTo, results: paginatedQueueEntries, currentPage } = usePagination(patientQueueEntries, currentPageSize);

  const handleSearchInputChange = useCallback((event) => {
    const searchText = event?.target?.value?.trim().toLowerCase();
    setSearchTerm(searchText);
  }, []);

  getLocationByUuid(session?.sessionLocation?.uuid).then((resp) => {
    const excludedUuids = ['c0e1d1d8-c97d-4869-ba16-68d351d3d5f5', '1d3e4224-382a-11ee-be56-0242ac120002'];
    const filteredTags = resp.data?.tags.filter((tag) => !excludedUuids.includes(tag.uuid));

    if (filteredTags.length > 0) {
      setLocationTags(filteredTags);
    }
  });

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
    let entries = paginatedQueueEntries || [];

    // Filter by `status`
    switch (status) {
      case QueueStatus.Completed:
        entries = entries.filter((entry) => entry.status === 'COMPLETED');
        break;
      case '':
        entries = entries.filter((entry) => entry.status === 'PENDING' || entry.status === 'PICKED');
        break;
      default:
        entries = entries.filter((entry) => entry.status === status);
        break;
    }

    // Filter by `locationTags` on the already filtered `entries`
    if (locationTags?.length) {
      entries = entries.filter((entry) =>
        entry?.locationTags?.some((tag) => locationTags.some((locTag) => locTag.uuid === tag.uuid)),
      );
    }

    // Filter by `searchTerm` if provided
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      entries = entries.filter((entry) => entry.name.toLowerCase().includes(lowercasedTerm));
    }

    // Sort entries based on `status` and creation time
    entries.sort((a, b) => {
      if (a.status === 'PICKED' && b.status !== 'PICKED') {
        return 1;
      } else if (a.status !== 'PICKED' && b.status === 'PICKED') {
        return -1;
      }
      const aCreatedTime = new Date(a.dateCreated).getTime();
      const bCreatedTime = new Date(b.dateCreated).getTime();

      return aCreatedTime - bCreatedTime;
    });

    return entries;
  }, [paginatedQueueEntries, searchTerm, status, locationTags]); // Added `locationTags` as dependency

  const tableRows = useMemo(() => {
    return filteredPatientQueueEntries.map((entry) => ({
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
          <div style={{ display: 'flex' }}>
            {entry.status === 'PENDING' && (
              <>
                <PickPatientActionMenu queueEntry={entry} closeModal={() => true} />
              </>
            )}
            <ViewActionsMenu to={`\${openmrsSpaBase}/patient/${entry?.patientUuid}/chart`} from={fromPage} />

            <NotesActionsMenu note={entry} />
          </div>
        ),
      },
    }));
  }, [filteredPatientQueueEntries, session.user, t, fromPage]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  return (
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
  );
};
export default ActiveClinicalVisitsTable;
