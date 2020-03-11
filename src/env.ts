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
  airtableBaseId: string;
  riverLATemplateID: string;
  nationbuilderWebhookToken: string;
}

export function getInteger(variableName: string, defaultValue?: number): number {
  const val = process.env[variableName];
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

export function getString(variableName: string, defaultValue?: string): string {
  const val = process.env[variableName];
  if (val === undefined || val === '') {
    if (defaultValue === undefined) {
      throw new InvalidParametersError(`Required environment variable ${variableName} is undefined`);
    }
    return defaultValue;
  }

  return val;
}

export function getEnvironment(): TNodeEnv {
  const val = process.env.NODE_ENV;
  if (val === 'test' || val === 'production' || val === 'staging' || val === 'development') {
    return val;
  }

  throw new InvalidParametersError(`Invalid value for NODE_ENV: ${val}`);
}

const env: Environment = {
  apiKeys: {
    airtable: getString('AIRTABLE_API_KEY'),
    sendgrid: getString('SENDGRID_API_KEY'),
  },
  nodeEnv: getEnvironment(),
  server: {
    port: getInteger('PORT', 80),
  },
  riverLATemplateID: getString('RIVERLA_TEMPLATE_ID'),
  airtableBaseId: getString('AIRTABLE_BASE_ID'),
  nationbuilderWebhookToken: getString('NATIONBUILDER_WEBHOOK_TOKEN'),
};

export default env;
