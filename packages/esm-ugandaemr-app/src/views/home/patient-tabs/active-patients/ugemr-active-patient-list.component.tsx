import { EncounterList, EncounterListColumn, getObsFromEncounter } from '@ohri/openmrs-esm-ohri-commons-lib';
import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../patient-list.scss';

import { EmptyState, encounterRepresentation, fetchPatientList, OTable } from '@ohri/openmrs-esm-ohri-commons-lib';
import { capitalize } from 'lodash-es';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import { DataTableSkeleton, Pagination, Search } from '@carbon/react';
import { age, navigate, openmrsFetch } from '@openmrs/esm-framework';


export const filterPatientsByName = (searchTerm: string, patients: Array<any>) => {
  return patients.filter((patient) => patient.patientSearchName.toLowerCase().includes(searchTerm.toLowerCase()));
};

const ActivePatientsList: React.FC = () => {
  const { t } = useTranslation();

  const [patients, setPatients] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const rowCount = 5;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPatientCount, setPatientCount] = useState(0);
  const [nextOffSet, setNextOffSet] = useState(0);
  const headerTitle = '';

  const tableHeaders = [
    { key: 'name', header: t('patientName', 'Patient Name'), isSortable: true },
    { key: 'gender', header: t('sex', 'Sex') },
    { key: 'age', header: t('age', 'Age') },
  ];

  useEffect(() => {
    setIsLoading(true);
    fetchPatientList(nextOffSet, pageSize).then(({ data }) => {
      setPatients(data.entry);
      setPatientCount(data.total);
      setIsLoading(false);
    });
  }, [page, pageSize]);

  useEffect(() => {
    let rows = [];
    for (let patient of patients) {
      rows.push({
        id: patient.resource.id,
        name: `${patient.resource.name[0].given.join(' ')} ${patient.resource.name[0].family}`,
        gender: capitalize(patient.resource.gender),
        age: age(patient.resource.birthDate),
        patientSearchName: `${patient.resource.name[0].given.join(' ')} ${patient.resource.name[0].family}`,
      });
    }
    setAllRows(rows);
  }, [patients]);

  const handleSearch = useCallback(
    (searchTerm) => {
      setSearchTerm(searchTerm);
      const filtrate = filterPatientsByName(searchTerm, allRows);
      setFilteredResults(filtrate);
      return true;
    },
    [searchTerm],
  );
  return (
    <>
      {isLoading ? (
        <DataTableSkeleton rowCount={rowCount} />
      ) : allRows.length > 0 ? (
        <>
          <div className={styles.searchBox}>
            <Search
              className={styles.searchField}
              labelText="Search"
              placeHolderText="Search Client list"
              size="sm"
              light
              onKeyDown={({ target }) => handleSearch(target['value'])}
            />
          </div>
          <div className={styles.widgetContainer}>
            <OTable tableHeaders={tableHeaders} tableRows={searchTerm ? filteredResults : allRows} />
            <div style={{ width: '800px' }}>
              <Pagination
                page={page}
                pageSize={pageSize}
                pageSizes={[10, 20, 30, 40, 50]}
                totalItems={totalPatientCount}
                onChange={({ page, pageSize }) => {
                  setSearchTerm(null);
                  setPage(page);
                  setNextOffSet((page - 1) * pageSize);
                  setPageSize(pageSize);
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <EmptyState displayText={t('activePatients', 'Active Patients')} headerTitle={headerTitle} />
      )}
    </>
  );
};

export default ActivePatientsList;
