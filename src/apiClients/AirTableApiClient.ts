import Airtable from 'airtable';
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

export interface ErrorObject {
  fields: {
    Name?: string;
    Message?: string;
    Status?: string;
    Organization?: [string];
  };
}

type TFieldName =
  | 'Name'
  | 'Description'
  | 'Activity'
  | 'Interest Categories'
  | 'River Section'
  | 'Phone Number'
  | 'URL'
  | 'Email';

interface Record {
  get: (fieldName: TFieldName) => string | string[];
}

function recordToOrganization(record: Record): Organization {
  return {
    name: record.get('Name') as string,
    description: record.get('Description') as string,
    activity: record.get('Activity') as string,
    interestCategories: record.get('Interest Categories') as string[],
    riverSection: record.get('River Section') as string,
    phoneNumber: record.get('Phone Number') as string,
    url: record.get('URL') as string,
    email: record.get('Email') as string,
  };
}

const BASE_NAMES = {
  ORGANIZATIONS: 'Organizations',
  ERRORS: 'Errors',
};

class AirTableApiClient {
  private base: any;

  constructor() {
    this.base = new Airtable().base(env.airtableBaseId);
  }

  async getOrganizations(filters: AirTableFilters = {}): Promise<Organization[]> {
    const { interestCategories, riverSections } = filters;
    const organizationRecords = await this.base(BASE_NAMES.ORGANIZATIONS)
      .select({ view: 'Grid view' })
      .all();

    let organizations: Organization[] = organizationRecords
      .filter((record?: Record) => record !== undefined)
      .map(recordToOrganization);

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
