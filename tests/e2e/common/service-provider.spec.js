import {ServiceProvider} from '../../../src/common/service-provider';

describe('ServiceProvider', () => {
  const fakePlayer = {
    addEventListener: () => {},
    removeEventListener: () => {},
    Event: {
      Core: {
        PLAYER_RESET: 'playerreset'
      }
    }
  };
  let serviceProvider;
  beforeEach(() => {
    serviceProvider = new ServiceProvider(fakePlayer);
  });
  afterEach(() => {
    serviceProvider.destroy();
  });

  it('should register custom service', function () {
    serviceProvider.has('custom').should.be.false;
    serviceProvider.register('custom', {key: 1});
    serviceProvider.has('custom').should.be.true;
    serviceProvider.get('custom').key.should.equals(1);
  });

  it('should not register custom service if already registered', function () {
    serviceProvider.register('custom', {key: 1});
    serviceProvider.register('custom', {key: 2});
    serviceProvider.get('custom').key.should.equals(1);
  });

  it('should call to service destroy on player destroy', function (done) {
    serviceProvider.register('custom', {destroy: () => done()});
    serviceProvider.destroy();
  });
});
