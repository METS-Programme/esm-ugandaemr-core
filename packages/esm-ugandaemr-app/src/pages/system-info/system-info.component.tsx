import React, { useEffect, useState, useCallback } from 'react';
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
import { ErrorState, UserHasAccess, showToast, showNotification, showSnackbar } from '@openmrs/esm-framework';
import { updatePropertyValue, useGetSystemInformation, useRetrieveFacilityCode } from './system-info.resources';
import styles from './system-info.scss';
import coatOfArms from '../../images/coat_of_arms.png';
import UpdateFacilityCode from './update-facility-code-button.component';
import {
  NHFRIdentifier,
  PRIVILEGE_UPDATE_FACILITY_CODE,
  systemInstallationDate,
  systemInstallationTime,
} from '../../constants';

interface FacilityCodeDetails {
  value?: string;
}

const OverallSystemInfo = ({ buildInfo, emrVersion, facilityCodeDetails, setFacilityCodeDetails }) => {
  const { t } = useTranslation();
  const buildDateTime =
    buildInfo && buildInfo[`${systemInstallationDate}`]
      ? `${buildInfo[`${systemInstallationDate}`]}, ${buildInfo[`${systemInstallationTime}`]}`
      : '-';

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
        <span>{facilityCodeDetails.value === null ? '-' : facilityCodeDetails.value}</span>
      </Column>
      <div className={styles.divUpdateContent}>
        <UserHasAccess privilege={PRIVILEGE_UPDATE_FACILITY_CODE}>
          <Column>
            <UpdateFacilityCode
              facilityCodeDetails={facilityCodeDetails}
              setFacilityCodeDetails={setFacilityCodeDetails}
            />
          </Column>
        </UserHasAccess>
      </div>
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
    return <DataTableSkeleton className={styles['system-info-table']} role="progressbar" />;
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
              {rows.map((row: { cells }) => (
                <TableRow {...getRowProps({ row })}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>
    );
  }
}

const SystemInfoPage = () => {
  const { t } = useTranslation();
  const [moduleInfo, setModuleInfo] = useState({});
  const [buildInfo, setBuildInfo] = useState({});
  const [emrVersion, setEMRVersion] = useState('4.0');
  const { systemInfo, isError, isLoading } = useGetSystemInformation();
  const [facilityCodeDetails, setFacilityCodeDetails] = useState<FacilityCodeDetails>({ value: null });

  const { facilityIds } = useRetrieveFacilityCode();

  useEffect(() => {
    if (facilityIds && facilityIds.length) {
      setFacilityCodeDetails({
        value: facilityIds[0]['value'],
      });
    }
  }, [facilityIds]);

  const updateFacilityCode = useCallback(() => {
    if (facilityCodeDetails.value) {
      updatePropertyValue(`${NHFRIdentifier}`, facilityCodeDetails.value).then(
        (response) => {
          showSnackbar({
            isLowContrast: true,
            kind: 'success',
            title: t('Updating Facility Code', 'Updating Facility Code'),
            subtitle: t('UpdatingFacilityCode', `Updated Facility Code ${response?.value}`),
          });
        },
        (error) => {
          showNotification({
            title: t('errorUpdatingFacilityCode', 'Could not update facility code'),
            kind: 'error',
            critical: true,
            description: error?.message,
          });
        },
      );
    }
  }, [facilityCodeDetails.value, t]);

  useEffect(() => {
    if (facilityCodeDetails.value) {
      updateFacilityCode();
    }
  }, [facilityCodeDetails.value, updateFacilityCode]);

  useEffect(() => {
    if (systemInfo) {
      const moduleInformation = { ...systemInfo['systemInfo']['SystemInfo.title.moduleInformation'] };
      delete moduleInformation['SystemInfo.Module.repositoryPath'];
      setModuleInfo(moduleInformation);
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
      <OverallSystemInfo
        buildInfo={buildInfo}
        emrVersion={emrVersion}
        facilityCodeDetails={facilityCodeDetails}
        setFacilityCodeDetails={setFacilityCodeDetails}
      />
      <SystemInfoTable moduleInfo={moduleInfo} error={isError} loading={isLoading} />
    </Tile>
  );
};

export default SystemInfoPage;
