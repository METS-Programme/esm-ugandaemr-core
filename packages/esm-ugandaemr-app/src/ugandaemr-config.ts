import ugandaEmrBannerLogo from './images/ugandaemr_banner_white.png';
import ugandaEmrLogo from './images/ugandaemr_login_logo_green.png';

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
