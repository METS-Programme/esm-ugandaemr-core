import { Tab, Tabs } from "carbon-components-react";
import React from "react";
import { useTranslation } from "react-i18next";
import CaCxEligibilityLog from "./cacx-eligibility-log.component";
import CaCxScreening from "./cacx-screening-and-treatment.component";

const CaCxVisits: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t("cacxVisits", "Cacx Visits");
  const displayText = t("cacxVisits", "Cacx Visits");
  return (
    <Tabs type="container">
      <Tab label="Cacx Eligibility Log" style={{ padding: 0 }}>
        <CaCxEligibilityLog patientUuid={patientUuid} />
      </Tab>
      <Tab label="CaCx Screening and Treatment" style={{ padding: 0 }}>
        <CaCxScreening patientUuid={patientUuid} />
      </Tab>
    </Tabs>
  );
};

export default CaCxVisits;
