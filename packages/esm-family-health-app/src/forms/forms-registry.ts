import integrated_antenatal_register from "./family-health-services/mch-services/HMIS-005-IntegratedAntenatalRegister.json";
import eid_summary from "./family-health-services/mch-services/HMIS-ACP-015-ExposedInfantClinicalChart-SummaryPage.json";
import eid_followup from "./family-health-services/mch-services/HMIS-ACP-015-ExposedInfantClinicalChart-EncounterPage.json";
import integrated_postnatal_register from "./family-health-services/mch-services/integrated-postnatal-register-form.json";
import integrated_maternity_register from "./family-health-services/mch-services/integrated-maternity-register.json";
import child_health_register from "./family-health-services/HIMS-EPI-007-childHealthRegister.json";

export default {
  uganda_emr_mch: {
    integrated_antenatal_register: {
      "1.0": integrated_antenatal_register,
    },
    eid_summary: {
      "1.0": eid_summary,
    },
    eid_followup: {
      "1.0": eid_followup,
    },
    integrated_postnatal_register: {
      "1.0": integrated_postnatal_register,
    },
    integrated_maternity_register: {
      "1.0": integrated_maternity_register,
    },
    child_health_register: {
      "1.0": child_health_register,
    },
  },
  uganda_emr_family_health: {
    child_health_register: {
      "1.0": child_health_register,
    },
  },
};
