import {addKalturaParams, handleSessionId, addReferrer, addClientTag, copyParamsToProgressiveSources} from '../../src/kaltura-params'
import {VERSION} from 'playkit-js'

class Player {
  set sessionId(s){
    this.config.session.id = s;
  }
}

let player = new Player();

describe('addKalturaParams', function () {

  it('should add session id, referrer and client tag for playManifest source', function () {
    let selectedSource = {url: 'a/b/c/playmanifest/source', mimetype: 'video/mp4'};
    let otherSource = {url: 'd/e/f/playmanifest/source?a'};
    player.config = {session: {}, sources: {progressive: [selectedSource, otherSource]}};
    addKalturaParams(selectedSource, player);
    selectedSource.url.should.be.equal('a/b/c/playmanifest/source?playSessionId=' + player.config.session.id + '&referrer=' + btoa(document.referrer) + '&clientTag=html5:v' + VERSION);
    otherSource.url.should.be.equal('d/e/f/playmanifest/source?a&playSessionId=' + player.config.session.id + '&referrer=' + btoa(document.referrer) + '&clientTag=html5:v' + VERSION);
  });

  it('should add session id, referrer and client tag for PLAYMANIFEST source', function () {
    let selectedSource = {url: 'a/b/c/PLAYMANIFEST/source', mimetype: 'video/mp4'};
    let otherSource = {url: 'd/e/f/PLAYMANIFEST/source?a'};
    player.config =  {session: {}, sources: {progressive: [selectedSource, otherSource]}};
    addKalturaParams(selectedSource, player);
    selectedSource.url.should.be.equal('a/b/c/PLAYMANIFEST/source?playSessionId=' + player.config.session.id + '&referrer=' + btoa(document.referrer) + '&clientTag=html5:v' + VERSION);
    otherSource.url.should.be.equal('d/e/f/PLAYMANIFEST/source?a&playSessionId=' + player.config.session.id + '&referrer=' + btoa(document.referrer) + '&clientTag=html5:v' + VERSION);
  });

  it('should add nothing for no playManifest source', function () {
    let selectedSource = {url: 'a/b/c'};
    addKalturaParams(selectedSource, player);
    selectedSource.url.should.be.equal('a/b/c');
  });
});

describe('handleSessionId', function () {

  it('should add session id as first param', function () {
    let selectedSource = {url: 'a/b/c/playmanifest/source'};
    player.config = {session: {}};
    handleSessionId(selectedSource, player);
    selectedSource.url.should.be.equal('a/b/c/playmanifest/source?playSessionId=' + player.config.session.id);
  });

  it('should add session id as second param', function () {
    let selectedSource = {url: 'a/b/c/playmanifest/source?a'};
    player.config = {session: {}};
    handleSessionId(selectedSource, player);
    selectedSource.url.should.be.equal('a/b/c/playmanifest/source?a&playSessionId=' + player.config.session.id);
  });

  it('should update session id as first param', function () {
    let selectedSource = {url: 'a/b/c/playmanifest/source'};
    player.config = {session: {id: "5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b"}};
    handleSessionId(selectedSource, player);
    (player.config.session.id.indexOf("5cc03aa6-c58f-3220-b548-2a698aa54830:") > -1).should.be.true;
    (player.config.session.id.indexOf("33e6d80e-63b3-108a-091d-ccc15998f85b") === -1).should.be.true;
    selectedSource.url.should.be.equal('a/b/c/playmanifest/source?playSessionId=' + player.config.session.id);
  });

  it('should update session id as second param', function () {
    let selectedSource = {url: 'a/b/c/playmanifest/source?a'};
    player.config = {session: {id: "5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b"}};
    handleSessionId(selectedSource, player);
    (player.config.session.id.indexOf("5cc03aa6-c58f-3220-b548-2a698aa54830:") > -1).should.be.true;
    (player.config.session.id.indexOf("33e6d80e-63b3-108a-091d-ccc15998f85b") === -1).should.be.true;
    selectedSource.url.should.be.equal('a/b/c/playmanifest/source?a&playSessionId=' + player.config.session.id);
  });

  it('should update session id in url as first param', function () {
    let selectedSource = {url: 'a/b/c/playmanifest/source?playSessionId=5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b'};
    player.config = {session: {id: "5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b"}};
    handleSessionId(selectedSource, player);
    (player.config.session.id.indexOf("5cc03aa6-c58f-3220-b548-2a698aa54830:") > -1).should.be.true;
    (player.config.session.id.indexOf("33e6d80e-63b3-108a-091d-ccc15998f85b") === -1).should.be.true;
    selectedSource.url.should.be.equal('a/b/c/playmanifest/source?playSessionId=' + player.config.session.id);
  });

  it('should update session id in url as second param', function () {
    let selectedSource = {url: 'a/b/c/playmanifest/source?a&playSessionId=5cc03aa6-c58f-3220-b548-2a698aa54830:b5391ed8-be5d-3a71-e157-f23a1b434121'};
    player.config = {session: {id: "5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b"}};
    handleSessionId(selectedSource, player);
    (player.config.session.id.indexOf("5cc03aa6-c58f-3220-b548-2a698aa54830:") > -1).should.be.true;
    (player.config.session.id.indexOf("33e6d80e-63b3-108a-091d-ccc15998f85b") === -1).should.be.true;
    selectedSource.url.should.be.equal('a/b/c/playmanifest/source?a&playSessionId=' + player.config.session.id);
  });
});

describe('addReferrer', function () {

  it('should add referrer as first param', function () {
    let selectedSource = {url: 'a/b/c/playmanifest/source'};
    player.config = {session: {}};
    addReferrer(selectedSource, player);
    selectedSource.url.should.be.equal('a/b/c/playmanifest/source?referrer=' + btoa(document.referrer));
  });

  it('should add referrer as second param', function () {
    let selectedSource = {url: 'a/b/c/playmanifest/source?a'};
    player.config = {session: {}};
    addReferrer(selectedSource, player);
    selectedSource.url.should.be.equal('a/b/c/playmanifest/source?a&referrer=' + btoa(document.referrer));
  });
});

describe('addClientTag', function () {

  it('should add client tag as first param', function () {
    let selectedSource = {url: 'a/b/c/playmanifest/source'};
    player.config = {session: {}};
    addClientTag(selectedSource, player);
    selectedSource.url.should.be.equal('a/b/c/playmanifest/source?clientTag=html5:v' + VERSION);
  });

  it('should add client tag as second param', function () {
    let selectedSource = {url: 'a/b/c/playmanifest/source?a'};
    player.config = {session: {}};
    addClientTag(selectedSource, player);
    selectedSource.url.should.be.equal('a/b/c/playmanifest/source?a&clientTag=html5:v' + VERSION);
  });
});

describe('copyParamsToProgressiveSources', function () {

  it('should copy params as first param', function () {
    let selectedSource = {url: 'a/b/c/playmanifest/source'};
    player.config = {session: {id: "5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b"}, sources: {progressive: [selectedSource]}};
    copyParamsToProgressiveSources(player);
    selectedSource.url.should.be.equal('a/b/c/playmanifest/source?playSessionId=5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b&referrer=' + btoa(document.referrer) + '&clientTag=html5:v' + VERSION);
  });

  it('should copy params as second param', function () {
    let selectedSource = {url: 'a/b/c/playmanifest/source?a'};
    player.config = {session: {id: "5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b"}, sources: {progressive: [selectedSource]}};
    copyParamsToProgressiveSources(player);
    selectedSource.url.should.be.equal('a/b/c/playmanifest/source?a&playSessionId=5cc03aa6-c58f-3220-b548-2a698aa54830:33e6d80e-63b3-108a-091d-ccc15998f85b&referrer=' + btoa(document.referrer) + '&clientTag=html5:v' + VERSION);
  });
});
