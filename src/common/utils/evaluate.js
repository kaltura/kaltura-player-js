//@flow

/**
 * @param {string} template - The template string to evaluate
 * @param {Object} model - The model to evaluate with
 * @return {string} - The evaluated string
 */
function evaluate(template: string, model: Object = {}): string {
  try {
    let reg, res = template;
    for (let key in model) {
      reg = new RegExp('{{' + key + '}}', 'g');
      res = res.replace(reg, (model[key] !== undefined && model[key] !== null) ? model[key] : "");
    }
    return res;
  } catch (e) {
    return "";
  }
}

export default evaluate;
