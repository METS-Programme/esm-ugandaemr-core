import { EmptyStateComingSoon } from "openmrs-esm-ohri-commons-lib/src/index";
import React from "react";
import { useTranslation } from "react-i18next";

const EidRegister: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t("eidRegister", "EID Register");
  const displayText = t("eidRegister", "EID Register");

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
