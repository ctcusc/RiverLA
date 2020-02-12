//the path of env and errors
import { getEnvironment, getInteger, getString } from '../src/env';
import { InvalidParametersError } from '../src/errors';
import test from 'ava';

test('Throw Invalid Parameters Error if value and default value not defined in getInteger', t => {
  const error = t.throws(() => {
    getInteger(undefined, 'integer');
  }, InvalidParametersError);

  const message = `Required environment variable integer is undefined`;

  t.is(error.message, message);
});

test('Return default value if value is undefined', t => {
  const integer: number = getInteger(undefined, 'integer', 40);
  const answer = 40;

  t.is(integer, answer);
});

test('Throw Invalid Parameters Error if value is not an integer', t => {
  const error = t.throws(() => {
    getInteger('abc', 'integer');
  }, InvalidParametersError);

  const message = `Environment variable integer is an integer, but its value abc is not an integer`;

  t.is(error.message, message);
});

test('Return the converted value if value can be converted to integer', t => {
  const integer: number = getInteger('37', 'integer');
  const answer = 37;

  t.is(integer, answer);
});

test('Throw Invalid Parameters Error if value and default value not defined in getString', t => {
  const error = t.throws(() => {
    getString(undefined, 'string');
  }, InvalidParametersError);

  const message = `Required environment variable string is undefined`;

  t.is(error.message, message);
});

test('Return default value if value is undefined or empty', t => {
  const string: string = getString('', 'string', 'mystring');
  const answer = 'mystring';

  t.is(string, answer);
});

test('Return value if value is not undefined nor empty', t => {
  const string: string = getString('mystring', 'string');
  const answer = 'mystring';

  t.is(string, answer);
});

test('Throw Invalid Parameters Error if value is not of type TNodeEnv', t => {
  const error = t.throws(() => {
    getEnvironment('string');
  }, InvalidParametersError);

  const message = `Invalid value for NODE_ENV: string`;

  t.is(error.message, message);
});

test('Return value if value is of type TNodeEnv', t => {
  const value: string = getEnvironment('development');
  const answer = 'development';

  t.is(value, answer);
});
