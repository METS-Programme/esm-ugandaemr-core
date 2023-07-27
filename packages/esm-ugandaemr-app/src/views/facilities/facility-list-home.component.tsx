import React from 'react';
import FacilityHomeHeader from './facility-header/facility-home-header.component';
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
