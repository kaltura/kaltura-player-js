import * as TestUtils from '../../../utils/test-utils';
import { ViewabilityManager, ViewabilityType } from '../../../../src/common/utils/viewability-manager';

describe('ViewabilityManager', () => {
  const targetId = 'ViewabilityManagerSpecDiv';
  let viewabilityManager;

  before(() => {
    TestUtils.createElement('DIV', targetId);
  });

  afterEach(() => {
    viewabilityManager.destroy();
  });

  after(() => {
    TestUtils.removeElement(targetId);
  });

  it('should create a viewability manager with an empty config and observe a div', (done) => {
    viewabilityManager = new ViewabilityManager();
    const handleVisibility = function (): any {
      done();
    };
    viewabilityManager.observe(document.getElementById(targetId), handleVisibility);
  });

  it('should create a viewability manager with a given config and observe a div', (done) => {
    const viewabilityConfig = {
      observedThresholds: [10, 30],
      playerThreshold: 20
    };
    viewabilityManager = new ViewabilityManager(viewabilityConfig);
    const handleVisibility = function (): any {
      done();
    };
    viewabilityManager.observe(document.getElementById(targetId), handleVisibility);
  });

  it('should observe twice the same div and check both listeners are invoked', (done) => {
    viewabilityManager = new ViewabilityManager();
    const handleVisibility1 = function (): any {
      viewabilityManager.observe(document.getElementById(targetId), handleVisibility2);
    };
    const handleVisibility2 = function (): any {
      done();
      viewabilityManager.unObserve(document.getElementById(targetId), handleVisibility2);
    };
    viewabilityManager.observe(document.getElementById(targetId), handleVisibility1);
  });

  it('should check types TAB and VIEWPORT were sent correct', (done) => {
    viewabilityManager = new ViewabilityManager();
    const handleVisibility = function (visible, viewabilityType): any {
      if (viewabilityType === ViewabilityType.VIEWPORT) {
        viewabilityManager._targetsObserved.getAll()[0].lastVisible = true;
        viewabilityManager._handleTabVisibilityChange();
      } else if (viewabilityType === ViewabilityType.TAB) {
        done();
      }
    };
    viewabilityManager.observe(document.getElementById(targetId), handleVisibility);
  });
});
