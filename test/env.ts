//the path of env and errors
import { getEnvironment, getInteger, getString } from '../src/env';

import { InvalidParametersError } from '../src/errors';
import sinon from 'sinon';
import test from 'ava';

test('Throw Invalid Parameters Error if variable and default value undefined in getInteger', t => {
  const error = t.throws(() => {
    getInteger('integer');
  }, InvalidParametersError);

  const message = `Required environment variable integer is undefined`;

  t.is(error.message, message);
});

test('Return default value if variable is undefined', t => {
  const integer: number = getInteger('integer', 40);
  const answer = 40;

  t.is(integer, answer);
});

test('Throw Invalid Parameters Error if value is not an integer', t => {
  sinon.stub(process.env, 'NODE_ENV').value('development');
  const error = t.throws(() => {
    getInteger('NODE_ENV');
  }, InvalidParametersError);

  const message = `Environment variable NODE_ENV is an integer, but its value development is not an integer`;

  t.is(error.message, message);
});

test('Return the converted value if value can be converted to integer', t => {
  sinon.stub(process.env, 'NODE_ENV').value('37');
  const integer: number = getInteger('NODE_ENV');
  const answer = 37;

  t.is(integer, answer);
});

test('Throw Invalid Parameters Error if variable and default value undefined in getString', t => {
  const error = t.throws(() => {
    getString('string');
  }, InvalidParametersError);

  const message = `Required environment variable string is undefined`;

  t.is(error.message, message);
});

test('Return default value if variable is undefined or empty', t => {
  const string: string = getString('string', 'mystring');
  const answer = 'mystring';

  t.is(string, answer);
});

test('Return value if variable is not undefined nor empty', t => {
  sinon.stub(process.env, 'NODE_ENV').value('abc');
  const string: string = getString('NODE_ENV');
  const answer = 'abc';

  t.is(string, answer);
});

test('Throw Invalid Parameters Error if value is not of type TNodeEnv', t => {
  sinon.stub(process.env, 'NODE_ENV').value('string');
  const error = t.throws(() => {
    getEnvironment();
  }, InvalidParametersError);

  const message = `Invalid value for NODE_ENV: string`;

  t.is(error.message, message);
});

test('Return value if value is of type TNodeEnv', t => {
  sinon.stub(process.env, 'NODE_ENV').value('development');
  const value: string = getEnvironment();
  const answer = 'development';

  t.is(value, answer);
});
