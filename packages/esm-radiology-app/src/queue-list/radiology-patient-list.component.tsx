import React, { useEffect, useState } from 'react';
import {
  DataTable,
  DataTableSkeleton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandHeader,
  TableExpandRow,
  TableHead,
  TableHeader,
  TableRow,
  TabPanel,
} from '@carbon/react';
import { useTranslation } from 'react-i18next';

import { formatDatetime, parseDate } from '@openmrs/esm-framework';
import styles from './radiology-queue.scss';

interface RadiologyPatientListProps {
  searchTerm: string;
  location: string;
  status: string;
}

const RadiologyPatientList: React.FC<RadiologyPatientListProps> = ({ searchTerm, location, status }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [nextOffSet, setNextOffSet] = useState(0);
  const [radiologyQueue, setRadiologyQueue] = useState([]);
  const totalOrders = 0;

  let columns = [
    { header: t('created', 'Created'), key: 'created' },
    { header: t('patientName', 'Patient name'), key: 'patient' },
    { header: t('orderType', 'Order type'), key: 'orderType' },
    { header: t('location', 'Location'), key: 'location' },
    { header: t('status', 'Status'), key: 'status' },
  ];

  useEffect(() => {
    setPage(1);
    setNextOffSet(0);
  }, [searchTerm]);

  return (
    <TabPanel>
      <div className={styles.patientListTableContainer}>
        {/* {isLoading && <DataTableSkeleton role="progressbar" />} */}
        {/* {error && <p>Error</p>} */}
        {radiologyQueue && (
          <>
            <DataTable rows={radiologyQueue} headers={columns} isSortable>
              {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
                <TableContainer>
                  <Table {...getTableProps()} useZebraStyles>
                    <TableHead>
                      <TableRow>
                        <TableExpandHeader />
                        {headers.map((header) => (
                          <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <React.Fragment key={row.id}>
                          <TableExpandRow {...getRowProps({ row })}>
                            {row.cells.map((cell) => (
                              <TableCell key={cell.id}>
                                {cell.id.endsWith('created')
                                  ? formatDatetime(parseDate(cell.value))
                                  : cell.id.endsWith('patient')
                                  ? cell.value.name
                                  : cell.id.endsWith('status')
                                  ? t(cell.value)
                                  : cell.value}
                              </TableCell>
                            ))}
                          </TableExpandRow>
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </DataTable>
            <div style={{ width: '100%' }}>
              <Pagination
                page={page}
                pageSize={pageSize}
                pageSizes={[10, 20, 30, 40, 50, 100]}
                totalItems={totalOrders}
                onChange={({ page, pageSize }) => {
                  setPage(page);
                  setNextOffSet((page - 1) * pageSize);
                  setPageSize(pageSize);
                }}
              />
            </div>
          </>
        )}
      </div>
    </TabPanel>
  );
};

export default RadiologyPatientList;
