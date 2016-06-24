import TestHelper from '../TestHelper';
import cheerio from 'cheerio';
import Promise from 'bluebird';

describe('Notification', () => {
  after(function() {
    // TestHelper.clean();
  });
  var Notification;
  var EXPECTED_MESSAGE = "Hello World";
  before(() => {
    Notification = TestHelper.require("./notification/index");
  })
  it('#create info', () => {
    Notification.create({
      message: EXPECTED_MESSAGE
    })
    var $ = TestHelper.getSelector();
    assert.equal(1, $("#notification .info").length);
    assert.equal($(".notification-info-msg").text(), EXPECTED_MESSAGE);
  });
  it('#create warning', () => {
    Notification.create({
      message: EXPECTED_MESSAGE,
      type: "warning"
    })
    var $ = TestHelper.getSelector();
    assert.equal(1, $("#notification .warning").length);
    assert.equal($(".notification-info-msg").text(), EXPECTED_MESSAGE);
  });
  it('#create success', () => {
    Notification.create({
      message: EXPECTED_MESSAGE,
      type: "success"
    })
    var $ = TestHelper.getSelector();
    assert.equal(1, $("#notification .success").length);
    assert.equal($(".notification-info-msg").text(), EXPECTED_MESSAGE);
  });
  it('#create error', () => {
    Notification.create({
      message: EXPECTED_MESSAGE,
      type: "error"
    })
    var $ = TestHelper.getSelector();
    assert.equal(1, $("#notification .error").length);
    assert.equal($(".notification-info-msg").text(), EXPECTED_MESSAGE);
  });
  it('#create keep still', function(done) {
    this.timeout(10000);

    Notification.create({
      message: EXPECTED_MESSAGE,
      type: "info"
    })
    var $ = TestHelper.getSelector();
    assert.equal(1, $("#notification .info").length);
    assert.equal($(".notification-info-msg").text(), EXPECTED_MESSAGE);

    Promise.delay(4000).then(() => {
      var $ = TestHelper.getSelector();
      assert.equal(0, $("#notification .info").length);
    }).then(() => {
      Notification.create({
        message: EXPECTED_MESSAGE,
        timeout: -1
      })
    }).delay(4000).then(() => {
      var $ = TestHelper.getSelector();
      assert.equal(1, $("#notification .info").length);
      assert.equal($(".notification-info-msg").text(), EXPECTED_MESSAGE);
      done();
    })
  });
});