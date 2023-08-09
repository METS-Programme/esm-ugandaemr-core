import {
  Button,
  DataTable,
  DataTableHeader,
  DataTableSkeleton,
  DefinitionTooltip,
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
import { Add } from '@carbon/react/icons';

import { ExtensionSlot, isDesktop, useLayoutType, usePagination, useSession } from '@openmrs/esm-framework';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getOriginFromPathName } from '../active-visits/active-visits-table.resource';
import EditActionsMenu from '../active-visits/edit-action-menu.components';
import PrintActionsMenu from '../active-visits/print-action-menu.components';
import { buildStatusString, formatWaitTime, getTagColor, getTagType, trimVisitNumber } from '../helpers/functions';
import {
  useSelectedQueueLocationUuid,
  useSelectedQueueRoomLocationName,
  useSelectedQueueRoomLocationUuid,
} from '../helpers/helpers';
import { useQueueRoomLocations } from '../patient-search/hooks/useQueueRooms';
import PatientSearch from '../patient-search/patient-search.component';
import StatusIcon from '../queue-entry-table-components/status-icon.component';
import { SearchTypes } from '../types';
import { usePatientQueuesList } from './active-visits-reception.resource';
import styles from './active-visits-reception.scss';

type FilterProps = {
  rowIds: Array<string>;
  headers: Array<DataTableHeader>;
  cellsById: any;
  inputValue: string;
  getCellId: (row, key) => string;
};

function ActiveVisitsReceptionTable() {
  const { t } = useTranslation();
  const session = useSession();
  const userLocation = session?.sessionLocation?.display;
  const { queueRoomLocations } = useQueueRoomLocations(session?.sessionLocation?.uuid);
  const currentQueueLocationUuid = useSelectedQueueLocationUuid();

  const [showOverlay, setShowOverlay] = useState(false);
  const [view, setView] = useState('');
  const [viewState, setViewState] = useState<{ selectedPatientUuid: string }>(null);

  const currentQueueRoomLocationUuid = useSelectedQueueRoomLocationUuid();
  const currentQueueRoomLocationName = useSelectedQueueRoomLocationName();

  const { patientQueueEntries, isLoading } = usePatientQueuesList(currentQueueRoomLocationUuid);
  const currentPathName: string = window.location.pathname;

  const fromPage: string = getOriginFromPathName(currentPathName);

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);
  const [overlayHeader, setOverlayTitle] = useState('');
  const layout = useLayoutType();
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
        header: t('currentlocation', 'Current Location'),
        key: 'location',
      },
      {
        id: 4,
        header: t('status', 'Status'),
        key: 'status',
      },
      {
        id: 5,
        header: t('provider', 'Provider'),
        key: 'provider',
      },
      {
        id: 6,
        header: t('waitTime', 'Wait time'),
        key: 'waitTime',
      },
      {
        id: 7,
        header: t('actions', 'Actions'),
        key: 'actions',
      },
    ],
    [t],
  );

  const tableRows = useMemo(() => {
    return paginatedQueueEntries?.map((entry) => ({
      ...entry,
      visitNumber: {
        content: <span>{trimVisitNumber(entry.visitNumber)}</span>,
      },
      name: {
        content: <span>{entry.name}</span>,
      },
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
      location: {
        content: <span> {entry.queueRoom} </span>,
      },
      status: {
        content: (
          <span className={styles.statusContainer}>
            <StatusIcon status={entry.status.toLowerCase()} />
            <span>{buildStatusString(entry.status.toLowerCase())}</span>
          </span>
        ),
      },
      provider: {
        content: <span>Provider Name</span>,
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
            <EditActionsMenu to={`\${openmrsSpaBase}/patient/${entry?.patientUuid}/edit`} from={fromPage} />
            <PrintActionsMenu patient={entry} />
          </>
        ),
      },
    }));
  }, [fromPage, paginatedQueueEntries, t]);

  const handleFilter = ({ rowIds, headers, cellsById, inputValue, getCellId }: FilterProps): Array<string> => {
    return rowIds.filter((rowId) =>
      headers.some(({ key }) => {
        const cellId = getCellId(rowId, key);
        const filterableValue = cellsById[cellId].value;
        const filterTerm = inputValue.toLowerCase();

        if (typeof filterableValue === 'boolean') {
          return false;
        }
        if (filterableValue.hasOwnProperty('content')) {
          if (Array.isArray(filterableValue.content.props.children)) {
            return ('' + filterableValue.content.props.children[1].props.children).toLowerCase().includes(filterTerm);
          }
          if (typeof filterableValue.content.props.children === 'object') {
            return ('' + filterableValue.content.props.children.props.children).toLowerCase().includes(filterTerm);
          }
          return ('' + filterableValue.content.props.children).toLowerCase().includes(filterTerm);
        }
        return ('' + filterableValue).toLowerCase().includes(filterTerm);
      }),
    );
  };

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (patientQueueEntries?.length) {
    return (
      <div className={styles.container}>
        <div className={styles.headerBtnContainer}></div>
        <div className={styles.headerContainer}>
          <div className={!isDesktop(layout) ? styles.tabletHeading : styles.desktopHeading}>
            <span className={styles.heading}>{`Checked In Patients`}</span>
          </div>
          {/* <UserHasAccess privilege={PRIVILEGE_CHECKIN}> */}
          <div className={styles.headerButtons}>
            <ExtensionSlot
              extensionSlotName="patient-search-button-slot"
              state={{
                buttonText: t('checkIn', 'CheckIn'),
                overlayHeader: t('checkIn', 'CheckIn'),
                buttonProps: {
                  kind: 'secondary',
                  renderIcon: (props) => <Add size={16} {...props} />,
                  size: 'sm',
                },
                selectPatientAction: (selectedPatientUuid) => {
                  setShowOverlay(true);
                  setView(SearchTypes.VISIT_FORM);
                  setViewState({ selectedPatientUuid });
                  setOverlayTitle(t('checkIn', 'Check In'));
                },
              }}
            />
          </div>
          {/* </UserHasAccess> */}
        </div>

        <DataTable
          data-floating-menu-container
          filterRows={handleFilter}
          headers={tableHeaders}
          rows={tableRows}
          isSortable
          useZebraStyles
          overflowMenuOnHover={isDesktop(layout) ? true : false}
        >
          {({ rows, headers, getHeaderProps, getTableProps, getRowProps, onInputChange }) => (
            <TableContainer className={styles.tableContainer}>
              <TableToolbar
                style={{ position: 'static', height: '3rem', overflow: 'visible', backgroundColor: 'color' }}
              >
                <TableToolbarContent className={styles.toolbarContent}>
                  <Layer>
                    <TableToolbarSearch
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
                    <Button
                      kind="ghost"
                      size="sm"
                      renderIcon={(props) => <Add size={16} {...props} />}
                      onClick={() => setShowOverlay(true)}
                    >
                      {t('addPatientToList', 'Add patient to list')}
                    </Button>
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
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerBtnContainer}></div>
      <div className={styles.headerContainer}>
        <div className={!isDesktop(layout) ? styles.tabletHeading : styles.desktopHeading}>
          <span className={styles.heading}>{`Checked In Patients`}</span>
        </div>
        {/* <UserHasAccess privilege={PRIVILEGE_CHECKIN}> */}
        <div className={styles.headerButtons}>
          <ExtensionSlot
            extensionSlotName="patient-search-button-slot"
            state={{
              buttonText: t('checkIn', 'CheckIn'),
              overlayHeader: t('checkIn', 'CheckIn'),
              buttonProps: {
                kind: 'secondary',
                renderIcon: (props) => <Add size={16} {...props} />,
                size: 'sm',
              },
              selectPatientAction: (selectedPatientUuid) => {
                setShowOverlay(true);
                setView(SearchTypes.VISIT_FORM);
                setViewState({ selectedPatientUuid });
                setOverlayTitle(t('checkIn', 'Check In'));
              },
            }}
          />
        </div>
        {/* </UserHasAccess> */}
      </div>
    </div>
  );
}

export default ActiveVisitsReceptionTable;
