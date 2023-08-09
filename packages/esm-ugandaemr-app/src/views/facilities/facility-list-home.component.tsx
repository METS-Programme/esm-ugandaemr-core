import React from 'react';
import FacilityTabs from './facility-dashboard/facility-tabs.component';
import FacilityHomeHeader from './facility-header/facility-home-header.component';

interface FacilityHomeProps {}

const FacilityListHome: React.FC<FacilityHomeProps> = (props) => {
  const pathName = window.location.pathname;

  return (
    <div>
      <FacilityHomeHeader />
    </div>
  );
};

export default FacilityListHome;
