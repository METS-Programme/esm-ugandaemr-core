import { Search, Tab, TabList, TabPanels, Tabs } from '@carbon/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RadiologyPatientList from './radiology-patient-list.component';
import styles from './radiology-queue.scss';

enum TabTypes {
  STARRED,
  SYSTEM,
  USER,
  ALL,
}

const RadiologyQueueList: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(TabTypes.STARRED);
  const [searchTermUserInput, setSearchTermUserInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const tabs = [
    {
      key: 'activeOrders',
      header: t('activeOrders', 'Active Orders'),
      status: 'ACTIVE',
    },
    {
      key: 'allOrders',
      header: t('allOrders', 'All Orders'),
      status: '',
    },
  ];

  useEffect(() => {
    const debounceFn = setTimeout(() => {
      setSearchTerm(searchTermUserInput);
    }, 500);

    return () => clearTimeout(debounceFn);
  }, [searchTermUserInput]);

  return (
    <main className={`omrs-main-content`}>
      <section className={styles.orderTabsContainer}>
        <Tabs
          className={styles.orderTabs}
          type="container"
          tabContentClassName={styles.hiddenTabsContent}
          onSelectionChange={setSelectedTab}
        >
          <TabList aria-label={t('tabList', 'Tab List')} contained className={styles.tabsContainer}>
            {tabs.map((tab, index) => {
              return (
                <Tab title={t(tab.key)} key={index} id={'tab-' + index} className={styles.tab}>
                  {t(tab.header)}
                </Tab>
              );
            })}
          </TabList>
          <div className={styles.searchContainer}>
            <Search
              closeButtonLabelText={t('clearSearchInput', 'Clear search input')}
              defaultValue={searchTermUserInput}
              placeholder={t('searchByPatientIdOrName', 'Search by patient ID or name')}
              labelText={t('searchByPatientIdOrName', 'Search by patient ID or name')}
              onChange={(e) => {
                e.preventDefault();
                setSearchTermUserInput(e.target.value);
              }}
              size="md"
              className={styles.patientSearch}
            />
          </div>
          <TabPanels>
            {tabs.map((tab, index) => {
              return <RadiologyPatientList location={location} searchTerm={searchTerm} status={tab.status} />;
            })}
          </TabPanels>
        </Tabs>
      </section>
    </main>
  );
};

export default RadiologyQueueList;
