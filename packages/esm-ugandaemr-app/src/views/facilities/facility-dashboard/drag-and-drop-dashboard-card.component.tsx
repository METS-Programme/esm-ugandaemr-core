import { IconButton } from '@carbon/react';
import { TrashCan } from '@carbon/react/icons';
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styles from './drag-and-drop-dashboard-card.scss';

const ResponsiveGridLayout = WidthProvider(Responsive);
const cellSpacing: number[] = [5, 5];

const ChartPanel = ({ title, children }) => {
  return (
    <div className={styles.chartPanelContainer}>
      <div className={styles.trashIcon}>
        <IconButton align="bottom" label="Remove item" kind="ghost">
          <TrashCan />
        </IconButton>
      </div>
      <h5>{title}</h5>
      <div className={styles.chartPanelContent}>{children}</div>
    </div>
  );
};

const DashboardItems = () => {
  // Data for column chart
  const chartData: object[] = [
    { month: 'Jan', sales: 35 },
    { month: 'Feb', sales: 28 },
    { month: 'Mar', sales: 34 },
    { month: 'Apr', sales: 32 },
    { month: 'May', sales: 40 },
    { month: 'Jun', sales: 32 },
    { month: 'Jul', sales: 35 },
    { month: 'Aug', sales: 55 },
    { month: 'Sep', sales: 38 },
    { month: 'Oct', sales: 30 },
    { month: 'Nov', sales: 25 },
    { month: 'Dec', sales: 32 },
  ];

  // Data for the bar chart
  const barChartData: object[] = [
    { name: 'A', value: 50 },
    { name: 'B', value: 70 },
    { name: 'C', value: 30 },
    { name: 'D', value: 80 },
    { name: 'E', value: 20 },
    { name: 'F', value: 40 },
  ];

  // Data for the pie chart
  const pieChartData: object[] = [
    { name: 'FBG', value: 25 },
    { name: 'FBIM', value: 40 },
    { name: 'FTR', value: 30 },
    { name: 'CDDP', value: 15 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const layout = [
    { i: 'column-chart', x: 0, y: 1, w: 4, h: 4 },
    { i: 'bar-chart', x: 0, y: 2, w: 3, h: 1 },
    { i: 'pie-chart', x: 0, y: 0, w: 4, h: 4 },
    { i: '1', x: 1, y: 2, w: 3, h: 2 },
  ];

  return (
    <div className={styles.tileContainer}>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        cellSpacing={cellSpacing}
        allowResizing={true}
      >
        <div key="bar-chart">
          <ChartPanel title="Bar Chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="value" fill="#8884d8" />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>

        <div key="pie-chart">
          <ChartPanel title="People under different DSDM programs">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={(entry) => entry.name}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>

        <div key="column-chart">
          <ChartPanel title="Colum chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default DashboardItems;
