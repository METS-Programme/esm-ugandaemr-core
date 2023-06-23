import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState, fetchPatientList, OTable } from '@ohri/openmrs-esm-ohri-commons-lib';
import {   DataTable,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,DataTableSkeleton, Pagination, Search } from '@carbon/react';

import styles from '../facilities/ug-emr-facilities.scss';
import axios from 'axios';
// const base_Url = 'https://mediator-api-staging.health.go.ug/nhfrApi/v0.0.1/externalSystem/search';
const base_Url = 'https://nhfr-staging-api.planetsystems.co/nhfrApi/v0.0.1/externalSystem/search';


const FacilitiesList: React.FC = () => {
  const { t } = useTranslation();
  const [facilities, setFacilities] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const rowCount = 10;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalFacilityCount, setFacilityCount] = useState(0);
  const [nextOffSet, setNextOffSet] = useState(0);

  const tableHeaders = [
    { key: 'name', header: t('facilityName', 'Facility Name'), isSortable: true },
    { key: 'status', header: t('status', 'Status') },
    { key: 'subCounty', header: t('subCounty', 'Subcounty') },
    { key: 'address', header: t('address', 'Address') },
    { key: 'dhisIdentifier', header: t('dhisIdentifier', 'DHIS Identifier'), isSortable: true },
    { key: 'uniqueIdentifier', header: t('uniqueIdentifier', 'Unique Identifier'), isSortable: true },
  ];
  const headerTitle = 'Facilities';

  // fetch facility records
  useEffect(() => {
    setIsLoading(true);

    // let params = {
    //   count: rowCount,
    // };

    // let auth: {
    //   username: 'postman';
    //   password: 'password';
    // };

    // const token = `${auth.username}:${auth.password}`;
    // const encodedToken = Buffer.from(token).toString('base64');

    const response = axios.get(base_Url).then((resp) => {
      setFacilities(resp.data.entry);
      console.log(resp.data.entry);

      // setFilteredResults(data.data.entry);
      setFacilityCount(resp.data.total);
      setIsLoading(false);
    });

    console.log(response);

    // fetch facility records
    // fetchPatientList(nextOffSet, pageSize).then(({ data }) => {
    //     setFacilities(data.entry);
    //     setFacilityCount(data.total);
    //   setIsLoading(false);
    // });
  }, [page, pageSize]);

  useEffect(() => {
    let rows = [];
    console.log(facilities)
    for (let facility of facilities) {
      rows.push({
        name: facility.resource.name,
        status: facility.resource.status,
        subCounty: facility.resource.partOf.display,
        address: facility.resource.address.text,
        dhisIdentifier: facility.resource.identifier.find((id: { url: string }) => id.url === 'uniqueIdentifier')
          .valueString,
        uniqueIdentifier: facility.resource.identifier.find((id: { url: string }) => id.url === 'uniqueIdentifier')
          .valueString,
      });
    }
    setAllRows(rows);
  }, [facilities]);

  return (
    <>
       {isLoading ? (
        <DataTableSkeleton rowCount={5} columnCount={4} />
      ) : allRows.length > 0 ? (
        <DataTable rows={allRows} headers={tableHeaders} isSortable>
          {({ rows, headers, getHeaderProps, getTableProps }) => (
            <div>
              <TableContainer title={headerTitle}>
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Pagination
                page={page}
                pageSize={pageSize}
                pageSizes={[10, 20, 30, 40, 50]}
                totalItems={totalFacilityCount}
                onChange={({ page, pageSize }) => {
                  setPage(page);
                  setNextOffSet((page - 1) * pageSize);
                  setPageSize(pageSize);
                }}
              />
            </div>
          )}
        </DataTable>
      ) : (
        <EmptyState displayText={headerTitle} headerTitle={headerTitle} />
      )}
    </>
  );
};

export default  FacilitiesList;