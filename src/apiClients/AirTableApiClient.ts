import Airtable from 'airtable';
import CachedItem from '../utils/CachedItem';
import env from '../env';

const MAXERRORLENGTH = 100;
export interface AirTableFilters {
  interestCategories?: string[];
  riverSections?: string[];
}

export interface Organization {
  name: string;
  description: string;
  activity: string;
  interestCategories: string[];
  riverSection: string;
  phoneNumber: string;
  url: string;
  email: string;
}
/**
type TFieldName =
  | 'Name'
  | 'Description'
  | 'Activity'
  | 'Interest Categories'
  | 'River Section'
  | 'Phone Number'
  | 'URL'
  | 'Email';
*/

export interface ErrorObject {
  fields: {
    Name?: string;
    Message?: string;
    Status?: string;
    Organization?: [string];
  };
}

interface Record {
  fields: {
    ['Name']: string;
    ['Description']: string;
    ['Activity']: string;
    ['Interest Categories']: string[];
    ['River Section']: string;
    ['Phone Number']: string;
    ['URL']: string;
    ['Email']: string;
  };
}

function recordToOrganization(record: Record): Organization {
  return {
    name: record.fields['Name'],
    description: record.fields['Description'],
    activity: record.fields['Activity'],
    interestCategories: record.fields['Interest Categories'],
    riverSection: record.fields['River Section'],
    phoneNumber: record.fields['Phone Number'],
    url: record.fields['URL'],
    email: record.fields['Email'],
  };
}

const BASE_NAMES = {
  ORGANIZATIONS: 'Organizations',
  ERRORS: 'Errors',
};

class AirTableApiClient {
  private base: any;
  private cachedOrganizations: CachedItem<Organization[]>;

  constructor() {
    this.base = new Airtable().base(env.airtableBaseId);
    this.cachedOrganizations = new CachedItem<Organization[]>(1000);
  }

  async getOrganizations(filters: AirTableFilters = {}): Promise<Organization[]> {
    const { interestCategories, riverSections } = filters;
    let organizations = this.cachedOrganizations.get();
    if (organizations === null) {
      const organizationRecords: Record[] = await this.base(BASE_NAMES.ORGANIZATIONS)
        .select({ view: 'Grid view' })
        .all();

      organizations = organizationRecords.filter((record?: Record) => record !== undefined).map(recordToOrganization);

      this.cachedOrganizations.set(organizations);
    }

    if (riverSections !== undefined) {
      organizations = organizations.filter(organization => {
        return riverSections.includes(organization.riverSection);
      });
    }

    if (interestCategories !== undefined) {
      organizations = organizations.filter(organization => {
        return interestCategories.some(category => organization.interestCategories.includes(category));
      });
    }

    return organizations;
  }

  async logError(error: ErrorObject): Promise<boolean> {
    const promise: Promise<boolean> = new Promise(async resolve => {
      try {
        await this.base(BASE_NAMES.ERRORS).create([error]);

        const allRecords = await this.base(BASE_NAMES.ERRORS)
          .select({ view: 'Grid view' })
          .all();

        if (allRecords.length > MAXERRORLENGTH) {
          let deleteSet = allRecords.slice(0, 10).map((record: { id: string }) => record.id);
          await this.base(BASE_NAMES.ERRORS).destroy(deleteSet);

          deleteSet = allRecords.slice(10, 20).map((record: { id: string }) => record.id);
          await this.base(BASE_NAMES.ERRORS).destroy(deleteSet);
        }
      } catch (e) {
        console.log('Failed to log message.');
        console.log(e);
        resolve(false);
      }
      resolve(true);
    });
    return promise;
  }
}

export default AirTableApiClient;
