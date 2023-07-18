import React from 'react';
import FacilityHomeHeader from './facility-header/facility-home-header.component';
import FacilitiesList from './facility-list/ug-emr-facilities.component';
import FacilitiesMetrics from './facility-tiles/facility-clinic-metrics.component';

interface FacilityHomeProps {}

const FacilityListHome: React.FC<FacilityHomeProps> = (props) => {
  const pathName = window.location.pathname;

  return (
    <div>
      <FacilityHomeHeader />
      <FacilitiesMetrics />
      <FacilitiesList />
    </div>
  );
};

export default FacilityListHome;
