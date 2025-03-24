import React from 'react';
import { useConfig } from '@openmrs/esm-framework';
import { EncounterListTabsComponent } from '@ohri/openmrs-esm-ohri-commons-lib';
import htsConfigSchema from './hiv-testing-services-config.json';

interface OverviewListProps {
    patientUuid: string;
}

const hivTestingServices: React.FC<OverviewListProps> = ({ patientUuid }) => {
    const config = useConfig();

    const tabFilter = (encounter, formName) => {
        return encounter?.form?.name === formName;
    };

    return (
        <EncounterListTabsComponent
            patientUuid={patientUuid}
            configSchema={htsConfigSchema}
            config={config}
            filter={tabFilter}
        />
    );
};

export default hivTestingServices;
