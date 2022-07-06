import cacx_registration from "./cacx-services/cacx-registration-form.json";
import cacx_screening_log from "./cacx-services/cacx-screening-log-form.json";
import integrated_antenatal_register from "./mch-services/HMIS-005-IntegratedAntenatalRegister.json";
import eid_summary from "./mch-services/HMIS-ACP-015-ExposedInfantClinicalChart-SummaryPage.json";
import eid_followup from "./mch-services/HMIS-ACP-015-ExposedInfantClinicalChart-EncounterPage.json";
import integrated_postnatal_register from "./mch-services/integrated-postnatal-register-form.json";
import integrated_maternity_register from "./mch-services/integrated-maternity-register.json";
export default {
  uganda_emr_cacx: {
    cacx_registration: {
      "1.0": cacx_registration,
    },
    cacx_screening_log: {
      "1.0": cacx_screening_log,
    },
  },
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
  },
};
