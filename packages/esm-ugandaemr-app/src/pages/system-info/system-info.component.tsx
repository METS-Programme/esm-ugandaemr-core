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
import { useGetSystemInformation } from './system-info.resource';
import styles from './system-info.scss';
import coatOfArms from '../../images/coat_of_arms.png';
import UpdateFacilityCode from './updateFacilityCodeButton.component';

const OverallSystemInfo = ({ buildInfo, emrVersion }) => {
  const { t } = useTranslation();
  const [facilityCode, setFacilityCode] = useState('-');
  const buildDateTime =
    Object.keys(buildInfo).length > 0
      ? `${buildInfo['SystemInfo.OpenMRSInstallation.systemDate']}, ${buildInfo['SystemInfo.OpenMRSInstallation.systemTime']}`
      : '-';

  // persist facility code to db if n.e else fetch

  return (
    <Grid className={styles['overall-info-card']}>
      <Column className={styles['info-title']}>
        <Column>
          <p>{t('governmentOfUganda', 'Government of Uganda')}</p>
          <p>{t('ministryOfHealth', 'Ministry of Health')}</p>
        </Column>
        <Column>
          <img src={coatOfArms} alt="Govt of Uganda Coat of Arms" height={50} />
        </Column>
      </Column>
      <Column className={styles['info-body']}>
        <span>Uganda EMR+ Version</span>
        <span>{emrVersion}</span>
        <span>SPA Version</span>
        <span>v5.1.0</span>
        <span>Build date time</span>
        <span>{buildDateTime}</span>
        <span>Facility code</span>
        <span>{facilityCode}</span>
      </Column>
      <Column>
        <UpdateFacilityCode setFacilityCode={setFacilityCode} facilityCode={facilityCode} />
      </Column>
    </Grid>
  );
};

function SystemInfoTable({ moduleInfo, error, loading }): React.JSX.Element {
  const { t } = useTranslation();

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

  if (loading) {
    return <DataTableSkeleton role="progressbar" />;
  }
  if (error) {
    return (
      <ErrorState headerTitle={t('errorFetchingSytemInformation', 'Error fetching system information')} error={error} />
    );
  }
  if (moduleInfo) {
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
  const [moduleInfo, setModuleInfo] = useState({});
  const [buildInfo, setBuildInfo] = useState({});
  const [emrVersion, setEMRVersion] = useState('4.0');
  const { systemInfo, isError, isLoading } = useGetSystemInformation();

  useEffect(() => {
    if (systemInfo) {
      delete systemInfo['systemInfo']['SystemInfo.title.moduleInformation']['SystemInfo.Module.repositoryPath'];
      setModuleInfo(systemInfo['systemInfo']['SystemInfo.title.moduleInformation']);
      setBuildInfo(systemInfo['systemInfo']['SystemInfo.title.openmrsInformation']);
    }
  }, [systemInfo]);

  useEffect(() => {
    if (moduleInfo) {
      setEMRVersion(moduleInfo['UgandaEMR']);
    }
  }, [moduleInfo]);

  return (
    <Tile>
      <OverallSystemInfo buildInfo={buildInfo} emrVersion={emrVersion} />
      <SystemInfoTable moduleInfo={moduleInfo} error={isError} loading={isLoading} />
    </Tile>
  );
};

export default SystemInfoPage;
