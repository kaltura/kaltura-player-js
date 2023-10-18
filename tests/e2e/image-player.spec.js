import { expect } from 'chai';
import '../../src/index';
import { setup } from '../../src/index';
import { config, targetId } from '../mock/config';
import { mediaData } from '../mock/media-sourc';

describe('Image player', () => {
  let player;

  before(() => {
    const element = document.createElement('DIV');
    element.id = targetId;
    document.body.appendChild(element);
  });

  after(() => {
    document.getElementById(targetId).remove();
  });

  afterEach(() => {
    player.destroy();
    for (const element of document.getElementsByTagName('video')) {
      element.remove();
    }
  });

  it('image player', async () => {
    // Given
    player = setup(config);

    // Do
    player.setMedia({ sources: { ...mediaData } });
    await player.ready();

    // Expect
    expect(true).equal(true);
  });
});
