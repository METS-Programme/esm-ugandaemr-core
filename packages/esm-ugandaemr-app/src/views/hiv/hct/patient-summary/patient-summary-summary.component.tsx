import { EncounterTile, EncounterTileColumn, getEncounterTileColumns } from "@ohri/openmrs-esm-ohri-commons-lib";
import { useConfig } from "@openmrs/esm-framework";
import React from "react";
import { useTranslation } from "react-i18next";
import characteristicsColumnConfigSchema from "./patient-summary-baseline-information-config.json"
import hivMonitoringColumnsConfigSchema from "./patient-summary-hiv-monitoring-config.json"
import tptColumnsConfigSchema from "./patient-summary-tpt-config.json"
import lastVisitColumnsConfigSchema from "./patient-summary-visit-config.json"


interface OverviewListProps {
    patientUuid: string;
}
const PatientSummaryOverviewList: React.FC<OverviewListProps> = ({ patientUuid }) => {
    const { t } = useTranslation();
    const config = useConfig();

    const headerCharacteristics = t('characteristicsTitle', 'Characteristics');
    const headerHIVMonitoring = t('hivMonitoring', 'HIV Monitoring');
    const headerTPT = t('tpt', 'TPT');
    const headerLastVisitDetails = t('lastVisitDetails', 'Last Visit Details');

    const columnsCharacteristics: EncounterTileColumn[] = getEncounterTileColumns(characteristicsColumnConfigSchema, config);

    // const columnsHIVMonitoring: EncounterTileColumn[] = getEncounterTileColumns(hivMonitoringColumnsConfigSchema, config);

    const columnsTPT: EncounterTileColumn[] = getEncounterTileColumns(tptColumnsConfigSchema, config);

    const columnsLastVisitDetails: EncounterTileColumn[] = getEncounterTileColumns(lastVisitColumnsConfigSchema, config);

    return (
        <>
            <EncounterTile patientUuid={patientUuid} columns={columnsCharacteristics} headerTitle={headerCharacteristics} />
            {/* <EncounterTile patientUuid={patientUuid} columns={columnsHIVMonitoring} headerTitle={headerHIVMonitoring} /> */}
            {/* <EncounterTile patientUuid={patientUuid} columns={columnsTPT} headerTitle={headerTPT} /> */}
            <EncounterTile patientUuid={patientUuid} columns={columnsLastVisitDetails} headerTitle={headerLastVisitDetails} />
        </>
    );
};

export default PatientSummaryOverviewList;