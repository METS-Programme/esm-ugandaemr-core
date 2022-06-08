import { EmptyStateComingSoon } from "openmrs-esm-ohri-commons-lib/src/index";
import React from "react";
import { useTranslation } from "react-i18next";

const PncRegister: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t(
    "integratedPostnatalRegister",
    "Integrated Postnatal Register"
  );
  const displayText = t(
    "integratedPostnatalRegister",
    "Integrated Postnatal Register"
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

export default PncRegister;
