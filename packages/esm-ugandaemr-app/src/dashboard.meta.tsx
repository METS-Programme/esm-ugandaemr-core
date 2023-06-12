import { Home, ListBulleted, Calendar, Medication, Events } from '@carbon/react/icons';

// Uncomment this and use it as a starting point for your dashboard
// export const sampleMeta = {
//   slot: "test-dashboard-slot",
//   config: { columns: 1, type: "grid" },
//   title: "Test",
// };

export const facilityListMeta = {
    name: 'facility-lists',
    slot: 'ohri-patient-list-slot',
    config: { columns: 1, type: 'grid', icon: ListBulleted },
    isLink: true,
    title: 'Facility Lists',
  };