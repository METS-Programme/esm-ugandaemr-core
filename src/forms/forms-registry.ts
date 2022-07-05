import cacx_registration from "./cacx-services/cacx-registration-form.json";
import cacx_screening_log from "./cacx-services/cacx-screening-log-form.json";
import integrated_antenatal_register from "./mch-services/integrated-antenatal-register-form.json";
import eid_summary from "./mch-services/eid-summary-form.json";
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
    integrated_postnatal_register: {
      "1.0": integrated_postnatal_register,
    },
    integrated_maternity_register: {
      "1.0": integrated_maternity_register,
    },
  },
};
