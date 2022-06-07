import { EmptyStateComingSoon } from "openmrs-esm-ohri-commons-lib/src/index";
import React from "react";
import { useTranslation } from "react-i18next";

const EidRegister: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t("eid Register", "EID Register");
  const displayText = t("eid Register", "EID Register");

  return (
    <>
      <EmptyStateComingSoon
        displayText={displayText}
        headerTitle={headerTitle}
      />
    </>
  );
};

export default EidRegister;
