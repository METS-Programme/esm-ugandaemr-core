// Uncomment this and use it as a starting point for your dashboard
// export const sampleMeta = {
//   slot: "test-dashboard-slot",
//   config: { columns: 1, type: "grid" },
//   title: "Test",
// };

export const facilityListMeta = {
  name: 'facility-lists',
  slot: 'facility-ohri-home-dashboard-slot',
  title: 'Facility List',
  meta: {
    name: 'facility-list',
    slot: 'facility-list-dashboard-slot',
    dashboardTitle: 'Facility Home',
    config: {
      columns: 1,
      type: 'grid',
      programme: 'facility-page',
    },
  },
};
