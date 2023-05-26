import React, { useMemo } from "react";
import { OHRIProgrammeSummaryTiles, getReportingCohort } from '@ohri/openmrs-esm-ohri-commons-lib';


function HomeSummaryTiles({ launchWorkSpace }) {
    const tiles = useMemo(
        () => [
          {
            title: "All Patients",
            linkAddress: '#',
            subTitle: "All Facility Patients",
            value: 40,
          },
     
        ],
        [],
      );
      return <OHRIProgrammeSummaryTiles tiles={tiles} />;

}

export default HomeSummaryTiles;
