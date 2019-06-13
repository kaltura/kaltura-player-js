//@flow

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
