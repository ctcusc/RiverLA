import { InvalidParametersError } from './errors';

type TNodeEnv = 'development' | 'staging' | 'production' | 'test';

interface Environment {
  nodeEnv: TNodeEnv;
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

function getEnvironment(val: string | undefined): TNodeEnv {
  if (val === 'test' || val === 'production' || val === 'staging' || val === 'development') {
    return val;
  }

  throw new InvalidParametersError(`Invalid value for NODE_ENV: ${val}`);
}

const environment: Environment = {
  nodeEnv: getEnvironment(process.env.NODE_ENV),
  apiKeys: {
    airtable: getString(process.env.AIRTABLE_API_KEY, 'AIRTABLE_API_KEY'),
    sendgrid: getString(process.env.SENDGRID_API_KEY, 'SENDGRID_API_KEY'),
  },
  server: {
    port: getInteger(process.env.PORT, 'PORT', 3000),
  },
};

export default environment;
