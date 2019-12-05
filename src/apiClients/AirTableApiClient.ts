import Airtable from 'airtable';
import CachedItem from '../../src/utils/CachedItem';
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
