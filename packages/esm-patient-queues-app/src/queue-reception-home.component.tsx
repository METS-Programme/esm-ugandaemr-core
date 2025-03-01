import React, { useCallback, useMemo, useState } from 'react';
import PatientQueueHeader from './components/patient-queue-header/patient-queue-header.component';
import MetricsCard from './components/patient-queue-metrics/metrics-card.component';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import styles from './queue-reception-home.scss';

import {
  getOriginFromPathName,
  useParentLocation,
  usePatientQueuePages,
} from './active-visits/patient-queues.resource';
import { useServicePointCount } from './components/patient-queue-metrics/clinic-metrics.resource';
import { ExtensionSlot, useSession } from '@openmrs/esm-framework';
import { buildStatusString, formatWaitTime, getTagColor, trimVisitNumber } from './helpers/functions';
import StatusIcon from './queue-entry-table-components/status-icon.component';
import EditActionsMenu from './active-visits/edit-action-menu.components';
import QueueLauncher from './components/queue-launcher/queue-launcher.component';

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
  TableToolbarSearch,
} from '@carbon/react';
import { Add } from '@carbon/react/icons';
import PrintActionsMenu from './active-visits/print-action-menu.components';

const ReceptionHome: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();
  const { location } = useParentLocation(session?.sessionLocation?.uuid);
  const { stats } = useServicePointCount(
    location?.parentLocation?.uuid,
    dayjs(new Date()).format('YYYY-MM-DD'),
    dayjs(new Date()).format('YYYY-MM-DD'),
  );

  const [viewState, setViewState] = useState<{ selectedPatientUuid: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const currentPathName: string = window.location.pathname;

  const fromPage: string = getOriginFromPathName(currentPathName);

  const { isLoading, items, totalCount, currentPageSize, setPageSize, pageSizes, currentPage, setCurrentPage } =
    usePatientQueuePages('', '');

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
    let entries = items || [];

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      entries = entries.filter((entry) => entry?.patient?.person?.display.toLowerCase().includes(lowercasedTerm));
    }

    entries.sort((a, b) => {
      const aCreatedTime = new Date(a.dateCreated).getTime();
      const bCreatedTime = new Date(b.dateCreated).getTime();
      return aCreatedTime - bCreatedTime;
    });

    return entries;
  }, [items, searchTerm]);

  // Prepare table rows
  const tableRows = useMemo(() => {
    return filteredPatientQueueEntries.map((patientqueue, index) => ({
      ...patientqueue,
      id: patientqueue.uuid,
      visitNumber: { content: <span>{trimVisitNumber(patientqueue?.visitNumber)}</span> },
      name: { content: <span>{patientqueue?.patient?.person?.display}</span> },
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
        content: (
          <Tag>
            <span
              className={styles.statusContainer}
              style={{ color: `${getTagColor(`${dayjs().diff(dayjs(patientqueue?.dateCreated), 'minutes')}`)}` }}
            >
              {formatWaitTime(patientqueue?.dateCreated, t)}
            </span>
          </Tag>
        ),
      },
      actions: {
        content: (
          <div style={{ display: 'flex' }}>
            <EditActionsMenu to={`\${openmrsSpaBase}/patient/${patientqueue?.patient?.uuid}/edit`} from={fromPage} />
            <PrintActionsMenu patient={patientqueue} />
          </div>
        ),
      },
    }));
  }, [filteredPatientQueueEntries, fromPage, t]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  return (
    <div>
      <PatientQueueHeader title="Reception" />
      <div className={styles.cardContainer}>
        <MetricsCard
          values={[{ label: 'Patients', value: totalCount }]}
          headerLabel={t('checkedInPatients', 'Checked in patients')}
        />
        <MetricsCard
          values={[{ label: 'Expected Appointments', value: 0 }]}
          headerLabel={t('noOfExpectedAppointments', 'No. Of Expected Appointments')}
        />
        <MetricsCard values={stats} headerLabel={t('currentlyServing', 'No. of Currently being Served')} />
      </div>
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
        <div>
          <DataTable data-floating-menu-container headers={tableHeaders} rows={tableRows} useZebraStyles>
            {({
              rows,
              headers,
              getHeaderProps,
              getRowProps,
              getTableProps,
              getToolbarProps,
              getTableContainerProps,
            }) => (
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
        </div>
      </div>
    </div>
  );
};

export default ReceptionHome;
