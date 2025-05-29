class FallbackSourcesUtils {
  private static FORMATS = {
    dash: 'mpegdash',
    hls: 'applehttp',
    progressive: 'url'
  };

  private static sourceMatches(source: any, condition: any): boolean {
    if (condition.deliveryProfileId && condition.format) {
      const format = FallbackSourcesUtils.FORMATS[condition.format];
      return source.id.endsWith(`${condition.deliveryProfileId},${format}`);
    }

    return false;
  }

  private static getFallbackOptionsByToSourceFormat(fallbackConfig: any): any {
    return fallbackConfig.reduce((acc: any, { fromSource, toSource }) => {
      if (!acc[toSource.format]) {
        acc[toSource.format] = [];
      }
      acc[toSource.format].push({ fromSource, toSource });
      return acc;
    }, {});
  }

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
