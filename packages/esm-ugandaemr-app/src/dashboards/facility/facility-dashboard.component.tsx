import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FacilityDashboardHeader from './components/facility-header/facility-dashboard-header.component';
import EmptyStateIllustration from './empty-state-illustration.component';
import styles from './facility-dasboard.scss';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import {
  Button,
  Modal,
  TextArea,
  TextInput,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Layer,
  Tile,
  Dropdown,
} from '@carbon/react';
import { Add, ChartLine, ChartColumn, CrossTab } from '@carbon/react/icons';
import { useGetSaveReports } from './facility-dashboard.resource';
import pivotTableStyles from '!!raw-loader!react-pivottable/pivottable.css';

interface FacilityHomeProps {}
type dashbaord = {
  label: string;
  description: string;
};

const FacilityDashboard: React.FC<FacilityHomeProps> = () => {
  const { t } = useTranslation();
  const pathName = window.location.pathname;
  const PlotlyRenderers = createPlotlyRenderers(Plot);
  let dashboardTitle,
    dashboardDescription = '';
  const [category, setCategory] = useState('new');
  const [dashboard, setDashboard] = useState([]);
  const [modelstate, setModelState] = useState(false);
  const launchDashboardModal = () => {
    setModelState(true);
  };
  const closeModal = () => {
    setModelState(false);
  };

  const addDashboard = () => {
    let dashboardArray = dashboard;
    dashboardArray.push({
      label: dashboardTitle,
      description: dashboardDescription,
      panel: <TabPanel> {dashboardDescription} </TabPanel>,
      dashboardItems: [],
    });

    setDashboard(dashboardArray);
    closeModal();
  };
  const [renderedTabs, setRenderedTabs] = useState(dashboard);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleTabChange = (evt) => {
    setSelectedIndex(evt.selectedIndex);
  };

  const [modalDashboard, setModalDashboard] = useState<Array<savedReport>>([]);

  const handleCloseTabRequest = (tabIndex) => {
    const selectedTab = renderedTabs[selectedIndex];
    const filteredTabs = renderedTabs.filter((_, index) => index !== tabIndex);
    setRenderedTabs(filteredTabs);
  };

  const handleInputChange = (event) => {
    dashboardTitle = event.target.value;
  };
  const handleTextAreaChange = (event) => {
    dashboardDescription = event.target.value;
  };

  const { savedReports } = useGetSaveReports();

  const [selectedOption, setSelectedOption] = useState(null);

  const handleDropdownSelect = (selectedReport) => {
    setSelectedOption(selectedReport.selectedItem);
    let newArray: Array<savedReport> = modalDashboard;
    newArray.push(selectedReport.selectedItem);
    setModalDashboard(newArray);
  };

  const itemsToRender = (report: savedReport) => {
    let icon: any = null;
    if (report.type.toLowerCase() === 'line chart') {
      icon = <ChartLine />;
    } else if (report.type.toLowerCase() === 'bar chart') {
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

  const pivotRender = (report: savedReport) => {
    const pivotData = JSON.parse(report.report_request_object);

    return (
      <PivotTableUI
        data={pivotData?.data}
        renderers={{ ...TableRenderers, ...PlotlyRenderers }}
        aggregatorName={pivotData?.aggregatorName}
        rendererName={pivotData?.rendererName}
        cols={pivotData?.cols}
      />
    );
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

      {dashboard.length > 0 ? (
        <div className={styles.dashboardTabs}>
          <Tabs
            selectedIndex={selectedIndex}
            onChange={handleTabChange}
            dismissable
            onTabCloseRequest={handleCloseTabRequest}
          >
            <TabList aria-label="List of tabs">
              {renderedTabs.map((tab, index) => (
                <Tab key={index}>{tab.label}</Tab>
              ))}
            </TabList>
            <TabPanels>{renderedTabs.map((tab) => tab.panel)}</TabPanels>
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
      {modelstate && (
        <Modal
          open
          size="lg"
          modalHeading="DASHBOARD"
          secondaryButtonText="Cancel"
          primaryButtonText="Save Dashboard"
          preventCloseOnClickOutside={true}
          hasScrollingContent={true}
          onRequestClose={closeModal}
          onRequestSubmit={addDashboard}
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
            {modalDashboard.map((item, index) => pivotRender(item))}
          </div>
        </Modal>
      )}
    </>
  );
};

export default FacilityDashboard;
