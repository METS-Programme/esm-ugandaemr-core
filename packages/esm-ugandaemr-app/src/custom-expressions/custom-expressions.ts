import { OpenmrsResource } from '@openmrs/esm-framework';
import { DataSource } from '@openmrs/esm-form-engine-lib';
import { getCohortCategorization } from './custom-apis';

export class DSDMCategorizationDatasource implements DataSource<OpenmrsResource> {
  fetchSingleItem(uuid: string): Promise<OpenmrsResource> {
    throw new Error('Method not implemented.');
  }
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
