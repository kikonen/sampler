describe('Hello', function() {
  it('Start hello', function(done) {
    browser.get('http://localhost:4000/sampler');
    expect(browser.getTitle()).toEqual('Sampler');

    element(by.repeater('view in views').row(1)).click();

    element(by.model('server.url')).sendKeys('hello world');
    element(by.model('server.payload')).sendKeys('pay me');

    element(by.buttonText('Okey')).click();

    var elem = element(by.binding('api.config'));
    expect(elem.getText()).toMatch(/pay.*me/);

    done();
  });
});
