import { OHRIProgrammeSummaryTiles } from '@ohri/openmrs-esm-ohri-commons-lib';
import React, { useMemo } from 'react';

function DemoTiles({ launchWorkSpace }) {
  const tiles = useMemo(
    () => [
      {
        title: 'All Patients Count',
        linkAddress: '#',
        subTitle: 'Blaah blaaahh',
        value: 145,
      },
      {
        title: 'ART Patients',
        linkAddress: '#',
        subTitle: 'ART Patients',
        value: 67,
      },
    ],
    [],
  );

  return <OHRIProgrammeSummaryTiles tiles={tiles} />;
}

export default DemoTiles;
