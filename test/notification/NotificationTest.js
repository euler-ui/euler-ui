import TestHelper from '../TestHelper';

describe('Notification', () => {
  after(function() {
    // TestHelper.clean();
  });
  it('#create', () => {
    var Notification = TestHelper.require("./notification/index");
    assert.isOk(Notification);
  });
});