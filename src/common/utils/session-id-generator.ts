import { Utils } from '@playkit-js/playkit-js';

class SessionIdGenerator {
  private static next: string = '';

  private static init() {
    SessionIdGenerator.next = `${Utils.Generator.guid()}:${Utils.Generator.guid()}`;
  }

  public static get() {
    if (!SessionIdGenerator.next) {
      this.init();
      return SessionIdGenerator.next;
    }

    const next = SessionIdGenerator.next;

    const secondGuidInSessionIdRegex = /:((?:[a-z0-9]|-)*)/i;
    const secondGuidInSessionId = secondGuidInSessionIdRegex.exec(next);
    if (secondGuidInSessionId && secondGuidInSessionId[1]) {
      SessionIdGenerator.next = next.replace(secondGuidInSessionId[1], Utils.Generator.guid());
    }

    return next;
  }
}

export { SessionIdGenerator };
