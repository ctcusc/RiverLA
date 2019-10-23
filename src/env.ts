import { InvalidParametersError } from './errors';

interface Environment {
  apiKeys: {
    airtable: string;
    sendgrid: string;
  };
  server: {
    port: number;
  };
}

function getInteger(val: string | undefined, variableName: string, defaultValue?: number): number {
  if (val === undefined) {
    if (defaultValue === undefined) {
      throw new InvalidParametersError(`Required environment variable ${variableName} is undefined`);
    }
    return defaultValue;
  }

  const ret = parseInt(val, 10);
  if (isNaN(ret) || !Number.isSafeInteger(ret)) {
    throw new InvalidParametersError(
      `Environment variable ${variableName} is an integer, but its value ${val} is not an integer`,
    );
  }
  return ret;
}

function getString(val: string | undefined, variableName: string, defaultValue?: string): string {
  if (val === undefined || val === '') {
    if (defaultValue === undefined) {
      throw new InvalidParametersError(`Required environment variable ${variableName} is undefined`);
    }
    return defaultValue;
  }

  return val;
}

const environment: Environment = {
  apiKeys: {
    airtable: getString(process.env.AIRTABLE_API_KEY, 'AIRTABLE_API_KEY'),
    sendgrid: getString(process.env.SENDGRID_API_KEY, 'SENDGRID_API_KEY'),
  },
  server: {
    port: getInteger(process.env.PORT, 'PORT', 3000),
  },
};

export default environment;
