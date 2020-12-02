import {ConfigEvaluator, getEncodedReferrer} from '../../../../src/common/plugins';

let sandbox = sinon.createSandbox();

describe('evaluatePluginsConfig', function () {
  const playerConfig = {
    targetId: 'myTargetId',
    provider: {
      partnerId: '1234'
    }
  };
  const pluginsConfig = {
    kava: {
      myHandler: function () {},
      myUnevaluatedConfig: '{{abc}}',
      myArray: [1, 'value', 0, true, '{{value}}', false]
    }
  };

  const pluginsConfigure = new ConfigEvaluator();

  it('should save the function after evaluatePluginsConfig called', function () {
    pluginsConfigure.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.myHandler.should.exist;
    pluginsConfig.kava.myHandler.should.be.instanceof(Function);
  });

  it('should evaluate plugins config', function () {
    pluginsConfigure.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.partnerId.should.exist;
    pluginsConfig.kava.partnerId.should.equal(1234);
  });

  it('should remove unevaluated plugins config', function () {
    pluginsConfigure.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.should.not.have.property('myUnevaluatedConfig');
  });

  it('should remove unevaluated plugins config from array', function () {
    pluginsConfigure.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.myArray.should.deep.equal([1, 'value', 0, true, false]);
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
