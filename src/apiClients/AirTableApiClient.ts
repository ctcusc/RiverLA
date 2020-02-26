/**
 * Main client to interact with AirTable API.
 *
 * The [[AirTableApiClient]] class holds wrapper functions to call AirTable's API as well
 * a function to log errors in AirTable.
 */

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

/**
 * Takes raw data from AirTable API call and stores it in a Record object.
 *
 * @param record - [[Record]] object containing one row's data (corresponding to one organization) from AirTable
 * @returns A new Organization object containing data from the record parameter
 */
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

/**
 * A wrapper class to interact with the AirTable API.
 *
 * This class acts as a client to make calls to AirTable's API for
 * one specific table, which is idenitified by the base variable.
 *
 */
class AirTableApiClient {
  private base: any;
  private cachedOrganizations: CachedItem<Organization[]>;

  constructor() {
    this.base = new Airtable().base(env.airtableBaseId);
    this.cachedOrganizations = new CachedItem<Organization[]>(1000);
  }

  /**
   * Returns a list of organizations by making an API call to AirTable.
   * Uses the API's select method, which makes a GET request to the Organizations endpoint.
   * Takes in optional filters to retrieve organizations with specific fields.
   *
   * @param filters - Object containing lists of options to filter by. If these lists are empty,
   * no organizations will be filtered out. Within each list, organizations only need to satisfy at least one
   * of the desired options. For example, if multiple interest categories are specified, an organization only
   * needs to match one of them to be returned. Between the lists, an organization must satisfy at least one
   * option from each. Therefore, an organization would need to have at least one of the desired interest
   * categories AND one of the desired river sections to prevent being filtered out.
   * @returns An array of [[Organization]] objects satisfying the desired filters
   */
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
  /**
   * Takes an error object and stores its information in AirTable.
   * If the Errors table has more than MAXERRORLENGTH records, the oldest 20
   * records are deleted. This function will not throw exceptions.
   * If a problem occurs in the function, the error will be logged
   * to the console and the function will resolve to false.
   *
   * @param error - Error object containing data about an error
   * @returns A promise to a boolean indicating if the error was
   * logged successfully.
   */

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
