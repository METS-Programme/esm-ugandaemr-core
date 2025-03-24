import React from 'react';
import { useConfig } from '@openmrs/esm-framework';
import { EncounterListTabsComponent } from '@ohri/openmrs-esm-ohri-commons-lib';
import vmmcConfigSchema from './vmm-services-config.json';

interface OverviewListProps {
    patientUuid: string;
}

const VmmcServices: React.FC<OverviewListProps> = ({ patientUuid }) => {
    const config = useConfig();

    const tabFilter = (encounter, formName) => {
        return encounter?.form?.name === formName;
    };

    return (
        <EncounterListTabsComponent
            patientUuid={patientUuid}
            configSchema={vmmcConfigSchema}
            config={config}
            filter={tabFilter}
        />
    );
};

export default VmmcServices;
