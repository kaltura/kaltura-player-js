import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon/pkg/sinon-esm';

chai.should();
chai.use(sinonChai);
global.chai = chai;
global.expect = chai.expect;
global.should = chai.should;
global.sinon = sinon;

const testsContext = require.context('./e2e', true);
testsContext.keys().forEach(testsContext);
