import { EmptyStateComingSoon } from "openmrs-esm-ohri-commons-lib/src/index";
import React from "react";
import { useTranslation } from "react-i18next";

const AncRegister: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t(
    "Integrated Antenatal Register",
    "Integrated Antenatal Register"
  );
  const displayText = t(
    "Integrated Antenatal Register",
    "Integrated Antenatal Register"
  );

  return (
    <>
      <EmptyStateComingSoon
        displayText={displayText}
        headerTitle={headerTitle}
      />
    </>
  );
};

export default AncRegister;
