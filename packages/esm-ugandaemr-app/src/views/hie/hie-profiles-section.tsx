import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClickableTile } from '@carbon/react';
import { ArrowUp, ArrowDown } from '@carbon/react/icons';
import styles from './styles/hie-components.scss';

const HIEProfileCard = ({ id, profileName, incoming, outgoing, setSelectedTile, color }) => {
  const { t } = useTranslation();

  return (
    <ClickableTile
      onClick={(e) => {
        e.preventDefault();
        setSelectedTile(profileName);
      }}
      className={styles.cardTile}
      style={{ backgroundColor: color }}
      id={id}
    >
      <p className={styles.header}>{profileName}</p>
      <section className={styles.section}>
        <div>
          <p className={styles.label}>
            <span>Incoming</span>
            <ArrowDown size={15} />
          </p>
          <p className={styles.value}>{incoming}</p>
        </div>
        <div>
          <p className={styles.label}>
            <span>Outgoing</span>
            <ArrowUp size={15} />
          </p>
          <p className={styles.value}>{outgoing}</p>
        </div>
      </section>
    </ClickableTile>
  );
};

const HIEProfilesSection = ({ setSelectedTile, profiles, activeCard }) => {
  // console.log(profiles);
  return (
    <div className={styles.profileSection}>
      {profiles.map((profile) => (
        <HIEProfileCard
          id={profile.id}
          profileName={profile.name}
          incoming={profile.incoming}
          outgoing={profile.outgoing}
          setSelectedTile={setSelectedTile}
          color={activeCard === profile.name ? '#e0e0e0' : '#ffffff'}
        />
      ))}
    </div>
  );
};

export default HIEProfilesSection;
