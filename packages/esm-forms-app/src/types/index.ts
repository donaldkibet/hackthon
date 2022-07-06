import { OpenmrsResource } from '@openmrs/esm-framework';

export interface Form {
  uuid: string;
  encounterType?: OpenmrsResource;
  name: string;
  display: string;
  version: string;
  published: boolean;
  retired: boolean;
}
