import { Utils } from '@playkit-js/playkit-js';

class SessionIdGenerator {
  private static _value: string = '';

  private static init(): void {
    SessionIdGenerator._value = `${Utils.Generator.guid()}:${Utils.Generator.guid()}`;
  }

  public static next(): string {
    if (!SessionIdGenerator.next) {
      this.init();
      return SessionIdGenerator._value;
    }

    const next = SessionIdGenerator._value;

    const secondGuidInSessionIdRegex = /:((?:[a-z0-9]|-)*)/i;
    const secondGuidInSessionId = secondGuidInSessionIdRegex.exec(next);
    if (secondGuidInSessionId && secondGuidInSessionId[1]) {
      SessionIdGenerator._value = next.replace(secondGuidInSessionId[1], Utils.Generator.guid());
    }

    return next;
  }
}

export { SessionIdGenerator };
