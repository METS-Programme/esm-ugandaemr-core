import React from 'react';
import FacilityHomeHeader from './facility-header/facility-home-header.component';
import FacilityTabs from './facility-dashboard/facility-tabs.component';
import DashboardItems from './facility-dashboard/drag-and-drop-dashboard-card.component';

interface FacilityHomeProps {}

const FacilityListHome: React.FC<FacilityHomeProps> = (props) => {
  const pathName = window.location.pathname;

  return (
    <div>
      <FacilityHomeHeader />
      <FacilityTabs />
      <DashboardItems />
    </div>
  );
};

export default FacilityListHome;
