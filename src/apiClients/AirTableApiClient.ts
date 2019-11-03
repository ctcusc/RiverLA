import Airtable from 'airtable';

interface AirTableFilters {
  interestCategories?: string[];
  riverSections?: string[];
}

export interface Organization {
  name: string;
  // fill in the rest
  description: string;
  activity: string;
  interestCategories: string[];
  riverSections: string;
  phoneNumber: string;
  url: string;
  email: string;
}

class AirTableApiClient {
  private apiKey: string;
  private base: any;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.base = new Airtable({ apiKey: apiKey }).base('appEHr8iHguvEfXTQ');
    // remove this log when this API key is finally used somewhere
    console.log(`AirTableAPIClient initialized with api key ${this.apiKey}`);
  }

  async getAllOrganizations(filters: AirTableFilters = {}): Promise<Organization[]> {
    const { interestCategories, riverSections } = filters;
    console.log(
      `getAllOrganizations called with filters:`,
      `interestCategories: ${interestCategories}`,
      `riverSections: ${riverSections}`,
    );
    const organizations: Organization[] = [];

    const promise: Promise<Organization[]> = new Promise((resolve, reject) => {
      this.base('Organizations')
        .select({
          view: 'Grid view',
        })
        .eachPage((records: any[], fetchNextPage: any) => {
          let filteredRecords: any[] = records;
          if (typeof riverSections !== 'undefined') {
            filteredRecords = records.filter(record => {
              return riverSections.includes(record.get('River Section'));
            });
          }
          if (typeof interestCategories !== 'undefined') {
            filteredRecords = filteredRecords.filter(record => {
              interestCategories.filter(category => {
                record.get('Interst Categories').includes(category);
              }).length != 0;
            });
          }
          organizations.concat(
            filteredRecords.map((record: any) => {
              if (typeof record === 'undefined') {
              }
              const org: Organization = {
                name: record.get('Name'),
                description: record.get('Description'),
                activity: record.get('Activity'),
                interestCategories: record.get('Interest Categories'),
                riverSections: record.get('River Section'),
                phoneNumber: record.get('Phone Number'),
                url: record.get('URL'),
                email: record.get('Email'),
              };
              console.log(org.name);
              return org;
            }),
          );
          fetchNextPage();
        }),
        function done(err: any) {
          if (err) {
            reject(err);
          } else {
            resolve(organizations);
          }
        };
    });
    // returns a promise that resolves with all organizations that correspond to passed in interestCategories and riverSections.
    // if interestCategories/riverSections is not passed in, we do not need to filter based on those things
    return promise;
  }
}

export default AirTableApiClient;
