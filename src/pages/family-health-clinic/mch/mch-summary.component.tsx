import React from "react";
import styles from "../../common.scss";
import { useTranslation } from "react-i18next";
import { PatientChartProps } from "../../../types";
import { Tabs, Tab, TabList, TabPanels, TabPanel } from "@carbon/react";
import ANCRegister from "./anc-register.component";
import PncRegister from "./pnc-register.component";
import MaternityRegister from "./maternity-register.component";

const MchSummary: React.FC<PatientChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t("mchSummary", "Maternal Child Health");

  return (
    <div className={styles.tabContainer}>
      <Tabs>
        <TabList contained>
          <Tab>{t("antenatal", "Antenatal")}</Tab>
          <Tab>{t("postnatal", "Postnatal")}</Tab>
          <Tab>{t("maternity", "Maternity")}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ANCRegister patientUuid={patientUuid} />
          </TabPanel>
          <TabPanel>
            <PncRegister patientUuid={patientUuid} />
          </TabPanel>
          <TabPanel>
            <MaternityRegister patientUuid={patientUuid} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default MchSummary;
