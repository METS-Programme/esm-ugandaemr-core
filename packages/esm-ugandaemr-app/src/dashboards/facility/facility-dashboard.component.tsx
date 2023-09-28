import React, { useCallback, useEffect, useState } from 'react';
import FacilityDashboardHeader from './components/facility-header/facility-dashboard-header.component';
import EmptyStateIllustration from './empty-state-illustration.component';
import styles from './facility-dasboard.scss';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import { Responsive, WidthProvider } from 'react-grid-layout';
import {
  Button,
  Modal,
  TextArea,
  TextInput,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  Layer,
  Tile,
  Dropdown,
} from '@carbon/react';
import { Add, ChartLine, ChartColumn, CrossTab } from '@carbon/react/icons';
import { useGetSavedDashboards, useGetSaveReports, saveDashboard } from './facility-dashboard.resource';
import pivotTableStyles from '!!raw-loader!react-pivottable/pivottable.css';
import { showNotification, showToast } from '@openmrs/esm-framework';

const FacilityDashboard: React.FC = () => {
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const cellSpacing: number[] = [5, 5];
  const [dashboardTitle, setDashboardTitle] = useState<string | null>(null);
  const [dashboardDescription, setDashboardDescription] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [canSaveDashboard, setCanSaveDashboard] = useState(false);
  const [modalDashboard, setModalDashboard] = useState<Array<savedReport>>([]);
  const launchDashboardModal = () => {
    setShowModal(true);
  };
  const closeModal = useCallback(() => {
    setModalDashboard([]);
    setShowModal(false);
  }, [modalDashboard, showModal]);
  const { savedReports } = useGetSaveReports();
  const { mutate, dashboardArray } = useGetSavedDashboards();
  const handleSaveDashboard = useCallback(() => {
    const getReportsInDashboard = (items) => {
      let reportArray = [];
      items?.map((item) => reportArray.push(item.id));
      return reportArray;
    };

    saveDashboard({
      name: dashboardTitle,
      description: dashboardDescription,
      items: getReportsInDashboard(modalDashboard),
    }).then(
      ({ status }) => {
        if (status === 201) {
          showToast({
            critical: true,
            title: 'Saving Dashboard',
            kind: 'success',
            description: `Dashboard ${dashboardTitle} saved Successfully`,
          });
          closeModal();
          mutate();
        }
      },
      (error) => {
        showNotification({
          title: 'Saving Dashboard Failed',
          kind: 'error',
          critical: true,
          description: error?.message,
        });
      },
    );
  }, [dashboardTitle, dashboardDescription, modalDashboard, closeModal, mutate]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleTabChange = (evt) => {
    setSelectedIndex(evt.selectedIndex);
  };

  const handleInputChange = (event) => {
    setDashboardTitle(event.target.value);
  };
  const handleTextAreaChange = (event) => {
    setDashboardDescription(event.target.value);
  };

  const [selectedOption, setSelectedOption] = useState(null);

  const handleDropdownSelect = (selectedReport) => {
    setSelectedOption(selectedReport.selectedItem);
    let newArray: Array<savedReport> = modalDashboard;
    newArray.push(selectedReport.selectedItem);
    setModalDashboard(newArray);
  };

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `${pivotTableStyles}`;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <>
      <FacilityDashboardHeader />

      <div className={styles.cardContainer}>
        <>
          <div className={styles.createIcon}>
            <Button size="md" kind="primary" onClick={launchDashboardModal}>
              <Add />
              <span> Create dashboard</span>
            </Button>
          </div>
        </>
      </div>

      {dashboardArray.length > 0 ? (
        <div className={styles.dashboardTabs}>
          <Tabs selectedIndex={selectedIndex} onChange={handleTabChange} dismissable>
            <TabList aria-label="List of tabs">
              {dashboardArray?.map((tab, index) => (
                <Tab key={index}>{tab.label}</Tab>
              ))}
            </TabList>
            <TabPanels>{dashboardArray?.map((tab) => tab.panel)}</TabPanels>
          </Tabs>
        </div>
      ) : (
        <Layer className={styles.layer}>
          <Tile className={styles.tile}>
            <EmptyStateIllustration />
            <p className={styles.content}>No dashboard items to display</p>
            <p className={styles.explainer}>Use the create dashboard above to build your dashboard</p>
          </Tile>
        </Layer>
      )}
      {showModal && (
        <Modal
          open
          size="lg"
          modalHeading="DASHBOARD"
          secondaryButtonText="Cancel"
          primaryButtonText="Save Dashboard"
          preventCloseOnClickOutside={true}
          hasScrollingContent={true}
          onRequestClose={closeModal}
          onRequestSubmit={handleSaveDashboard}
          className={styles.dashboardModal}
        >
          <div>
            <TextInput
              className={styles.modalInput}
              id="title"
              labelText={`Dashboard Title`}
              onChange={handleInputChange}
              maxCount={50}
              placeholder="Enter dashboard title"
            />
            <TextArea
              id="description"
              labelText={`Dashboard Description`}
              onChange={handleTextAreaChange}
              maxCount={500}
              placeholder="Enter dashboard description"
            />
            <Dropdown
              className={styles.dropdownContainer}
              items={[...savedReports]}
              itemToElement={(report) => itemsToRender(report)}
              label="Select a report..."
              id="item-to-element"
              onChange={handleDropdownSelect}
            />
            {modalDashboard.map((item, index) => pivotRender(item, index))}
          </div>
        </Modal>
      )}
    </>
  );
};

export default FacilityDashboard;

export const pivotRender = (report: savedReport, index: number) => {
  const PlotlyRenderers = createPlotlyRenderers(Plot);
  const pivotData = JSON.parse(report.report_request_object);

  return (
    <div className={styles.dashboardChartContainer} key={`item-${index++}`}>
      <PivotTableUI
        data={pivotData?.data}
        renderers={{ ...TableRenderers, ...PlotlyRenderers }}
        aggregatorName={pivotData?.aggregatorName}
        rendererName={pivotData?.rendererName}
        cols={pivotData?.cols}
      />
    </div>
  );
};

export const itemsToRender = (report: savedReport) => {
  let icon: any = null;
  if (report.type.toLowerCase() === 'line chart') {
    icon = <ChartLine />;
  } else if (report.type.toLowerCase() === 'bar chart' || report.type.toLowerCase() === 'stacked column chart') {
    icon = <ChartColumn />;
  } else {
    icon = <CrossTab />;
  }

  return (
    <span>
      {icon} {report.label}
    </span>
  );
};
