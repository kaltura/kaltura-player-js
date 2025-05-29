class FallbackSourcesUtils {
  private static FORMATS = {
    dash: 'mpegdash',
    hls: 'applehttp',
    progressive: 'url'
  };

  /**
   * Checks if a source matches the given condition.
   * @param source The source object to check.
   * @param condition The condition object.
   * @returns True if the source matches the condition, false otherwise.
   */
  private static sourceMatches(source: any, condition: any): boolean {
    if (condition.deliveryProfileId && condition.format) {
      const format = FallbackSourcesUtils.FORMATS[condition.format];
      return source.id.endsWith(`${condition.deliveryProfileId},${format}`);
    }

    return false;
  }

  /**
   * Groups fallback options by their target source format.
   * @param fallbackConfig The configuration for fallback sources.
   * @returns An object where keys are formats and values are arrays of fallback options.
   */
  private static getFallbackOptionsByToSourceFormat(fallbackConfig: any): any {
    return fallbackConfig.reduce((acc: any, { fromSource, toSource }) => {
      if (!acc[toSource.format]) {
        acc[toSource.format] = [];
      }
      acc[toSource.format].push({ fromSource, toSource });
      return acc;
    }, {});
  }

  /**
   * Extracts fallback sources from the provided sources based on the fallback configuration.
   * @param allSources The complete set of sources categorized by format.
   * @param fallbackConfig The configuration for fallback sources.
   * @returns An object containing regular and fallback sources categorized by format.
   */
  public static extractFallbackSources(allSources: any, fallbackConfig: any = []): any {
    const regularSources: any = {};
    const fallbackSources: any = {};

    const fallbackOptionsByFormat = this.getFallbackOptionsByToSourceFormat(fallbackConfig);

    for (const format in this.FORMATS) {
      const formatSources = allSources[format];
      regularSources[format] = [];
      fallbackSources[format] = [];

      for (const source of formatSources) {
        let isFallbackSource = false;

        for (const { toSource } of fallbackOptionsByFormat[format] || []) {
          if (this.sourceMatches(source, toSource)) {
            isFallbackSource = true;
            break;
          }
        }

        if (!isFallbackSource) {
          regularSources[format].push(source);
        } else {
          fallbackSources[format].push(source);
        }
      }
    }

    return {
      fallbackSources,
      regularSources
    };
  }

  /**
   * Returns the first matching fallback source for the selected original source.
   * @param selectedSource The source to match against.
   * @param fallbackSources The available fallback sources.
   * @param fallbackConfig The configuration for fallback sources.
   * @returns The matching fallback source or null if none found.
   */
  public static getMatchingFallbackSources(selectedSource: any, fallbackSources: any, fallbackConfig: any = []): any | null {
    for (const { fromSource, toSource } of fallbackConfig) {
      if (fallbackSources[toSource.format] && this.sourceMatches(selectedSource, fromSource)) {
        for (const source of fallbackSources[toSource.format]) {
          if (this.sourceMatches(source, toSource)) {
            return {
              [toSource.format]: [source]
            };
          }
        }
      }
    }

    return null;
  }
}

export { FallbackSourcesUtils };
