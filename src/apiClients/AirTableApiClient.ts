import Airtable from 'airtable';

export interface AirTableFilters {
  interestCategories?: string[];
  riverSections?: string[];
}

export interface Organization {
  name: string;
  // fill in the rest
  description: string;
  activity: string;
  interestCategories: string[];
  riverSection: string;
  phoneNumber: string;
  url: string;
  email: string;
}

class AirTableApiClient {
  private base: any;

  constructor(apiKey: string) {
    this.base = new Airtable({ apiKey: apiKey }).base('appEHr8iHguvEfXTQ');
  }

  getAllOrganizations(filters: AirTableFilters = {}): Promise<Organization[]> {
    const { interestCategories, riverSections } = filters;
    console.log(
      `getAllOrganizations called with filters:`,
      `interestCategories: ${interestCategories}`,
      `riverSections: ${riverSections}`,
    );
    let organizations: Organization[] = [];

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

    const empty = (element: any) => element != 'undefined';

    const promise: Promise<Organization[]> = new Promise((resolve, reject) => {
      this.base('Organizations')
        .select({
          view: 'Grid view',
        })
        .eachPage(
          (records: any[], fetchNextPage: any) => {
            let filteredRecords: any[] = records;
            filteredRecords = records.filter(record => {
              return record != 'undefined';
            });
            organizations = organizations.concat(filteredRecords.map(recordToOrganization));
            if (typeof riverSections !== 'undefined') {
              organizations = organizations.filter(organization => {
                return riverSections.includes(organization.riverSection);
              });
            }
            if (typeof interestCategories !== 'undefined') {
              organizations = organizations.filter(organization => {
                return interestCategories
                  .filter(category => {
                    return organization.interestCategories.includes(category);
                  })
                  .some(empty);
              });
            }
            fetchNextPage();
          },
          function done(err: Error) {
            if (err) {
              reject(err);
            } else {
              resolve(organizations);
            }
          },
        );
    });
    // returns a promise that resolves with all organizations that correspond to passed in interestCategories and riverSections.
    // if interestCategories/riverSections is not passed in, we do not need to filter based on those things
    return promise;
  }
}

export default AirTableApiClient;
