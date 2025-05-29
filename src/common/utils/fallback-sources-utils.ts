class FallbackSourceUtils {
  private static FORMATS = {
    dash: 'mpegdash',
    hls: 'applehttp',
    progressive: 'url'
  };

  //   public static extractFallbackSources(sources: any, fallbackConfig: any = []): any {
  //     const regularSources: any = {
  //       dash: [],
  //       hls: [],
  //       progressive: []
  //     };
  //     const fallbackSources: any = {
  //       dash: [],
  //       hls: [],
  //       progressive: []
  //     };

  //     // arrange fallback sources by format
  //     const fallbackSourcesOptionsByFormat = fallbackConfig.reduce((acc: any, { fromSource, toSource }) => {
  //       if (!acc[toSource.format]) {
  //         acc[toSource.format] = [];
  //       }
  //       acc[toSource.format].push({ fromSource, toSource });
  //       return acc;
  //     }, {});

  //     for (const format in this.FORMATS) {
  //       const formatSources = sources[format];

  //       // filter all fallback sources for the current format
  //       const formatFallbackSources = formatSources.filter((formatSource) => {
  //         return fallbackSourcesOptionsByFormat[format].find({toSource} => {
  //             return FallbackSourceUtils.sourceMatches(formatSource, toSource);
  //         })
  //       });

  //       //   for (let i = 0; i < sources[format].length; ++i) {
  //       //     const

  //       //     // if (source.fallbackSources && source.fallbackSources[formatName]) {
  //       //     //   fallbackSources[format].push(source);
  //       //     //   regularSources[format] = regularSources[format].filter((s) => s.id !== source.id);
  //       //     // }
  //       //   }
  //     }

  // for (const { toSource } of fallbackConfig) {
  //   for (let i = 0; i < sources[toSource.format]; ++i) {
  //     if (this.sourceMatches(regularSources[i], toSource)) {
  //       regularSources[toSource.format].fallbackSources[toSource.format].push(source);
  //     } else {
  //       regularSources[toSource.format].push(source);
  //     }
  //   }
  // }

  // for (const format in this.FORMATS) {
  //   const formatSources = sources[format];

  //   for (const source of formatSources) {
  //     const { deliveryProfileId } = source;

  //   }
  // }

  //     return {
  //       fallbackSources,
  //       regularSources
  //     };
  //   }

  public static matchSourceToFallback(selectedSource: any, fallbackSources: any, fallbackConfig: any = []): any | null {
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

  private static sourceMatches(source: any, condition: any): boolean {
    if (condition.deliveryProfileId && condition.format) {
      const format = FallbackSourceUtils.FORMATS[condition.format];
      return source.id.endsWith(`${condition.deliveryProfileId},${format}`);
    }

    return false;
  }
}

export { FallbackSourceUtils };
