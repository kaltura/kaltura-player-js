import {ConfigEvaluator, getEncodedReferrer} from '../../../../src/common/plugins';

let sandbox = sinon.createSandbox();

describe('evaluatePluginsConfig', () => {
  let playerConfig, pluginsConfig, configEvaluator;

  const updatedArrayValue = [1, 'value', 0, true, false];
  const arrayValue = [...updatedArrayValue, '{{value}}'];

  beforeEach(() => {
    playerConfig = {
      targetId: 'myTargetId',
      provider: {
        partnerId: '1234'
      }
    };
    pluginsConfig = {
      kava: {
        myHandler: () => {},
        myUnevaluatedConfig: '{{abc}}',
        myArray: arrayValue
      }
    };

    configEvaluator = new ConfigEvaluator();
  });

  it('should save the function after evaluatePluginsConfig called', () => {
    configEvaluator.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.myHandler.should.exist;
    pluginsConfig.kava.myHandler.should.be.instanceof(Function);
  });

  it('should evaluate plugins config', () => {
    configEvaluator.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.partnerId.should.exist;
    pluginsConfig.kava.partnerId.should.equal(1234);
  });

  it('should remove unevaluated plugins config', () => {
    configEvaluator.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.should.not.have.property('myUnevaluatedConfig');
  });

  it('should remove unevaluated plugins config from array', () => {
    configEvaluator.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.myArray.should.deep.equal(updatedArrayValue);
  });

  it('should handle class instances in plugin config', () => {
    const map = new Map();

    pluginsConfig.kava.myInstance = map;
    configEvaluator.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.myInstance.should.deep.equal(map);
  });

  it('should handle class instances inside array in plugin config', () => {
    const map1 = new Map();
    const map2 = new Map();
    const instanceArrayValue = [map1, map2];

    pluginsConfig.kava.myArray = instanceArrayValue;
    configEvaluator.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.myArray.should.deep.equal(instanceArrayValue);
  });

  it('should handle functions arrays in plugin config', () => {
    function function1() {}
    function function2() {}
    const functionArray = [function1, function2];

    pluginsConfig.kava.myArray = [function1, function2];
    pluginsConfig.kava.myArray.should.deep.equal(functionArray);
  });

  it('should handle object arrays in plugin config', () => {
    const objectArrayValue = arrayValue.map(item => {
      return {
        value: item
      };
    });
    pluginsConfig.kava.myArray = objectArrayValue;
    configEvaluator.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.myArray.length.should.equal(updatedArrayValue.length);
  });

  it('should handle nested arrays inside object array in plugin config', () => {
    const objectArrayValue = [
      {
        value: arrayValue
      }
    ];

    pluginsConfig.kava.myArray = objectArrayValue;
    configEvaluator.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.myArray.length.should.equal(1);
    pluginsConfig.kava.myArray[0].value.length.should.equal(updatedArrayValue.length);
  });

  it('should handle nested functions inside object array in plugin config', () => {
    function function1() {}
    function function2() {}
    const functionArray = [function1, function2];

    pluginsConfig.kava.myArray = functionArray;
    configEvaluator.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.myArray.should.deep.equal(functionArray);
  });

  it('should handle nested class instances inside object array in plugin config', () => {
    const map1 = new Map();
    const map2 = new Map();
    const instanceArrayValue = [map1, map2];

    pluginsConfig.kava.myArray = instanceArrayValue;
    configEvaluator.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.myArray.should.deep.equal(instanceArrayValue);
  });

  it('should set playerVersion as productVersion from server', () => {
    window.__kalturaplayerdata = {productVersion: '7.43.1'};
    configEvaluator.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.should.have.property('playerVersion');
    pluginsConfig.kava.playerVersion.should.equal('7.43.1');
  });

  it('should set playerVersion as playerVersion', () => {
    window.__kalturaplayerdata = {};
    configEvaluator.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.should.have.property('playerVersion');
    pluginsConfig.kava.playerVersion.should.equal(__VERSION__);
  });

  it('should sanitize the entryName', () => {
    playerConfig.sources = {metadata: {name: 'invalid\tname'}};
    pluginsConfig.kava.entryName = '{{entryName}}';
    configEvaluator.evaluatePluginsConfig(pluginsConfig, playerConfig);
    pluginsConfig.kava.should.have.property('entryName');
    pluginsConfig.kava.entryName.should.equal('invalidname');
  });
});

describe('getEncodedReferrer', () => {
  it('should encode the referrer', () => {
    sandbox.stub(window.parent.document, 'URL').get(() => {
      return 'http://localhost:3000/?debugKalturaPlayer';
    });
    getEncodedReferrer().should.be.equal('http%3A%2F%2Flocalhost%3A3000%2F%3FdebugKalturaPlayer');
  });
});
