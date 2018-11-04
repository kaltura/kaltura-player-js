import {evaluatePluginsConfig} from '../../../../src/common/plugins/plugins-config';

describe('evaluatePluginsConfig', function() {
  const config = {
    plugins: {
      kava: {
        myHandler: function() {}
      }
    }
  };

  it('should save the function after evaluatePluginsConfig called', function() {
    evaluatePluginsConfig(config);
    config.plugins.kava.myHandler.should.exist;
    config.plugins.kava.myHandler.should.be.instanceof(Function);
  });
});
