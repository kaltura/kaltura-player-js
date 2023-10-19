import evaluate from '../../../../src/common/utils/evaluate';

describe('evaluate', function () {
  const dataObject = {
    a: {
      a1: '{{token1}}',
      a2: '{{token2}}'
    },
    b: {
      b1: '{{token3}}',
      b2: '{{token4}}'
    }
  };
  const template = JSON.stringify(dataObject);
  const model = {token1: 1, token2: 2};
  const modelWithDoubleQuotes = {token1: 'my expression with "double quotes"', token2: 2};

  it('should evaluate and replace template tokens which have model values', function () {
    const evaluatedTemplate = evaluate(template, model);
    const evaluatedDataObj = JSON.parse(evaluatedTemplate);
    evaluatedDataObj.a.a1.should.be.equal('1');
    evaluatedDataObj.a.a2.should.be.equal('2');
  });

  it("should evaluate and not replace template tokens which don't have model values", function () {
    const evaluatedTemplate = evaluate(template, model);
    const evaluatedDataObj = JSON.parse(evaluatedTemplate);
    evaluatedDataObj.b.b1.should.be.equal('{{token3}}');
    evaluatedDataObj.b.b2.should.be.equal('{{token4}}');
  });

  it('should escape model values which have double quotes', function () {
    const evaluatedTemplate = evaluate(template, modelWithDoubleQuotes);
    const evaluatedDataObj = JSON.parse(evaluatedTemplate);
    evaluatedDataObj.a.a1.should.be.equal('my expression with "double quotes"');
    evaluatedDataObj.a.a2.should.be.equal('2');
  });
});
