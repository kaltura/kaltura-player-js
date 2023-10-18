'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * @private
 * @param {string} template - The template string to evaluate
 * @param {Object} model - The model to evaluate with
 * @return {string} - The evaluated string
 */
function evaluate(template, model) {
  if (model === void 0) {
    model = {};
  }
  try {
    var reg = void 0,
      res = template;
    for (var key in model) {
      var value = model[key] !== undefined && model[key] !== null ? model[key] : '';
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
exports.default = evaluate;
//# sourceMappingURL=evaluate.js.map
