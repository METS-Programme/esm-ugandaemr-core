// import test_form from "./test-folder/test-form.json";
import outpatient_register from './opd/HMIS-OPD-002-OutpatientRegister.json';
import referral_note from './opd/HMIS-OPD-003-ReferralNote.json';

export default {
  uganda_emr_opd: {
    outpatient_register: {
      '1.0': outpatient_register,
    },
    referral_note: {
      '1.0': referral_note,
    },
  },
};
