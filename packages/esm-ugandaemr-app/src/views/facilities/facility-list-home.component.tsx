import React from 'react';
import FacilityHomeHeader from './facility-header/facility-home-header.component';
import FacilitiesList from './facility-tabs/tabs/HIE/facilities-list-component';
import FacilitiesMetrics from './facility-tiles/facility-clinic-metrics.component';
import FacilityTabs from './facility-tabs/facility-tabs.component';

interface FacilityHomeProps {}

const FacilityListHome: React.FC<FacilityHomeProps> = (props) => {
  const pathName = window.location.pathname;

  return (
    <div>
      <FacilityHomeHeader />
      <FacilityTabs />
    </div>
  );
};

export default FacilityListHome;
