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
  Tag,
  Tile,
  Toggle,
  TableToolbarSearch
} from '@carbon/react';

import { useTranslation } from 'react-i18next';
import { useSession, useLayoutType, isDesktop } from '@openmrs/esm-framework';
import { getLocationByUuid, getOriginFromPathName, useParentLocation, usePatientQueuePages } from '../patient-queues.resource';
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
import dayjs from 'dayjs';
import { QueueStatus } from '../../utils/utils';

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
  const [searchTerm,setSearchTerm] = useState("");

  const [isToggled, setIsToggled] = useState(false);

  const [locationTags, setLocationTags] = useState([]);

  const handleToggleChange = () => {
    setIsToggled(!isToggled);
  };
  const { location } = useParentLocation(session?.sessionLocation?.uuid);

  const activeLocationUuid = isToggled ? location?.parentLocation?.uuid : session?.sessionLocation?.uuid;

  const currentPathName: string = window.location.pathname;
  const fromPage: string = getOriginFromPathName(currentPathName);

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

  const { isLoading, items, totalCount, currentPageSize, setPageSize, pageSizes, currentPage, setCurrentPage } =
    usePatientQueuePages(activeLocationUuid, status, isToggled);

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
    let entries = items || [];

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
        entry?.queueRoom?.tags?.some((tag) => locationTags.some((locTag) => locTag.uuid === tag.uuid)),
      );
    }

    // Filter by `searchTerm` if provided
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      entries = entries.filter((entry) => entry?.patient?.person?.display.toLowerCase().includes(lowercasedTerm));
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
  }, [items, searchTerm, status, locationTags]); // Added `locationTags` as dependency

  const tableRows = useMemo(() => {
    return filteredPatientQueueEntries.map((patientqueue, entry) => ({
      ...patientqueue,
      id: patientqueue.uuid,
      visitNumber: {
        content: <span>{trimVisitNumber(patientqueue.visitNumber)}</span>,
      },
      name: {
        content: patientqueue.patient?.display,
      },
      provider: {
        content: (
          <Tag>
            <span
              style={{ color: `${getProviderTagColor(patientqueue?.provider?.display, session.user.person.display)}` }}
            >
              {patientqueue?.provider?.display}
            </span>
          </Tag>
        ),
      },
      status: {
        content: (
          <span className={styles.statusContainer}>
            <StatusIcon status={patientqueue?.status.toLowerCase()} />
            <span>{buildStatusString(patientqueue?.status.toLowerCase())}</span>
          </span>
        ),
      },
      waitTime: {
        content: (
          <Tag>
            <span
              className={styles.statusContainer}
              style={{ color: getTagColor(`${dayjs().diff(dayjs(patientqueue?.dateCreated), 'minutes')}`) }}
            >
              {formatWaitTime(patientqueue?.dateCreated, t)}
            </span>
          </Tag>
        ),
      },
      actions: {
        content: (
          <div style={{ display: 'flex' }}>
            {patientqueue?.status === 'PENDING' && (
              <>
                <PickPatientActionMenu queueEntry={patientqueue} closeModal={() => true} />
              </>
            )}
            <ViewActionsMenu to={`\${openmrsSpaBase}/patient/${patientqueue?.patient?.uuid}/chart`} from={fromPage} />

            <NotesActionsMenu note={patientqueue} />
          </div>
        ),
      },
    }));
  }, [items, session.user, t, fromPage]);

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
