import { EmptyStateComingSoon } from "openmrs-esm-ohri-commons-lib/src/index";
import React from "react";
import { useTranslation } from "react-i18next";

const CaCxEligibilityLog: React.FC<{ patientUuid: string }> = ({
  patientUuid,
}) => {
  const { t } = useTranslation();

  const headerTitle = t("CaCx Eligibility Log", "CaCx Eligibility Log");
  const displayText = t("CaCx Eligibility Log", "CaCx Eligibility Log");

  return (
    <>
      <EmptyStateComingSoon
        displayText={displayText}
        headerTitle={headerTitle}
      />
    </>
  );
};

export default CaCxEligibilityLog;
