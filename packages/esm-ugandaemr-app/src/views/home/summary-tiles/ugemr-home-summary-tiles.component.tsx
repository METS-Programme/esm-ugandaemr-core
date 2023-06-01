import { OHRIProgrammeSummaryTiles } from '@ohri/openmrs-esm-ohri-commons-lib';
import React, { useMemo } from 'react';

function PatientSummaryTiles({ launchWorkSpace }) {
  const tiles = useMemo(
    () => [
      {
        title: 'All Patients',
        linkAddress: '#',
        subTitle: 'All Patients in emr',
        value: 0,
      },
      {
        title: 'Active Patients',
        linkAddress: '#',
        subTitle: 'Active Patients',
        value: 0,
      },
    ],
    [],
  );

  return <OHRIProgrammeSummaryTiles tiles={tiles} />;
}

export default PatientSummaryTiles;
