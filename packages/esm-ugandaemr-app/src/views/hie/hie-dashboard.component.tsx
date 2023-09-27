import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Column } from '@carbon/react';
import HIEProfilesSection from './hie-profiles-section';
import ProfileTransactionsSection from './profile-transactions';
import {
  EAFYAResponse,
  HIVProgramResponse,
  CRResponse,
  FRResponse,
  ArtAccessResponse,
  TBProgramResponse,
} from './sample/sampleData';
import { hieProfiles } from './sample/profile';
import styles from './styles/hie-components.scss';

const HIEDashboard = () => {
  const { t } = useTranslation();
  // fetch data of the different profiles
  // set it in state
  const [profilesInfo, setProfilesInfo] = useState({
    eafya: EAFYAResponse,
    hiv: HIVProgramResponse,
    cr: CRResponse,
    fr: FRResponse,
    artAccess: ArtAccessResponse,
    tb: TBProgramResponse,
  });

  // set selected tile
  const [selectedTile, setSelectedTile] = useState('');
  // depending on selected tile, set datatable info
  const [tableInfo, setTableInfo] = useState({
    incoming: [],
    outgoing: [],
  });

  useEffect(() => {
    if (!Object.values(profilesInfo)) {
      setProfilesInfo({
        ...profilesInfo,
        eafya: EAFYAResponse,
        hiv: HIVProgramResponse,
        cr: CRResponse,
        fr: FRResponse,
        artAccess: ArtAccessResponse,
        tb: TBProgramResponse,
      });
    }
  }, [profilesInfo]);

  // console.log(selectedTile)

  useEffect(() => {
    const filteredProfile = Object.values(profilesInfo).filter((profile) => profile['name'] === selectedTile);
    // console.log(filter)
    // console.log(selectedTile)
    if (filteredProfile.length > 0) {
      setTableInfo({
        ...tableInfo,
        incoming: filteredProfile[0]['incoming'],
        outgoing: filteredProfile[0]['outgoing'],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profilesInfo, selectedTile]);
  return (
    <>
      <Grid className={styles.gridContainer} fullWidth>
        <Column lg={16} md={8} sm={4} className={styles.gridChild}>
          <HIEProfilesSection setSelectedTile={setSelectedTile} profiles={hieProfiles} activeCard={selectedTile} />
        </Column>
        <Column lg={16} md={8} sm={4} className={styles.gridChild}>
          <ProfileTransactionsSection transactions={tableInfo} activeProfile={selectedTile} />
        </Column>
      </Grid>
    </>
  );
};

export default HIEDashboard;
