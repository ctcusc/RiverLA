import Airtable from 'airtable';
import CachedItem from '../utils/CachedItem';
import env from '../env';

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
};

class AirTableApiClient {
  private base: any;
  private cache: CachedItem<Organization[]>;

  constructor() {
    this.base = new Airtable().base(env.airtableBaseId);
    this.cache = new CachedItem<Organization[]>(1000);
  }

  async getOrganizations(filters: AirTableFilters = {}): Promise<Organization[]> {
    const { interestCategories, riverSections } = filters;
    let organizations = this.cache.get();
    if (organizations === null) {
      const organizationRecords: Record[] = await this.base(BASE_NAMES.ORGANIZATIONS)
        .select({ view: 'Grid view' })
        .all();
      organizations = organizationRecords.filter((record?: Record) => record !== undefined).map(recordToOrganization);

      this.cache.set(organizations);
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
}

export default AirTableApiClient;
