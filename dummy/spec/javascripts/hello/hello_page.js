HelloPage = function() {
  this.url = element(by.model('server.url'));
  this.api = element(by.model('server.api'));
  this.payload = element(by.model('server.payload'));
  this.ok = element(by.buttonText('Okey'));

  this.config = element(by.binding('api.config'));

  this.get = function() {
    browser.get('http://localhost:4000/sampler');
    expect(browser.getTitle()).toEqual('Sampler');
    element(by.repeater('view in views').row(1)).click();
  };
};
