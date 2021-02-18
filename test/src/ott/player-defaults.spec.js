import {getDefaultRedirectOptions} from './../../../src/ott/player-defaults';

describe('redirectExternalStreamsHandler', function () {
  it('should return the default', function () {
    const defaultConfig = getDefaultRedirectOptions({});
    (typeof defaultConfig.sources.options.redirectExternalStreamsHandler === 'function').should.be.true;
  });

  it('should return void if already configured on player config', function () {
    const defaultConfig = getDefaultRedirectOptions({
      sources: {
        options: {
          redirectExternalStreamsHandler: () => {}
        }
      }
    });
    (defaultConfig.sources === undefined).should.be.true;
  });

  it('should return void if already configured on media config', function () {
    const defaultConfig = getDefaultRedirectOptions(
      {},
      {
        sources: {
          options: {
            redirectExternalStreamsHandler: () => {}
          }
        }
      }
    );
    (defaultConfig.sources === undefined).should.be.true;
  });
});
