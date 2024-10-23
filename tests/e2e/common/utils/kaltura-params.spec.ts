// eslint-disable-next-line  @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  addClientTag,
  addKalturaParams,
  addReferrer,
  getReferrer,
  addUIConfId,
  handleSessionId,
  updateSessionIdInUrl
} from '../../../../src/common/utils/kaltura-params';
import { SessionIdGenerator } from '../../../../src/common/utils/session-id-generator';
const sandbox = sinon.createSandbox();

class Player {
  public set sessionId(s) {
    this.config.session.id = s;
  }
}

const player = new Player();

describe('addKalturaParams', () => {
  it('should add session id, referrer and client tag for playManifest source', () => {
    const source1 = { url: 'a/b/c/playmanifest/source' };
    const source2 = { url: 'd/e/f/playmanifest/source?a' };
    player.config = {
      session: {},
      sources: { progressive: [source1, source2] }
    };
    addKalturaParams(player, player.config);
    source1.url.should.be.equal(
      'a/b/c/playmanifest/source?playSessionId=' +
        player.config.session.id +
        '&referrer=' +
        btoa(getReferrer().substr(0, 1000)) +
        '&clientTag=html5:v' +
        __VERSION__
    );
    source2.url.should.be.equal(
      'd/e/f/playmanifest/source?a&playSessionId=' +
        player.config.session.id +
        '&referrer=' +
        btoa(getReferrer().substr(0, 1000)) +
        '&clientTag=html5:v' +
        __VERSION__
    );
  });

  it('should add session id, referrer and client tag for PLAYMANIFEST source', () => {
    const source1 = { url: 'a/b/c/PLAYMANIFEST/source' };
    const source2 = { url: 'd/e/f/PLAYMANIFEST/source?a' };
    player.config = {
      session: {},
      sources: { progressive: [source1, source2] }
    };
    addKalturaParams(player, player.config);
    source1.url.should.be.equal(
      'a/b/c/PLAYMANIFEST/source?playSessionId=' +
        player.config.session.id +
        '&referrer=' +
        btoa(getReferrer().substr(0, 1000)) +
        '&clientTag=html5:v' +
        __VERSION__
    );
    source2.url.should.be.equal(
      'd/e/f/PLAYMANIFEST/source?a&playSessionId=' +
        player.config.session.id +
        '&referrer=' +
        btoa(getReferrer().substr(0, 1000)) +
        '&clientTag=html5:v' +
        __VERSION__
    );
  });

  it('should add nothing for no playManifest source', () => {
    const source1 = { url: 'a/b/c' };
    addKalturaParams(player, { sources: { progressive: [source1] } });
    player.config.session.id.should.be.exist;
    source1.url.should.be.equal('a/b/c');
  });

  it('should add nothing for no playManifest source - 2', () => {
    const source1 = { url: 'a/b/c/PLAYMANIFEST/source' };
    source1.localSource = true;
    addKalturaParams(player, { sources: { dash: [source1] } });
    player.config.session.id.should.be.exist;
    source1.url.should.be.equal('a/b/c/PLAYMANIFEST/source');
  });

  it('should add session id, referrer and client tag for PLAYMANIFEST source and session id, referrer, client tag and uiconfid to udrm license', () => {
    const source1 = {
      url: 'a/b/c/PLAYMANIFEST/source',
      drmData: [{ licenseUrl: 'udrm.kaltura.com?custom_data=someData&signature=Sig' }]
    };
    player.config = {
      provider: { uiConfId: 123 },
      sources: { progressive: [source1] }
    };
    addKalturaParams(player, player.config);
    source1.url.should.be.equal(
      'a/b/c/PLAYMANIFEST/source?playSessionId=' +
        player.config.session.id +
        '&referrer=' +
        btoa(getReferrer().substr(0, 1000)) +
        '&clientTag=html5:v' +
        __VERSION__
    );

    source1.drmData[0].licenseUrl.should.be.equal(
      'udrm.kaltura.com?custom_data=someData&signature=Sig&sessionId=' +
        player.config.session.id +
        '&clientTag=html5:v' +
        __VERSION__ +
        '&referrer=' +
        btoa(getReferrer().substr(0, 1000)) +
        '&uiConfId=123'
    );
  });

  it('should not add session id, referrer, client tag and uiconfid to  other drm system - 1', () => {
    const source1 = {
      url: 'a/b/c/PLAYMANIFEST/source',
      drmData: [{ licenseUrl: 'udrm.other.com?custom_data=someData&signature=Sig' }]
    };
    player.config = {
      provider: { uiConfId: 123 },
      sources: { progressive: [source1] }
    };
    addKalturaParams(player, player.config);

    source1.drmData[0].licenseUrl.should.be.equal('udrm.other.com?custom_data=someData&signature=Sig');
  });

  it('should not add session id, referrer, client tag and uiconfid to  other drm system - 2', () => {
    const source1 = {
      url: 'a/b/c/PLAYMANIFEST/source',
      drmData: [{ licenseUrl: 'udrm.kaltura.com?custommm_data=someData&signature=Sig' }]
    };
    player.config = {
      provider: { uiConfId: 123 },
      sources: { progressive: [source1] }
    };
    addKalturaParams(player, player.config);

    source1.drmData[0].licenseUrl.should.be.equal('udrm.kaltura.com?custommm_data=someData&signature=Sig');
  });
});

describe('handleSessionId', () => {
  const sessionIdRegex = /(?:[a-z0-9]|-)*:(?:[a-z0-9]|-)*/i;

  it('should generate add a new session id', () => {
    const nextSessionId = '5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b';
    SessionIdGenerator._value = nextSessionId;
    player.config = {
      session: {
        id: ''
      }
    };
    player.playlist = {
      items: []
    };
    sessionIdRegex.test(player.config.session.id).should.be.false;
    handleSessionId(player, player.config);
    sessionIdRegex.test(player.config.session.id).should.be.true;
    expect(player.config.session.id).to.equal(nextSessionId);
  });

  it('should update existing session id if not in playlist mode and there is no active source', () => {
    const nextSessionId = '5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b';
    SessionIdGenerator._value = nextSessionId;
    player.config = {
      session: {
        id: 'abc'
      }
    };
    player.playlist = {
      items: []
    };
    sessionIdRegex.test(player.config.session.id).should.be.false;
    handleSessionId(player, player.config);
    sessionIdRegex.test(player.config.session.id).should.be.true;
    expect(player.config.session.id).to.equal(nextSessionId);
  });

  it('should not update session id if in playlist mode and there is no active entry', () => {
    SessionIdGenerator._value = '5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b';
    player.config = {
      session: {
        id: 'abc'
      }
    };
    player.playlist = {
      items: [1]
    };
    sessionIdRegex.test(player.config.session.id).should.be.false;
    handleSessionId(player, player.config);
    sessionIdRegex.test(player.config.session.id).should.be.false;
  });
  it('should cache session id when generating a new id in playlist mode', () => {
    const nextSessionId = '5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b';
    SessionIdGenerator._value = nextSessionId;
    player.config = {
      session: {
        id: ''
      },
      sources: {
        id: '123'
      }
    };
    player.playlist = {
      items: [1]
    };
    player.sessionIdCache = new Map();

    sessionIdRegex.test(player.config.session.id).should.be.false;
    handleSessionId(player, player.config);
    sessionIdRegex.test(player.config.session.id).should.be.true;
    player.config.session.id = 'abc';
    sessionIdRegex.test(player.config.session.id).should.be.false;
    handleSessionId(player, player.config);
    sessionIdRegex.test(player.config.session.id).should.be.true;
    expect(player.config.session.id).to.equal(nextSessionId);
  });
  it('should cache session id if in playlist mode and there is an active entry', () => {
    const nextSessionId = '5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b';
    SessionIdGenerator._value = nextSessionId;
    player.config = {
      session: {
        id: 'abc'
      },
      sources: {
        id: '123'
      }
    };
    player.playlist = {
      items: [1]
    };
    player.sessionIdCache = new Map();

    sessionIdRegex.test(player.config.session.id).should.be.false;
    handleSessionId(player, player.config);
    sessionIdRegex.test(player.config.session.id).should.be.true;
    player.config.session.id = 'def';
    sessionIdRegex.test(player.config.session.id).should.be.false;
    handleSessionId(player, player.config);
    sessionIdRegex.test(player.config.session.id).should.be.true;
    expect(player.config.session.id).to.equal(nextSessionId);
  });
});

describe('updateSessionIdInUrl', () => {
  it('should add session id to URL as first param', () => {
    const source = { url: 'a/b/c/playmanifest/source' };
    player.config = {
      session: {
        id: '5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b'
      }
    };
    source.url = updateSessionIdInUrl(null, source.url, player.config.session.id);
    source.url.should.be.equal('a/b/c/playmanifest/source?playSessionId=' + player.config.session.id);
  });

  it('should add session id to URL as second param', () => {
    const source = { url: 'a/b/c/playmanifest/source?a' };
    player.config = {
      session: {
        id: '5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b'
      }
    };
    source.url = updateSessionIdInUrl(null, source.url, player.config.session.id);
    source.url.should.be.equal('a/b/c/playmanifest/source?a&playSessionId=' + player.config.session.id);
  });

  it('should update session id in URL as first param', () => {
    const source = {
      url: 'a/b/c/playmanifest/source?playSessionId=5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b'
    };
    player.config = {
      session: {
        id: '5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b'
      }
    };
    source.url = updateSessionIdInUrl(null, source.url, player.config.session.id);
    source.url.should.be.equal('a/b/c/playmanifest/source?playSessionId=' + player.config.session.id);
  });

  it('should update session id in URL as second param', () => {
    const source = {
      url: 'a/b/c/playmanifest/source?a&playSessionId=5cc03aa6-c58f-3220-b548-2a698aa54830:b5391ed8-be5d-3a71-e157-f23a1b434121'
    };
    player.config = {
      session: {
        id: '5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b'
      }
    };
    source.url = updateSessionIdInUrl(null, source.url, player.config.session.id);
    source.url.should.be.equal('a/b/c/playmanifest/source?a&playSessionId=' + player.config.session.id);
  });

  it('should update session id in URL with param different than playSessionId', () => {
    const source = {
      url: 'a/b/c/playmanifest/source?testId=5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b'
    };
    player.config = {
      session: {
        id: '5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b'
      }
    };
    source.url = updateSessionIdInUrl(null, source.url, player.config.session.id, 'testId=');
    source.url.should.be.equal('a/b/c/playmanifest/source?testId=' + player.config.session.id);
  });
  it('should not update session id in url if we are in playlist mode', () => {
    const source = {
      url: 'a/b/c/playmanifest/source?a&playSessionId=5cc03aa6-c58f-3220-b548-2a698aa54830:b5391ed8-be5d-3a71-e157-f23a1b434121'
    };
    player.config = {
      session: {
        id: '5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b'
      }
    };
    const playerMock = {
      playlist: {
        items: [1]
      }
    };
    source.url = updateSessionIdInUrl(playerMock, source.url, player.config.session.id, 'testId=');
    source.url.should.not.be.equal('a/b/c/playmanifest/source?testId=' + player.config.session.id);
  });
});

describe('addReferrer', () => {
  it('should add referrer as first param', () => {
    const source = { url: 'a/b/c/playmanifest/source' };
    player.config = { session: {} };
    source.url = addReferrer(source.url);
    source.url.should.be.equal('a/b/c/playmanifest/source?referrer=' + btoa(getReferrer().substr(0, 1000)));
  });

  it('should add referrer as second param', () => {
    const source = { url: 'a/b/c/playmanifest/source?a' };
    player.config = { session: {} };
    source.url = addReferrer(source.url);
    source.url.should.be.equal('a/b/c/playmanifest/source?a&referrer=' + btoa(getReferrer().substr(0, 1000)));
  });
});

describe('addUIConfId', () => {
  it('should add uiConfId as first param', () => {
    const source = { url: 'a/b/c/playmanifest/source' };
    player.config = { provider: { uiConfId: 123 } };
    source.url = addUIConfId(source.url, player.config);
    source.url.should.be.equal('a/b/c/playmanifest/source?uiConfId=123');
  });

  it('should add uiConfId as second param', () => {
    const source = { url: 'a/b/c/playmanifest/source?a' };
    player.config = { provider: { uiConfId: 123 } };
    source.url = addUIConfId(source.url, player.config);
    source.url.should.be.equal('a/b/c/playmanifest/source?a&uiConfId=123');
  });
});

describe('addClientTag', () => {
  it('should add client tag as first param', () => {
    const source = { url: 'a/b/c/playmanifest/source' };
    const productVersion = '7.37';
    player.config = { session: {} };
    source.url = addClientTag(source.url, productVersion);
    source.url.should.be.equal('a/b/c/playmanifest/source?clientTag=html5:v' + productVersion);
  });

  it('should add client tag as second param', () => {
    const source = { url: 'a/b/c/playmanifest/source?a' };
    player.config = { session: {} };
    source.url = addClientTag(source.url);
    source.url.should.be.equal('a/b/c/playmanifest/source?a&clientTag=html5:v' + __VERSION__);
  });
});

describe('testReferrerLogic', () => {
  before(() => {
    window.originalRequestReferrer = undefined;
  });

  it('no referrer on parent', () => {
    sandbox.stub(window, 'parent').get(() => undefined);
    sandbox.stub(document, 'referrer').get(() => 'localRef');
    getReferrer().should.equal('localRef');
  });

  it('referrer on parent', () => {
    sandbox.stub(window, 'parent').get(() => {return { document : {URL : 'parentRef'}}});
    getReferrer().should.equal('parentRef');
  });

  it('no referrer on parent and backend supplied referrer', () => {
    sandbox.stub(window, 'parent').get(() => {return { document : {URL : undefined}}});
    sandbox.stub(window, 'originalRequestReferrer').get(() => "backendRef");
    getReferrer().should.equal('backendRef');
  });

  it('if parent referrer contains kaltura.com and backend supplied referrer', () => {
    sandbox.stub(window, 'parent').get(() => {return { document : {URL : 'bla.kaltura.com'}}});
    sandbox.stub(window, 'originalRequestReferrer').get(() => "test-kaltura.com");
    getReferrer().should.equal('test-kaltura.com');
  });

  it('if parent referrer contains kaltura.com and backend does not supplied referrer', () => {
    sandbox.stub(window, 'parent').get(() => {return { document : {URL : 'bla.kaltura.com'}}});
    sandbox.stub(document, 'referrer').get(() => 'localRef');
    sandbox.stub(window, 'originalRequestReferrer').get(() => undefined);
    getReferrer().should.equal('localRef');
  });
});
