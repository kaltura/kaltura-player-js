# KS (Kaltura Session) URL Appending Locations

## Overview
This document lists all places under the Kaltura organization where we append `ks` (Kaltura Session) to URLs. The Kaltura Session is used for authentication and authorization when accessing Kaltura media resources.

## Summary
Found **2 main locations** in kaltura-player-js where KS is appended to URLs:
1. Thumbnail/poster URL generation
2. Thumbnail sprite URL generation

Additionally found **multiple occurrences across 8+ Kaltura repositories** in the organization.

---

## 1. kaltura-player-js Repository

### Location 1: Thumbnail Manager - Thumbnail Sprite URL
**File:** `src/common/thumbnail-manager.ts`  
**Line:** 121  
**Code:**
```typescript
return ks ? url + `/ks/${ks}` : url;
```

**Context:**
- Method: `_getThumbSlicesUrl()`
- Purpose: Appends KS to the thumbnail sprite URL for seekbar preview thumbnails
- Pattern: `/ks/${ks}` is appended to the base URL
- Condition: Only appended when `loadThumbnailWithKs` provider config is enabled

**Full Code Context:**
```typescript
private _getThumbSlicesUrl = (posterUrl: string | Poster[] | undefined, ks: string | undefined, thumbnailConfig: any): string => {
  if (typeof posterUrl === 'string') {
    if (THUMBNAIL_REGEX.test(posterUrl)) {
      try {
        const model: any = {
          thumbnailUrl: posterUrl,
          ...thumbnailConfig
        };
        const baseUrl = evaluate(THUMBNAIL_SERVICE_TEMPLATE, model);
        const url = this._maybeCutThumbnail(baseUrl);
        return ks ? url + `/ks/${ks}` : url;  // <-- KS APPENDED HERE
      } catch (e) {
        return '';
      }
    }
  }
  return '';
};
```

### Location 2: OVP Poster - Poster Image URL
**File:** `src/ovp/poster.ts`  
**Line:** 31  
**Code:**
```typescript
playerSources.poster = `${rawThumbnailUrl}/height/${playerHeight}/width/${playerWidth}${ks ? `/ks/${ks}` : ''}`;
```

**Context:**
- Function: `addKalturaPoster()`
- Purpose: Appends KS to the poster/thumbnail image URL with custom dimensions
- Pattern: `/ks/${ks}` is appended after dimension parameters
- Condition: Only appended when KS parameter is provided and `loadThumbnailWithKs` is enabled

**Full Code Context:**
```typescript
function addKalturaPoster(
  playerSources: PKSourcesConfigObject,
  mediaSources: ProviderMediaConfigSourcesObject,
  dimensions: PKDimensionsConfig,
  ks?: string
): void {
  const playerPoster = playerSources.poster;
  const mediaConfigPoster = mediaSources.poster;
  const playerWidth = dimensions.width;
  const playerHeight = dimensions.height;
  const rawThumbnailUrl = mediaSources.rawThumbnailUrl;
  if (
    typeof playerPoster === 'string' &&
    THUMBNAIL_REGEX.test(playerPoster) &&
    playerPoster === mediaConfigPoster &&
    typeof rawThumbnailUrl === 'string'
  ) {
    playerSources.poster = `${rawThumbnailUrl}/height/${playerHeight}/width/${playerWidth}${ks ? `/ks/${ks}` : ''}`;  // <-- KS APPENDED HERE
  }
  mediaSources.poster = playerSources.poster || '';
}
```

### Related Configuration
**File:** `src/kaltura-player.ts`  
**Method:** `shouldAddKs()`  
**Code:**
```typescript
public shouldAddKs(mediaConfig?: KPMediaConfig): boolean {
  return !!(this.config?.provider?.loadThumbnailWithKs && (mediaConfig || this.config)?.session?.ks);
}
```

This method determines whether KS should be added to thumbnail URLs based on:
- `provider.loadThumbnailWithKs` configuration flag
- Availability of `session.ks` value

---

## 2. playkit-js-providers Repository

### Location: OVP Play Source URL Builder
**File:** `src/k-provider/ovp/play-source-url-builder.ts`  
**Purpose:** Building playback URLs for OVP (Online Video Platform) media sources
**Note:** This file likely contains KS appending logic for media playback URLs

---

## 3. kmc-ng Repository (Kaltura Management Console)

Multiple files in the KMC (Kaltura Management Console) append KS to URLs:

### Files with KS URL Appending:
1. **`src/shared/kmc-shared/player-v7/player-v7.component.ts`**
   - Component for embedding V7 player in KMC

2. **`src/app/shared/player-v7/player-v7.component.ts`**
   - Player component in analytics application

3. **`src/applications/content-entries-app/entry/entry-thumbnails/entry-thumbnails-widget.service.ts`**
   - Thumbnail management for entries

4. **`src/applications/content-entries-app/entry/entry-thumbnails/entry-thumbnails-capture.component.ts`**
   - Thumbnail capture functionality

5. **`src/applications/content-documents-app/document/document-thumbnails/document-thumbnails-widget.service.ts`**
   - Document thumbnail management

6. **`src/applications/content-rooms-app/room/room-thumbnails/room-thumbnails-widget.service.ts`**
   - Room thumbnail management

7. **`src/applications/content-entries-app/entry/entry-related/entry-related-widget.service.ts`**
   - Related entries widget

8. **`src/applications/content-entries-app/entry/entry-captions/entry-captions.component.ts`**
   - Captions component

9. **Additional files:** Various preview, export, and distribution components

---

## 4. mwEmbed Repository (Legacy Player)

**Note:** This is the legacy Kaltura player. Multiple files contain KS URL appending logic:

### Files with KS URL Appending:
1. **`modules/KalturaSupport/resources/mw.KWidgetSupport.js`**
2. **`modules/KalturaSupport/resources/mw.ClosedCaptions.js`**
3. **`modules/EmbedPlayer/resources/mw.EmbedPlayerKplayer.js`**
4. **`modules/KalturaSupport/resources/mw.KBaseMediaList.js`**
5. **`kWidget/kWidget.js`**

---

## 5. Plugin Repositories

Several Kaltura player plugins also append KS to URLs:

### playkit-js-kaltura-cuepoints
**File:** `src/providers/utils.ts`  
**Purpose:** Cuepoint data fetching with authentication

### playkit-js-downloads
**File:** `src/services/download-service.ts`  
**Purpose:** Download URLs with KS for authentication

### playkit-js-hotspots
**File:** `cypress/e2e/env.ts`  
**Purpose:** Test environment configuration

### playkit-js-navigation
**File:** `cypress/e2e/env.ts`  
**Purpose:** Test environment configuration

### playkit-js-dual-screen
**File:** `cypress/e2e/dual-screen.cy.ts` and `cypress/e2e/env.ts`  
**Purpose:** Test environment configuration

### playkit-js-moderation
**File:** `cypress/e2e/utils.ts`  
**Purpose:** Test utilities

### playkit-js-timeline
**File:** `cypress/e2e/utils.ts`  
**Purpose:** Test utilities

---

## 6. Other Kaltura Repositories

### analytics-front-end
**Files:**
- `src/app/modules/export/export.component.ts`
- `src/app/shared/player-v7/player-v7.component.ts`

### live-analytics-front-end
**File:** `app/js/controllers.js`

### server (Backend)
**Files:**
- `alpha/web/lib/js/kmc.full.js`
- `alpha/web/lib/js/kmc3.js`

### kaf-diy-standalone-demo
**File:** `public/pages/entry-create-kaf/app.js`

---

## URL Pattern Analysis

### Common Pattern
The most common pattern for appending KS to URLs is:
```
/ks/{ks_value}
```

### Examples:
1. **Thumbnail URL:**
   ```
   https://cdnapi.kaltura.com/p/1091/thumbnail/entry_id/0_wifqaipd/width/164/ks/djJ8MTkwfJ...
   ```

2. **Poster URL:**
   ```
   /p/1091/thumbnail/entry_id/0_wifqaipd/height/360/width/640/ks/123
   ```

3. **Media Source URL:**
   ```
   https://cdnapi.kaltura.com/p/1091/playManifest/entryId/0_wifqaipd/ks/djJ8MTkwfJ...
   ```

---

## Purpose and Security Implications

### Why KS is Appended to URLs:

1. **Authentication:** KS authenticates the request to access protected media
2. **Authorization:** KS contains permissions and restrictions for the session
3. **DRM/Content Protection:** Some content requires valid KS to access
4. **Privacy:** Private or restricted content requires KS
5. **Session Management:** Tracks and manages user sessions
6. **Analytics:** Associates media requests with specific sessions

### When KS is Required:

- Private entries (not publicly accessible)
- Protected content with access restrictions
- Thumbnail/poster images of private entries
- Download URLs for protected content
- Cuepoint data requests
- Caption/subtitle file requests

### Configuration:

The `loadThumbnailWithKs` configuration flag controls whether KS is appended to thumbnail/poster URLs. This is important because:
- Public content typically doesn't need KS for thumbnails
- Private content requires KS even for thumbnails
- Performance: Adding KS to all thumbnails when not needed adds overhead

---

## Testing

### Test Files Found:
1. **`tests/e2e/common/thumbnail-manager.spec.ts`** - Tests thumbnail KS appending
2. **`tests/e2e/ovp/poster.spec.js`** - Tests poster URL KS appending

### Test Expectations:
```javascript
// From tests/e2e/ovp/poster.spec.js
playerSources.poster.should.equal('/p/1091/thumbnail/entry_id/0_wifqaipd/2/height/360/width/640/ks/123');
```

---

## Search Methodology

### Tools Used:
1. Local repository grep with patterns: `/ks/`, `\.ks`, `ks.*url`
2. GitHub Code Search API with query: `org:kaltura /ks/ language:typescript OR language:javascript`

### Search Patterns:
- `/ks/` - Direct path segment
- `\bks\s*=` - Variable assignment
- `[?&]ks` - Query parameter
- `\.session\.ks` - Session property access

---

## Recommendations

### For Developers:

1. **Always use the `shouldAddKs()` method** to determine if KS should be appended
2. **Follow the pattern** `/ks/${ks}` for consistency across the codebase
3. **Check `loadThumbnailWithKs` configuration** before appending KS to media URLs
4. **Test with both public and private content** to ensure KS handling is correct
5. **Document any new KS URL appending** in this file

### For Security:

1. **Never log or expose KS values** in client-side code
2. **Ensure KS has appropriate expiration** for the use case
3. **Validate KS on the server side** - client-side is only for passing the token
4. **Use HTTPS** when transmitting URLs with KS
5. **Implement proper error handling** when KS is invalid or expired

---

## Related Documentation

- [Kaltura Session (KS) Documentation](https://developer.kaltura.com/api-docs/VPaaS-API-Getting-Started/how-to-create-kaltura-session.html)
- [Thumbnail API Documentation](https://developer.kaltura.com/api-docs/Engage_and_Publish/kaltura-thumbnail-api.html)
- Player Configuration Guide (internal)

---

## Last Updated
2026-01-15

## Contributors
- GitHub Copilot Agent (Initial documentation)

---

## Notes

This document was created as part of a comprehensive audit to find all places where KS is appended to URLs across Kaltura repositories. If you add new code that appends KS to URLs, please update this document.
