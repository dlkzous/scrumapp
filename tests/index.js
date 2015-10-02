var expect = require('expect.js')
  , mockHandler = require('./helpers/mockHandler')
  , getApiInformation = require('../routes/index/getApiInformation');

describe('homepage', function() {

  it('should respond to GET with api metadata', function(done) {

    var service = mockHandler('GET', '/', false);

    getApiInformation(service.request, service.response);
    var data = JSON.parse(service.response._getData());
    expect(service.response.statusCode).to.equal(200);
    expect(data).to.eql({
        title: 'ScrumAPI'
      , version: '0.0.1'
    });
    done();
  });
});
