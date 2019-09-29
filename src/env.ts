import { InvalidParameterError } from './errors';

interface Environment {
  server: {
    port: number,
  },
}

function getInteger(val: string | undefined, variableName: string, defaultValue?: number): number {
  if (val === undefined) {
    if (defaultValue === undefined) {
      throw new InvalidParameterError(`Required environment variable ${variableName} is undefined`);
    }
    return defaultValue;
  }

  const ret = parseInt(val, 10);
  if (isNaN(ret) || !Number.isSafeInteger(ret)) {
    throw new InvalidParameterError(`${val} is not an integer`);
  }
  return ret;
}

const environment: Environment = {
  server: {
    port: getInteger(process.env.PORT, 'PORT', 3000),
  },
};

export default environment;
