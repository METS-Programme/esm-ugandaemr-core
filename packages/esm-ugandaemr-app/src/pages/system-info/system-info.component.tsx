import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Column,
  Grid,
  DataTable,
  DataTableSkeleton,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tile,
} from '@carbon/react';
import { ErrorState } from '@openmrs/esm-framework';
import { useGetModulesInformation } from './system-info.resource';
import styles from './system-info.scss';

const OverallSystemInfo = () => {
  return (
    <Grid className={styles['overall-info-card']}>
      <Column className={styles['info-title']}>
        <Column>
          <p>Government of Uganda</p>
          <p>Ministry of Health</p>
        </Column>
        <Column>
          <img alt="Govt of Uganda Coat of Arms" />
        </Column>
      </Column>
      <Column className={styles['info-body']}>
        <span>Uganda EMR+ Version</span>
        <span>v4.0.0</span>
        <span>SPA Version</span>
        <span>v5.1.0</span>
        <span>Build date time</span>
        <span>25-Aug-2023, 13:35 PM (EAT)</span>
        <span>Facility code</span>
        <span>111111</span>
      </Column>
    </Grid>
  );
};

function SystemInfoTable(): React.JSX.Element {
  const [moduleInfo, setModuleInfo] = useState({});
  const { modules, isError, isLoading } = useGetModulesInformation();

  useEffect(() => {
    if (modules) {
      setModuleInfo(modules['systemInfo']['SystemInfo.title.moduleInformation']);
    }
  }, [modules]);

  const defineTableRows = (obj: {}) => {
    let arr = [];
    Object.keys(obj).forEach((key, i) => {
      return arr.push({
        id: i,
        module_name: key,
        version_number: obj[key],
      });
    });
    return arr;
  };

  const tableRows = React.useMemo(() => defineTableRows(moduleInfo), [moduleInfo]);
  const tableHeaders = [
    {
      header: 'Module Name',
      key: 'module_name',
    },
    {
      header: 'Version Number',
      key: 'version_number',
    },
  ];

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }
  if (isError) {
    return (
      <ErrorState
        headerTitle={t('errorFetchingSytemInformation', 'Error fetching system information')}
        error={isError}
      />
    );
  }
  if (modules) {
    return (
      <DataTable rows={tableRows} headers={tableHeaders}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <Table {...getTableProps()} className={styles['system-info-table']}>
            <TableHead>
              <TableRow>
                {headers.map((header: { header }) => (
                  <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row: { cells }) => {
                return (
                  <TableRow {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </DataTable>
    );
  }
}

const SystemInfoPage = () => {
  return (
    <Tile>
      <OverallSystemInfo />
      <SystemInfoTable />
    </Tile>
  );
};

export default SystemInfoPage;
