import AirTableLogger from '../../src/apiClients/AirTableLogger';
import { ErrorObject } from '../../src/apiClients/AirTableApiClient';
import apiClients from '../../src/apiClients/index';
import env from '../../src/env';
//import nock from 'nock';
import sinon from 'sinon';
import test from 'ava';

const errorObject: ErrorObject = {
  fields: {
    Name: 'My error name',
    Message: 'Testing message',
    Status: '404',
    Organization: ['rec8bi23a15qZt29b'],
  },
};

test.serial("Checks output is logged and not pushed to table when env=='development'", async t => {
  const nodeEnvStub = sinon.stub(env, 'nodeEnv').value('development');
  const logErrorStub = sinon.stub(apiClients.airtableApiClient, 'logError');
  const consoleStub = sinon.stub(console, 'log');
  const logger = new AirTableLogger();
  logger.logError(errorObject);
  t.true(consoleStub.calledWith(errorObject) && logErrorStub.notCalled);
  nodeEnvStub.restore();
  logErrorStub.restore();
  consoleStub.restore();
});
test.serial("Checks airtableApiClient.logError is called when env!='development'", async t => {
  const nodeEnvStub = sinon.stub(env, 'nodeEnv').value('other');
  const logErrorStub = sinon.stub(apiClients.airtableApiClient, 'logError');
  const consoleStub = sinon.stub(console, 'log');
  const logger = new AirTableLogger();
  logger.logError(errorObject);
  t.true(consoleStub.notCalled && logErrorStub.calledWith(errorObject));
  nodeEnvStub.restore();
  logErrorStub.restore();
  consoleStub.restore();
});
