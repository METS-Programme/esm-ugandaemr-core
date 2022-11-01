import React from "react";
import { Tabs, Tab, TabList, TabPanels, TabPanel } from "@carbon/react";
import styles from "../../common.scss";
import EidSummary from "./tabs/eid-summary-form.component";
import EidFollowup from "./tabs/eid-followup-form.component";
import { PatientChartProps } from "../../../types";
import { useTranslation } from "react-i18next";

const EidServices: React.FC<PatientChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.tabContainer}>
      <Tabs>
        <TabList contained>
          <Tab>{t("eidSummary", "EID Summary")}</Tab>
          <Tab>{t("eidFollowup", "EID Followup")}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <EidSummary patientUuid={patientUuid} />
          </TabPanel>
          <TabPanel>
            <EidFollowup patientUuid={patientUuid} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default EidServices;
