import {getDefaultRedirectOptions} from './../../../src/ovp/player-defaults';
import {Env} from '@playkit-js/playkit-js';

describe('getDefaultRedirectOptions', function () {
  let sandbox;
  beforeEach(function () {
    sandbox = sinon.createSandbox();
  });

  afterEach(function () {
    sandbox.restore();
  });
  it('should return void for chrome', function () {
    const defaultConfig = getDefaultRedirectOptions({});
    (defaultConfig.sources === undefined).should.be.true;
  });

  it('should return true for ie11', function () {
    sandbox.stub(Env, 'browser').get(() => ({name: 'IE'}));
    const defaultConfig = getDefaultRedirectOptions({});
    defaultConfig.sources.options.forceRedirectExternalStreams.should.be.true;
  });

  it('should return true for chromecast', function () {
    sandbox.stub(Env, 'device').get(() => ({model: 'Chromecast'}));
    const defaultConfig = getDefaultRedirectOptions({});
    defaultConfig.sources.options.forceRedirectExternalStreams.should.be.true;
  });

  it('should return void for ie11 if already configured', function () {
    sandbox.stub(Env, 'browser').get(() => ({name: 'IE'}));
    const defaultConfig = getDefaultRedirectOptions({sources: {options: {forceRedirectExternalStreams: false}}});
    (defaultConfig.sources === undefined).should.be.true;
  });

  it('should return void for chromecast if already configured', function () {
    sandbox.stub(Env, 'device').get(() => ({model: 'Chromecast'}));
    const defaultConfig = getDefaultRedirectOptions({sources: {options: {forceRedirectExternalStreams: false}}});
    (defaultConfig.sources === undefined).should.be.true;
  });
});
