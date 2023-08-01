import {
  Button,
  DataTable,
  DataTableHeader,
  DataTableSkeleton,
  Dropdown,
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
  Tile,
} from '@carbon/react';
import { Add } from '@carbon/react/icons';
import { isDesktop, showModal, useLayoutType, usePagination } from '@openmrs/esm-framework';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFacilities, useFacilityRegions } from './facility-list.resource';
import styles from './ug-emr-facilities.scss';

type FilterProps = {
  rowIds: Array<string>;
  headers: Array<DataTableHeader>;
  cellsById: any;
  inputValue: string;
  getCellId: (row, key) => string;
};

function AddMenu({
  facility,
  status,
  uniqueIdentifier,
}: {
  facility: string;
  status: string;
  uniqueIdentifier: string;
}) {
  const { t } = useTranslation();
  const launchAddVisitToQueueModal = useCallback(() => {
    const dispose = showModal('set-facility-identifier', {
      closeModal: () => dispose(),
      facility,
      status,
      uniqueIdentifier,
    });
  }, [facility, status, uniqueIdentifier]);

  return (
    <Button
      kind="ghost"
      onClick={launchAddVisitToQueueModal}
      iconDescription={t('setHospitalIdentifierTooltip', 'Set Identifier')}
      renderIcon={(props) => <Add size={16} {...props} />}
    >
      {t('setHospitalIdentifier', 'Set Identifier')}
    </Button>
  );
}

const FacilityList: React.FC = () => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const [allRows, setAllRows] = useState([]);
  const isTablet = useLayoutType() === 'tablet';

  // facilities
  const { facilities, isError, isLoading } = useFacilities();

  // regions
  const { regions } = useFacilityRegions();

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);
  const { goTo, results: paginatedFacilityEntries, currentPage } = usePagination(facilities, currentPageSize);

  const tableHeaders = [
    { id: 0, key: 'name', header: t('facilityName', 'Facility Name'), isSortable: true },
    { id: 1, key: 'status', header: t('status', 'Status') },
    { id: 2, key: 'subCounty', header: t('subCounty', 'Subcounty') },
    { id: 3, key: 'address', header: t('address', 'Address') },
    { id: 4, key: 'uniqueIdentifier', header: t('uniqueIdentifier', 'Unique Identifier'), isSortable: true },
    { id: 5, key: 'historicalIdentifier', header: t('uniqueIdentifier', 'Historical Identifier'), isSortable: true },
    { id: 6, key: 'action', header: t('actionHeader', 'Action') },
  ];
  const headerTitle = 'Facilities';

  // memoized
  useEffect(() => {
    let rows = [];

    paginatedFacilityEntries.map((facility) => {
      return rows.push({
        id: facility.resource.id,
        name: facility.resource.name,
        status: facility.resource.status,
        subCounty: facility.resource.partOf.display,
        address: facility.resource.address.text,
        uniqueIdentifier: facility.resource.extension.find((id: { url: string }) => id.url === 'uniqueIdentifier')
          .valueString,
        historicalIdentifier: facility.resource.extension.find(
          (id: { url: string }) => id.url === 'historicalIdentifier',
        ).valueCode,
      });
    });
    setAllRows(rows);
  }, [paginatedFacilityEntries, allRows]);

  const handleFilter = ({ rowIds, headers, cellsById, inputValue, getCellId }: FilterProps): Array<string> => {
    return rowIds.filter((rowId) =>
      headers.some(({ key }) => {
        const cellId = getCellId(rowId, key);
        const filterableValue = cellsById[cellId].value;
        const filterTerm = inputValue.toLowerCase();

        if (typeof filterableValue === 'boolean') {
          return false;
        }

        return ('' + filterableValue).toLowerCase().includes(filterTerm);
      }),
    );
  };

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  return (
    <>
      <DataTable
        data-floating-menu-container
        rows={allRows}
        headers={tableHeaders}
        filterRows={handleFilter}
        isSortable
        overflowMenuOnHover={isDesktop(layout) ? true : false}
        size={isTablet ? 'lg' : 'sm'}
        useZebraStyles
      >
        {({ rows, headers, getHeaderProps, getTableProps, onInputChange }) => (
          <div>
            <TableContainer title={headerTitle}>
              <TableToolbar
                style={{ position: 'static', height: '3rem', overflow: 'visible', backgroundColor: 'color' }}
              >
                <TableToolbarContent className={styles.toolbarContent}>
                  <div className={styles.filterContainer}>
                    <Dropdown
                      id="regionsFilter"
                      titleText={t('showFacilitiesFor', 'Show facilities for') + ':'}
                      type="inline"
                      items={[{ display: `${t('all', 'All')}` }, ...regions]}
                      itemToString={(item) => (item ? item?.resource?.name : '')}
                      size="sm"
                    />
                  </div>
                  <Layer>
                    <TableToolbarSearch
                      className={styles.search}
                      onChange={onInputChange}
                      placeholder={t('searchThisList', 'Search this list')}
                      size="lg"
                    />
                  </Layer>
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
                  {rows.map((row, index) => (
                    <TableRow key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                      <TableCell>
                        <AddMenu
                          facility={allRows?.[index].name}
                          status={allRows?.[index].status}
                          uniqueIdentifier={allRows?.[index].uniqueIdentifier}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {rows.length === 0 ? (
                <div className={styles.tileContainer}>
                  <Tile className={styles.tile}>
                    <div className={styles.tileContent}>
                      <p className={styles.content}>{t('noFacilitiesToDisplay', 'No facilities to display')}</p>
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
                totalItems={20}
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
          </div>
        )}
      </DataTable>
    </>
  );
};

export default FacilityList;
