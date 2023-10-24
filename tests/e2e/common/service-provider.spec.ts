import {ServiceProvider} from '../../../src/common/service-provider';
import {KalturaPlayer} from '../../../src/kaltura-player';

describe('ServiceProvider', () => {
  const fakePlayer: KalturaPlayer = {
    addEventListener: (): void => {},
    removeEventListener: (): void => {},
    Event: {
      Core: {
        PLAYER_RESET: 'playerreset'
      }
    }
  } as KalturaPlayer;
  let serviceProvider;
  beforeEach(() => {
    serviceProvider = new ServiceProvider(fakePlayer);
  });
  afterEach(() => {
    serviceProvider.destroy();
  });

  it('should register custom service', () => {
    serviceProvider.has('custom').should.be.false;
    serviceProvider.register('custom', {key: 1});
    serviceProvider.has('custom').should.be.true;
    serviceProvider.get('custom').key.should.equals(1);
  });

  it('should not register custom service if already registered', () => {
    serviceProvider.register('custom', {key: 1});
    serviceProvider.register('custom', {key: 2});
    serviceProvider.get('custom').key.should.equals(1);
  });

  it('should call to service destroy on player destroy', (done) => {
    serviceProvider.register('custom', {destroy: () => done()});
    serviceProvider.destroy();
  });
});
