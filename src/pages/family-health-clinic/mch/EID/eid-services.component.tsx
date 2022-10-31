import React from "react";
import { Tabs, Tab } from "@carbon/react";
import styles from "../common.scss";
import EidSummary from "./tabs/eid-summary-form.component";
import EidFollowup from "./tabs/eid-followup-form.component";

interface OverviewListProps {
  patientUuid: string;
}

const EidServices: React.FC<OverviewListProps> = ({ patientUuid }) => (
  <div className={styles.tabContainer}>
    <Tabs type="container">
      <Tab label="EID Summary" className="tab-12rem">
        <EidSummary patientUuid={patientUuid} />
      </Tab>
      <Tab label="EID Followup" style={{ padding: 0 }}>
        <EidFollowup patientUuid={patientUuid} />
      </Tab>
    </Tabs>
  </div>
);

export default EidServices;
