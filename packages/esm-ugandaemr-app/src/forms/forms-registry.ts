import cacx_registration from './cacx-services/cacx-registration-form.json';
import cacx_screening_log from './cacx-services/cacx-screening-log-form.json';

import clinical_assessment from './hiv/clinical-assessment.json';

export default {
  uganda_emr_cacx: {
    cacx_registration: {
      '1.0': cacx_registration,
    },
    cacx_screening_log: {
      '1.0': cacx_screening_log,
    },
  },
  uganda_emr_hiv: {
    hiv_clinical_assessment: {
      '1.0': clinical_assessment,
    },
  },
};
