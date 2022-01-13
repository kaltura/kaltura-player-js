import {ConfigEvaluator, getEncodedReferrer} from '../../../../src/common/plugins';

let sandbox = sinon.createSandbox();

describe('evaluatePluginsConfig', function () {
  let playerConfig, pluginsConfig, configEvaluator;
  beforeEach(function () {
    playerConfig = {
      targetId: 'myTargetId',
      provider: {
        partnerId: '1234'
      }
    };
    pluginsConfig = {
      kava: {
        myHandler: function () {},
        myUnevaluatedConfig: '{{abc}}',
        myArray: [1, 'value', 0, true, '{{value}}', false]
      }
    };

    configEvaluator = new ConfigEvaluator();
  });

  it('should save the function after evaluatePluginsConfig called', function () {
    configEvaluator.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.myHandler.should.exist;
    pluginsConfig.kava.myHandler.should.be.instanceof(Function);
  });

  it('should evaluate plugins config', function () {
    configEvaluator.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.partnerId.should.exist;
    pluginsConfig.kava.partnerId.should.equal(1234);
  });

  it('should remove unevaluated plugins config', function () {
    configEvaluator.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.should.not.have.property('myUnevaluatedConfig');
  });

  it('should remove unevaluated plugins config from array', function () {
    configEvaluator.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.myArray.should.deep.equal([1, 'value', 0, true, false]);
  });

  it('should set playerVersion as productVersion from server', function () {
    window.__kalturaplayerdata = {productVersion: '7.43.1'};
    configEvaluator.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.should.have.property('playerVersion');
    pluginsConfig.kava.playerVersion.should.equal('7.43.1');
  });

  it('should set playerVersion as playerVersion', function () {
    window.__kalturaplayerdata = {};
    configEvaluator.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.should.have.property('playerVersion');
    pluginsConfig.kava.playerVersion.should.equal(__VERSION__);
  });
});

describe('getEncodedReferrer', function () {
  it('should encode the referrer', function () {
    sandbox.stub(window.parent.document, 'URL').get(() => {
      return 'http://localhost:3000/?debugKalturaPlayer';
    });
    getEncodedReferrer().should.be.equal('http%3A%2F%2Flocalhost%3A3000%2F%3FdebugKalturaPlayer');
  });
});
