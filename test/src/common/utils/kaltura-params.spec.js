import {
  addClientTag,
  addKalturaParams,
  addReferrer,
  getReferrer,
  addUIConfId,
  handleSessionId,
  updateSessionIdInUrl
} from '../../../../src/common/utils/kaltura-params';

class Player {
  set sessionId(s) {
    this.config.session.id = s;
  }
}

let player = new Player();

describe('addKalturaParams', function () {
  it('should add session id, referrer and client tag for playManifest source', function () {
    let source1 = {url: 'a/b/c/playmanifest/source'};
    let source2 = {url: 'd/e/f/playmanifest/source?a'};
    player.config = {session: {}, sources: {progressive: [source1, source2]}};
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

  it('should add session id, referrer and client tag for PLAYMANIFEST source', function () {
    let source1 = {url: 'a/b/c/PLAYMANIFEST/source'};
    let source2 = {url: 'd/e/f/PLAYMANIFEST/source?a'};
    player.config = {session: {}, sources: {progressive: [source1, source2]}};
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

  it('should add nothing for no playManifest source', function () {
    let source1 = {url: 'a/b/c'};
    addKalturaParams(player, {sources: {progressive: [source1]}});
    player.config.session.id.should.be.exist;
    source1.url.should.be.equal('a/b/c');
  });

  it('should add nothing for no playManifest source', function () {
    let source1 = {url: 'a/b/c/PLAYMANIFEST/source'};
    source1.localSource = true;
    addKalturaParams(player, {sources: {dash: [source1]}});
    player.config.session.id.should.be.exist;
    source1.url.should.be.equal('a/b/c/PLAYMANIFEST/source');
  });

  it('should add session id, referrer and client tag for PLAYMANIFEST source and session id, referrer, client tag and uiconfid to udrm license', function () {
    let source1 = {
      url: 'a/b/c/PLAYMANIFEST/source',
      drmData: [{licenseUrl: 'udrm.kaltura.com?custom_data=someData&signature=Sig'}]
    };
    player.config = {provider: {uiConfId: 123}, sources: {progressive: [source1]}};
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

  it('should not add session id, referrer, client tag and uiconfid to  other drm system', function () {
    let source1 = {
      url: 'a/b/c/PLAYMANIFEST/source',
      drmData: [{licenseUrl: 'udrm.other.com?custom_data=someData&signature=Sig'}]
    };
    player.config = {provider: {uiConfId: 123}, sources: {progressive: [source1]}};
    addKalturaParams(player, player.config);

    source1.drmData[0].licenseUrl.should.be.equal('udrm.other.com?custom_data=someData&signature=Sig');
  });

  it('should not add session id, referrer, client tag and uiconfid to  other drm system', function () {
    let source1 = {
      url: 'a/b/c/PLAYMANIFEST/source',
      drmData: [{licenseUrl: 'udrm.kaltura.com?custommm_data=someData&signature=Sig'}]
    };
    player.config = {provider: {uiConfId: 123}, sources: {progressive: [source1]}};
    addKalturaParams(player, player.config);

    source1.drmData[0].licenseUrl.should.be.equal('udrm.kaltura.com?custommm_data=someData&signature=Sig');
  });
});

describe('handleSessionId', function () {
  let sessionIdRegex = /(?:[a-z0-9]|-)*:(?:[a-z0-9]|-)*/i;
  it('should add the player session id', function () {
    player.config = {session: {}};
    handleSessionId(player, player.config);
    sessionIdRegex.test(player.config.session.id).should.be.true;
  });

  it('should update the player session id', function () {
    player.config = {session: {id: '5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b'}};
    handleSessionId(player, player.config);
    sessionIdRegex.test(player.config.session.id).should.be.true;
    (player.config.session.id.indexOf('5cc03aa6-c58f-3220-b548-2a698aa54830:') > -1).should.be.true;
    (player.config.session.id.indexOf('33e6d80e-63b3-108a-091d-ccc15998f85b') > -1).should.be.false;
  });
});

describe('updateSessionIdInUrl', function () {
  it('should add session id to URL as first param', function () {
    let source = {url: 'a/b/c/playmanifest/source'};
    player.config = {session: {id: '5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b'}};
    source.url = updateSessionIdInUrl(source.url, player.config.session.id);
    source.url.should.be.equal('a/b/c/playmanifest/source?playSessionId=' + player.config.session.id);
  });

  it('should add session id to URL as second param', function () {
    let source = {url: 'a/b/c/playmanifest/source?a'};
    player.config = {session: {id: '5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b'}};
    source.url = updateSessionIdInUrl(source.url, player.config.session.id);
    source.url.should.be.equal('a/b/c/playmanifest/source?a&playSessionId=' + player.config.session.id);
  });

  it('should update session id in URL as first param', function () {
    let source = {url: 'a/b/c/playmanifest/source?playSessionId=5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b'};
    player.config = {session: {id: '5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b'}};
    source.url = updateSessionIdInUrl(source.url, player.config.session.id);
    source.url.should.be.equal('a/b/c/playmanifest/source?playSessionId=' + player.config.session.id);
  });

  it('should update session id in URL as second param', function () {
    let source = {url: 'a/b/c/playmanifest/source?a&playSessionId=5cc03aa6-c58f-3220-b548-2a698aa54830:b5391ed8-be5d-3a71-e157-f23a1b434121'};
    player.config = {session: {id: '5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b'}};
    source.url = updateSessionIdInUrl(source.url, player.config.session.id);
    source.url.should.be.equal('a/b/c/playmanifest/source?a&playSessionId=' + player.config.session.id);
  });

  it('should update session id in URL with param different than playSessionId', function () {
    let source = {url: 'a/b/c/playmanifest/source?testId=5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b'};
    player.config = {session: {id: '5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b'}};
    source.url = updateSessionIdInUrl(source.url, player.config.session.id, 'testId=');
    source.url.should.be.equal('a/b/c/playmanifest/source?testId=' + player.config.session.id);
  });
});

describe('addReferrer', function () {
  it('should add referrer as first param', function () {
    let source = {url: 'a/b/c/playmanifest/source'};
    player.config = {session: {}};
    source.url = addReferrer(source.url);
    source.url.should.be.equal('a/b/c/playmanifest/source?referrer=' + btoa(getReferrer().substr(0, 1000)));
  });

  it('should add referrer as second param', function () {
    let source = {url: 'a/b/c/playmanifest/source?a'};
    player.config = {session: {}};
    source.url = addReferrer(source.url);
    source.url.should.be.equal('a/b/c/playmanifest/source?a&referrer=' + btoa(getReferrer().substr(0, 1000)));
  });
});

describe('addUIConfId', function () {
  it('should add uiConfId as first param', function () {
    let source = {url: 'a/b/c/playmanifest/source'};
    player.config = {provider: {uiConfId: 123}};
    source.url = addUIConfId(source.url, player.config);
    source.url.should.be.equal('a/b/c/playmanifest/source?uiConfId=123');
  });

  it('should add uiConfId as second param', function () {
    let source = {url: 'a/b/c/playmanifest/source?a'};
    player.config = {provider: {uiConfId: 123}};
    source.url = addUIConfId(source.url, player.config);
    source.url.should.be.equal('a/b/c/playmanifest/source?a&uiConfId=123');
  });
});

describe('addClientTag', function () {
  it('should add client tag as first param', function () {
    let source = {url: 'a/b/c/playmanifest/source'};
    let productVersion = '7.37';
    player.config = {session: {}, productVersion};
    source.url = addClientTag(source.url, player.config.productVersion);
    source.url.should.be.equal('a/b/c/playmanifest/source?clientTag=html5:v' + productVersion);
  });

  it('should add client tag as second param', function () {
    let source = {url: 'a/b/c/playmanifest/source?a'};
    player.config = {session: {}};
    source.url = addClientTag(source.url);
    source.url.should.be.equal('a/b/c/playmanifest/source?a&clientTag=html5:v' + __VERSION__);
  });
});
