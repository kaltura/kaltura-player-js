import {evaluatePluginsConfig} from '../../../../src/common/plugins/plugins-config';

describe('evaluatePluginsConfig', function() {
  const playerConfig = {
    targetId: 'myTargetId',
    provider: {
      partnerId: '1234'
    }
  };
  const pluginsConfig = {
    kava: {
      myHandler: function() {},
      myUnevaluatedConfig: '{{abc}}',
      myArray: [1, 'value', 0, true, '{{value}}', false]
    }
  };

  it('should save the function after evaluatePluginsConfig called', function() {
    evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.myHandler.should.exist;
    pluginsConfig.kava.myHandler.should.be.instanceof(Function);
  });

  it('should evaluate plugins config', function() {
    evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.partnerId.should.exist;
    pluginsConfig.kava.partnerId.should.equal(1234);
  });

  it('should remove unevaluated plugins config', function() {
    evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.should.not.have.property('myUnevaluatedConfig');
  });

  it('should remove unevaluated plugins config from array', function() {
    evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.myArray.should.deep.equal([1, 'value', 0, true, false]);
  });
});
