interface AirTableFilters {
  interestCategories?: string[];
  riverSections?: string[];
}

interface Organization {
  name: string;
  // fill in the rest
}

class AirTableApiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    // remove this log when this API key is finally used somewhere
    console.log(`SendGridAPIClient initialized with api key ${this.apiKey}`);
  }

  async getAllOrganizations(filters: AirTableFilters = {}): Promise<Organization[]> {
    const { interestCategories, riverSections } = filters;
    console.log(
      `getAllOrganizations called with filters:`,
      `interestCategories: ${interestCategories}`,
      `riverSections: ${riverSections}`,
    );
    // returns a promise that resolves with all organizations that correspond to passed in interestCategories and riverSections.
    // if interestCategories/riverSections is not passed in, we do not need to filter based on those things
    return [];
  }
}

export default AirTableApiClient;