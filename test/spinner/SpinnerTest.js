import TestHelper from '../TestHelper';
describe('Spinner', () => {
  var Spinner;
  after(function() {
    Spinner.hide();
  });
  before(() => {
    Spinner = TestHelper.require("./spinner/index");
  })
  it('#show success', () => {
    Spinner.show()
    var $ = TestHelper.getSelector();
    assert.equal(1, $(".spinner").length);
    assert.equal(1, $(".spinner .circleloader").length);
  });
  it('#hide success', () => {
    Spinner.show();
    Spinner.hide();
    var $ = TestHelper.getSelector();
    assert.equal("none", $(".spinner").css("display"));
  });
})