import ugandaEmrLogo from './images/ugandaemr_+_logo.svg';
import ugandaEmrBannerLogo from './images/ugandaemr_+_logo_white.svg';

export default {
  '@openmrs/esm-login-app': {
    logo: {
      src: ugandaEmrLogo,
    },
  },
  '@openmrs/esm-primary-navigation-app': {
    logo: {
      src: ugandaEmrBannerLogo,
    },
  },
  '@openmrs/esm-patient-chart-app': {
    logo: {
      src: ugandaEmrBannerLogo,
    },
  },
};
