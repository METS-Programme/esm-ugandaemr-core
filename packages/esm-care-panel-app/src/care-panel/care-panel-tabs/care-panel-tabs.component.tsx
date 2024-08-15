import React, { useState } from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from './care-panel-tabs.scss';
import DSDMHistory from '../../dsdm-history/dsdm-history.component';
import ViralLoadList from '../../vl-history/vl-history.component';

interface CarePanelTabsProps {
  patientUuid: string;
}

const CarePanelTabs: React.FC<CarePanelTabsProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <div className={styles.tabContainer}>
      <Tabs
        selectedIndex={selectedTab}
        onChange={({ selectedIndex }) => setSelectedTab(selectedIndex)}
        className={styles.tabs}
      >
        <TabList contained className={styles.tabList}>
          <Tab>{t('dsdmHistory', 'DSDM History')}</Tab>
          <Tab>{t('vlHistory', 'Viral Load History')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div>
              <DSDMHistory patientUuid={patientUuid} />
            </div>
          </TabPanel>
          <TabPanel>
            <div>
              <ViralLoadList patientUuid={patientUuid} />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};
export default CarePanelTabs;
