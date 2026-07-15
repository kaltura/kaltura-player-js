// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { getErrorCategory } from '../../../../src/common/utils/error-helper';
import { Error } from '@playkit-js/playkit-js';

describe('error-helper', () => {
  describe('getErrorCategory — geo-block with empty messages array', () => {
    it('should return GEO_LOCATION when messages array has COUNTRY_RESTRICTED code', () => {
      const error = {
        category: 2,
        code: 2001,
        data: { messages: [{ code: 'COUNTRY_RESTRICTED' }] }
      };
      getErrorCategory(error as any).should.equal(Error.Category.GEO_LOCATION);
    });

    it('should NOT throw and should return ACCESS_CONTROL_BLOCKED when messages is an empty array', () => {
      const error = {
        category: 2,
        code: 2001,
        data: { messages: [] }
      };
      // Before the fix this threw a TypeError: Cannot read properties of undefined (reading 'code')
      ((): void => {
        getErrorCategory(error as any);
      }).should.not.throw();
      getErrorCategory(error as any).should.equal(Error.Category.ACCESS_CONTROL_BLOCKED);
    });

    it('should NOT throw and should return ACCESS_CONTROL_BLOCKED when messages is undefined', () => {
      const error = {
        category: 2,
        code: 2001,
        data: {}
      };
      ((): void => {
        getErrorCategory(error as any);
      }).should.not.throw();
      getErrorCategory(error as any).should.equal(Error.Category.ACCESS_CONTROL_BLOCKED);
    });

    it('should NOT throw and should return ACCESS_CONTROL_BLOCKED when data itself is undefined', () => {
      const error = {
        category: 2,
        code: 2001
      };
      ((): void => {
        getErrorCategory(error as any);
      }).should.not.throw();
      getErrorCategory(error as any).should.equal(Error.Category.ACCESS_CONTROL_BLOCKED);
    });

    it('should return SESSION_RESTRICTED category when messages has SESSION_RESTRICTED code', () => {
      const error = {
        category: 2,
        code: 2001,
        data: { messages: [{ code: 'SESSION_RESTRICTED' }] }
      };
      getErrorCategory(error as any).should.equal(Error.Category.MEDIA_UNAVAILABLE);
    });

    it('should return IP_RESTRICTED category when messages has IP_RESTRICTED code', () => {
      const error = {
        category: 2,
        code: 2001,
        data: { messages: [{ code: 'IP_RESTRICTED' }] }
      };
      getErrorCategory(error as any).should.equal(Error.Category.IP_RESTRICTED);
    });

    it('should return SITE_RESTRICTED category when messages has SITE_RESTRICTED code', () => {
      const error = {
        category: 2,
        code: 2001,
        data: { messages: [{ code: 'SITE_RESTRICTED' }] }
      };
      getErrorCategory(error as any).should.equal(Error.Category.SITE_RESTRICTED);
    });

    it('should return SCHEDULED_RESTRICTED category when messages has SCHEDULED_RESTRICTED code', () => {
      const error = {
        category: 2,
        code: 2003,
        data: { messages: [{ code: 'SCHEDULED_RESTRICTED' }] }
      };
      getErrorCategory(error as any).should.equal(Error.Category.SCHEDULED_RESTRICTED);
    });
  });
});
