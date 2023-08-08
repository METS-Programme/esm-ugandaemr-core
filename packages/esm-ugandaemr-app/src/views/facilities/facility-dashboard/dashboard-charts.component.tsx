import {
  AccumulationChartComponent,
  AccumulationSeriesCollectionDirective,
  AccumulationSeriesDirective,
  AccumulationTooltip,
  Category,
  ChartComponent,
  ColumnSeries,
  DataLabel,
  Inject,
  Legend,
  LineSeries,
  SeriesCollectionDirective,
  SeriesDirective,
  Tooltip,
} from '@syncfusion/ej2-react-charts';
import { DashboardLayoutComponent, PanelDirective, PanelsDirective } from '@syncfusion/ej2-react-layouts';
import React from 'react';

function App() {
  const cellSpacing: number[] = [10, 10];

  // Template for line Chart
  function lineTemplate(): JSX.Element {
    const lineData: object[] = [
      { x: 2013, y: 28 },
      { x: 2014, y: 25 },
      { x: 2015, y: 26 },
      { x: 2016, y: 27 },
      { x: 2017, y: 32 },
      { x: 2018, y: 35 },
    ];

    return (
      <div className="template">
        <ChartComponent style={{ height: '162px' }}>
          <Inject services={[LineSeries]} />
          <SeriesCollectionDirective>
            <SeriesDirective dataSource={lineData} xName="x" yName="y" type="Line" />
          </SeriesCollectionDirective>
        </ChartComponent>
      </div>
    );
  }

  // Template for Pie Chart
  function pieTemplate(): JSX.Element {
    const pieData: object[] = [
      { x: 'TypeScript', y: 13, text: 'TS 13%' },
      { x: 'React', y: 12.5, text: 'Reat 12.5%' },
      { x: 'MVC', y: 12, text: 'MVC 12%' },
      { x: 'Core', y: 12.5, text: 'Core 12.5%' },
      { x: 'Vue', y: 10, text: 'Vue 10%' },
      { x: 'Angular', y: 40, text: 'Angular 40%' },
    ];
    return (
      <div className="template">
        <AccumulationChartComponent style={{ height: '162px' }} tooltip={{ enable: true }}>
          <Inject services={[AccumulationTooltip]} />
          <AccumulationSeriesCollectionDirective>
            <AccumulationSeriesDirective dataSource={pieData} xName="x" yName="y" innerRadius="40%" />
          </AccumulationSeriesCollectionDirective>
        </AccumulationChartComponent>
      </div>
    );
  }

  // Template for Pie Chart 1
  function pieTemplate1(): JSX.Element {
    const pieData: object[] = [
      { x: 'Chrome', y: 37, text: '37%' },
      { x: 'UC Browser', y: 17, text: '17%' },
      { x: 'iPhone', y: 19, text: '19%' },
      { x: 'Others', y: 4, text: '4%' },
      { x: 'Opera', y: 11, text: '11%' },
      { x: 'Android', y: 12, text: '12%' },
    ];
    const dataLabel: object = { visible: true, position: 'Inside', name: 'text', font: { fontWeight: '600' } };
    const enableAnimation: boolean = false;
    return (
      <div className="template">
        <AccumulationChartComponent
          style={{ height: '162px' }}
          enableAnimation={enableAnimation}
          legendSettings={{ visible: false }}
          tooltip={{ enable: true, format: '${point.x} : <b>${point.y}%</b>' }}
        >
          <Inject services={[AccumulationTooltip]} />
          <AccumulationSeriesCollectionDirective>
            <AccumulationSeriesDirective
              dataSource={pieData}
              dataLabel={dataLabel}
              xName="x"
              yName="y"
              radius="70%"
              name="Browser"
            />
          </AccumulationSeriesCollectionDirective>
        </AccumulationChartComponent>
      </div>
    );
  }

  function columnTemplate(): JSX.Element {
    const chartData: any[] = [
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
    return (
      <div className="template">
        <ChartComponent style={{ height: '162px' }} primaryXAxis={{ valueType: 'Category' }}>
          <Inject services={[ColumnSeries, Legend, Tooltip, Category, DataLabel]} />
          <SeriesCollectionDirective>
            <SeriesDirective dataSource={chartData} xName="month" yName="sales" type="Column" />
          </SeriesCollectionDirective>
        </ChartComponent>
      </div>
    );
  }
  return (
    <div id="container">
      <DashboardLayoutComponent
        id="dashboard_default"
        draggableHandle=".e-panel-header"
        columns={6}
        cellSpacing={cellSpacing}
        allowResizing={true}
      >
        <PanelsDirective>
          <PanelDirective
            sizeX={3}
            sizeY={2}
            row={0}
            col={0}
            content={pieTemplate as any}
            header="<div class='header'>Product usage ratio</div><span class='handler e-icons burg-icon'></span>"
          />
          <PanelDirective
            sizeX={3}
            sizeY={2}
            row={0}
            col={3}
            content={columnTemplate as any}
            header="<div class='header'>Last year Sales Comparison</div><span class='handler e-icons burg-icon'></span>"
          />
          <PanelDirective
            sizeX={3}
            sizeY={2}
            row={0}
            col={3}
            content={pieTemplate1 as any}
            header="<div class='header'>Mobile browsers usage</div><span class='handler e-icons burg-icon'></span>"
          />
          <PanelDirective
            sizeX={3}
            sizeY={2}
            row={1}
            col={0}
            content={lineTemplate as any}
            header="<div class='header'>Sales increase percentage</div><span class='handler e-icons burg-icon'></span>"
          />
        </PanelsDirective>
      </DashboardLayoutComponent>
    </div>
  );
}
export default App;
