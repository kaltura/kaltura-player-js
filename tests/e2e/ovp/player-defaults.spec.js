import { getDefaultRedirectOptions } from '../../../src/ovp/player-defaults';
import { Env, MediaType } from '@playkit-js/playkit-js';

describe('getDefaultRedirectOptions', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });
  describe('forceRedirectExternalStreams', () => {
    it('should return void for vod on ie11', () => {
      sandbox.stub(Env, 'browser').get(() => ({ name: 'IE' }));
      const defaultConfig = getDefaultRedirectOptions({}, { sources: { type: MediaType.VOD } });
      (defaultConfig.sources.options.forceRedirectExternalStreams === undefined).should.be.true;
    });

    it('should return void for vod on chromecast', () => {
      sandbox.stub(Env, 'device').get(() => ({ model: 'Chromecast' }));
      const defaultConfig = getDefaultRedirectOptions({}, { sources: { type: MediaType.VOD } });
      (defaultConfig.sources.options.forceRedirectExternalStreams === undefined).should.be.true;
    });

    it('should return void for live chrome', () => {
      const defaultConfig = getDefaultRedirectOptions({}, { sources: { type: MediaType.LIVE } });
      (defaultConfig.sources.options.forceRedirectExternalStreams === undefined).should.be.true;
    });

    it('should return true for live on ie11', () => {
      sandbox.stub(Env, 'browser').get(() => ({ name: 'IE' }));
      const defaultConfig = getDefaultRedirectOptions({}, { sources: { type: MediaType.LIVE } });
      defaultConfig.sources.options.forceRedirectExternalStreams.should.be.true;
    });

    it('should return true for live on chromecast', () => {
      sandbox.stub(Env, 'device').get(() => ({ model: 'Chromecast' }));
      const defaultConfig = getDefaultRedirectOptions({}, { sources: { type: MediaType.LIVE } });
      defaultConfig.sources.options.forceRedirectExternalStreams.should.be.true;
    });

    it('should return void for live on ie11 if already configured on player config', () => {
      sandbox.stub(Env, 'browser').get(() => ({ name: 'IE' }));
      const defaultConfig = getDefaultRedirectOptions(
        { sources: { options: { forceRedirectExternalStreams: false } } },
        { sources: { type: MediaType.LIVE } }
      );
      (defaultConfig.sources.options.forceRedirectExternalStreams === undefined).should.be.true;
    });

    it('should return void for live on ie11 if already configured on media config', () => {
      sandbox.stub(Env, 'browser').get(() => ({ name: 'IE' }));
      const defaultConfig = getDefaultRedirectOptions(
        {},
        {
          sources: {
            type: MediaType.LIVE,
            options: { forceRedirectExternalStreams: false }
          }
        }
      );
      (defaultConfig.sources.options.forceRedirectExternalStreams === undefined).should.be.true;
    });

    it('should return void for live on chromecast if already configured on player config', () => {
      sandbox.stub(Env, 'device').get(() => ({ model: 'Chromecast' }));
      const defaultConfig = getDefaultRedirectOptions(
        { sources: { options: { forceRedirectExternalStreams: false } } },
        { sources: { type: MediaType.LIVE } }
      );
      (defaultConfig.sources.options.forceRedirectExternalStreams === undefined).should.be.true;
    });

    it('should return void for live on chromecast if already configured on media config', () => {
      sandbox.stub(Env, 'device').get(() => ({ model: 'Chromecast' }));
      const defaultConfig = getDefaultRedirectOptions(
        {},
        {
          sources: {
            type: MediaType.LIVE,
            options: { forceRedirectExternalStreams: false }
          }
        }
      );
      (defaultConfig.sources.options.forceRedirectExternalStreams === undefined).should.be.true;
    });
  });

  describe('redirectExternalStreamsHandler', () => {
    it('should return the default', () => {
      const defaultConfig = getDefaultRedirectOptions({});
      (typeof defaultConfig.sources.options.redirectExternalStreamsHandler === 'function').should.be.true;
    });

    it('should return void if already configured on player config', () => {
      const defaultConfig = getDefaultRedirectOptions({
        sources: { options: { redirectExternalStreamsHandler: () => {} } }
      });
      (defaultConfig.sources === undefined).should.be.true;
    });

    it('should return void if already configured on media config', () => {
      const defaultConfig = getDefaultRedirectOptions({}, { sources: { options: { redirectExternalStreamsHandler: () => {} } } });
      (defaultConfig.sources === undefined).should.be.true;
    });
  });
});
