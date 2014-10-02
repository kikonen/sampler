require('./hello_page');

describe('Hello', function() {
  it('Start hello', function(done) {
    var page = new HelloPage();
    page.get();

    page.url.sendKeys('hello world');
    page.payload.sendKeys('pay me');

    page.ok.click();

    expect(page.config.getText()).toMatch(/pay.*me/);

    done();
  });
});
