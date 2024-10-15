import { getCohortCategorization, getConceptDataType, getLatestObs, getPatientPrograms } from './custom-apis';
import dayjs from 'dayjs';
import { configSchema } from '@ugandaemr/esm-care-panel-app/src/config-schema';
import { OpenmrsResource } from '@openmrs/esm-framework';
import { DataSource } from '@openmrs/openmrs-form-engine-lib';

export async function latestObs(patientId: string, conceptUuid: string) {
  const response = await getLatestObs(patientId, conceptUuid);

  if (response) {
    const conceptDataType = await getConceptDataType(conceptUuid);

    if (conceptDataType === 'Date') {
      return dayjs(response?.valueDateTime).format('DD/MM/YYYY');
    } else if (conceptDataType === 'Coded') {
      return response?.valueCodeableConcept?.coding[0]?.display;
    } else if (conceptDataType === 'Numeric') {
      const valueQuantity = response?.valueQuantity?.value;
      const unit = response?.valueQuantity?.unit;

      const referenceRangeLow = response?.referenceRange?.[0]?.low?.value;
      const referenceRangeHigh = response?.referenceRange?.[0]?.high?.value;

      if (referenceRangeLow !== undefined && referenceRangeHigh !== undefined) {
        return `${referenceRangeLow} - ${referenceRangeHigh} ${unit || ''}`;
      } else if (valueQuantity !== undefined) {
        return `${valueQuantity} ${unit || ''}`;
      }
    }
  }
}

export async function patientDSDM(patiendId: string) {
  const DSDModels = await getPatientPrograms(patiendId);

  return DSDModels[0]?.state?.concept?.display;
}

export function CalcMonthsOnART(artStartDate: Date, followupDate: Date) {
  let resultMonthsOnART: number;
  let artInDays = Math.round((followupDate.getTime() - artStartDate.getTime?.()) / 86400000);
  if (artStartDate && followupDate && artInDays < 30) {
    resultMonthsOnART = 0;
  } else if (artStartDate && followupDate && artInDays >= 30) {
    resultMonthsOnART = Math.floor(artInDays / 30);
  }
  return artStartDate && followupDate ? resultMonthsOnART : null;
}

export class DSDMCategorizationDatasource implements DataSource<OpenmrsResource> {
  fetchData(searchTerm: string, config?: Record<string, any>): Promise<any[]> {
    return getCohortCategorization(config?.cohortUuid).then((response) => {
      let data = [];
      response?.data?.results?.map((dataItem) => {
        data.push({
          display: dataItem?.name,
          uuid: dataItem?.uuid,
        });
      });

      return data?.map((item) => this.toUuidAndDisplay(item));
    });
  }

  toUuidAndDisplay(data: OpenmrsResource): OpenmrsResource {
    if (typeof data.uuid === 'undefined' || typeof data.display === 'undefined') {
      throw new Error("'uuid' or 'display' not found in the OpenMRS object.");
    }
    return data;
  }
}
