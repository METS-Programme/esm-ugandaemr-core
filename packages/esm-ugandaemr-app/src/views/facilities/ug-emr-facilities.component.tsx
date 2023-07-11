import {
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
import { isDesktop, useLayoutType, usePagination } from '@openmrs/esm-framework';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFacilities, useFacilityRegions } from './ug-emr-facilities.resource';
import styles from './ug-emr-facilities.scss';

type FilterProps = {
  rowIds: Array<string>;
  headers: Array<DataTableHeader>;
  cellsById: any;
  inputValue: string;
  getCellId: (row, key) => string;
};

export const filterFacilitiesByName = (searchTerm: string, facilities: Array<any>) => {
  return facilities.filter((facility) => facility.name.includes(searchTerm));
};

const FacilitiesList: React.FC = () => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const [allRows, setAllRows] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const isTablet = useLayoutType() === 'tablet';

  const [searchTerm, setSearchTerm] = useState();
  // facilities
  const { facilities, isError, isLoading } = useFacilities();

  // regions
  const { regions } = useFacilityRegions();

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(50);
  const { goTo, results: paginatedFacilityEntries, currentPage } = usePagination(facilities ?? [], 100);

  const tableHeaders = [
    { id: 0, key: 'name', header: t('facilityName', 'Facility Name'), isSortable: true },
    { id: 1, key: 'status', header: t('status', 'Status') },
    { id: 2, key: 'subCounty', header: t('subCounty', 'Subcounty') },
    { id: 3, key: 'address', header: t('address', 'Address') },
    { id: 4, key: 'dhisIdentifier', header: t('dhisIdentifier', 'DHIS Identifier'), isSortable: true },
    { id: 5, key: 'historicalIdentifier', header: t('uniqueIdentifier', 'Historical Identifier'), isSortable: true },
  ];
  const headerTitle = 'Facilities';

  useEffect(() => {
    let rows = [];
    for (let facility of paginatedFacilityEntries) {
      rows.push({
        name: facility.resource.name,
        status: facility.resource.status,
        subCounty: facility.resource.partOf.display,
        address: facility.resource.address.text,
        dhisIdentifier: facility.resource.extension.find((id: { url: string }) => id.url === 'uniqueIdentifier')
          .valueString,
        historicalIdentifier: facility.resource.extension.find(
          (id: { url: string }) => id.url === 'historicalIdentifier',
        ).valueCode,
      });
    }
    setAllRows(rows);
  }, [paginatedFacilityEntries,allRows]);

  const handleSearch = useCallback(
    (searchTerm) => {
      setSearchTerm(searchTerm);
      const filtrate = filterFacilitiesByName(searchTerm, allRows);
      setFilteredResults(filtrate);
      return true;
    },
    [searchTerm],
  );

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
        {({ rows, headers, getHeaderProps, getTableProps, getRowProps,onInputChange }) => (
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
                  <TableRow >
                    {headers.map((header) => (
                      <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row,index) => (
                    <TableRow key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
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
                totalItems={allRows?.length}
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

export default FacilitiesList;
