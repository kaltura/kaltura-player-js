import handleSessionId from '../../src/session-id'

describe('handleSessionId', function () {

  it('should add session id for playManifest source', function () {
    let selectedSource = {url: 'a/b/c/playmanifest/source'};
    let player = {};
    handleSessionId(selectedSource, player);
    selectedSource.url.should.be.equal('a/b/c/playmanifest/source?playSessionId=' + player.sessionId);
  });

  it('should add session id for playManifest source with query param', function () {
    let selectedSource = {url: 'a/b/c/playmanifest/source?a'};
    let player = {};
    handleSessionId(selectedSource, player);
    selectedSource.url.should.be.equal('a/b/c/playmanifest/source?a&playSessionId=' + player.sessionId);
  });

  it('should add session id for PLAYMANIFEST source', function () {
    let selectedSource = {url: 'a/b/c/PLAYMANIFEST/source'};
    let player = {};
    handleSessionId(selectedSource, player);
    selectedSource.url.should.be.equal('a/b/c/PLAYMANIFEST/source?playSessionId=' + player.sessionId);
  });

  it('should add session id for PLAYMANIFEST source with query param', function () {
    let selectedSource = {url: 'a/b/c/PLAYMANIFEST/source?a'};
    let player = {};
    handleSessionId(selectedSource, player);
    selectedSource.url.should.be.equal('a/b/c/PLAYMANIFEST/source?a&playSessionId=' + player.sessionId);
  });

  it('should not add session id for no playManifest source', function () {
    let selectedSource = {url: 'a/b/c'};
    let player = {};
    handleSessionId(selectedSource, player);
    selectedSource.url.should.be.equal('a/b/c');
  });

  it('should replace the second GUID for existing session id as first query param', function () {
    let selectedSource = {url: 'a/b/c/playmanifest/source?playSessionId=8a18888e-4110-d61b-5285-c601c51b70e3:b892a45b-23dc-7f3b-0ca1-5381a88e0c81&a'};
    let player = {};
    handleSessionId(selectedSource, player);
    selectedSource.url.should.be.equal('a/b/c/playmanifest/source?playSessionId=8a18888e-4110-d61b-5285-c601c51b70e3' + player.sessionId.substr(player.sessionId.indexOf(':')) + '&a');
  });

  it('should replace the second GUID for existing session id as second query param', function () {
    let selectedSource = {url: 'a/b/c/playmanifest/source?a&playSessionId=8a18888e-4110-d61b-5285-c601c51b70e3:b892a45b-23dc-7f3b-0ca1-5381a88e0c81'};
    let player = {};
    handleSessionId(selectedSource, player);
    selectedSource.url.should.be.equal('a/b/c/playmanifest/source?a&playSessionId=8a18888e-4110-d61b-5285-c601c51b70e3' + player.sessionId.substr(player.sessionId.indexOf(':')));
  });
});
