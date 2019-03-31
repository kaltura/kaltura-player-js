//@flow

/**
 * get token value by key
 * @param {Object} tokens - tokens dictionary
 * @param {string} tokenName - token name
 * @param {string} delimiter - token path delimiter
 * @returns {string|Object|null} - the resolved token value
 */
function getTokenValue(tokens: Object, tokenName: string, delimiter: string): string | Object | null {
  var tmpTokens = tokens;

  if (tokens.hasOwnProperty(tokenName)) {
    return tokens[tokenName];
  }

  var tokenNameParts = tokenName.split(delimiter);

  for (var i = 0; i < tokenNameParts.length; i++) {
    if (tmpTokens.hasOwnProperty(tokenNameParts[i])) {
      tmpTokens = tmpTokens[tokenNameParts[i]];
    } else {
      return null;
    }
  }

  return tmpTokens;
}

/**
 * xxx
 * @param {Object | string} target - the target
 * @param {Object} options - the tokens
 * @returns {Object | string} - the evaluated target
 */
function replace(target: Object | string, options: Object = {tokens: {}, delimiter: '.'}): Object | string {
  var regexPattern = `{{(.+?)}}`;
  var includeRegExp = new RegExp(regexPattern, 'g');
  var isObject = false;
  var text;

  if (typeof target === 'object') {
    text = JSON.stringify(target);
    isObject = true;
  } else if (typeof target === 'string') {
    text = target;
  } else {
    text = target.toString();
  }

  var retVal = text;
  var regExpResult;

  while ((regExpResult = includeRegExp.exec(text))) {
    var fullMatch = regExpResult[0];
    var tokenName = regExpResult[1];
    var tokenValue = getTokenValue(options.tokens, tokenName, options.delimiter || '.');

    if (tokenValue === null) {
      tokenValue = '';
    }

    if (tokenValue !== null) {
      if (typeof tokenValue === 'object') {
        tokenValue = JSON.stringify(tokenValue);
        tokenValue = tokenValue.replace(/"/g, '\\"');
      } else if (typeof tokenValue === 'string') {
        if (tokenValue.indexOf('"') > -1) {
          tokenValue = tokenValue.replace(/"/g, '\\"');
        }
      }

      retVal = retVal.replace(fullMatch, tokenValue);
    }
  }

  return isObject
    ? JSON.parse(retVal, function(key) {
        try {
          return JSON.parse(this[key]);
        } catch (e) {
          return this[key];
        }
      })
    : retVal;
}

/**
 * @private
 * @param {string} template - The template string to evaluate
 * @param {Object} model - The model to evaluate with
 * @return {string} - The evaluated string
 */
function evaluate(template: string, model: Object = {}): string {
  try {
    let reg,
      res = template;
    for (let key in model) {
      let value = model[key] !== undefined && model[key] !== null ? model[key] : '';
      if (typeof value === 'string' && value.indexOf('"') > -1) {
        value = value.replace(/"/g, '\\"');
      }
      reg = new RegExp('{{' + key + '}}', 'g');
      res = res.replace(reg, value);
    }
    return res;
  } catch (e) {
    return '';
  }
}

export default evaluate;
export {replace};
