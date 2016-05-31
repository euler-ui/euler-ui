import TestHelper from '../TestHelper';
// import Select from '../../src/select/select.css'

describe('<Select />', () => {
  after(function() {
    // TestHelper.clean();
  });
  it('creates correctly', () => {
    var Select = TestHelper.createRenderedComponent("./select/index");
    assert.isOk(Select);
  });
});