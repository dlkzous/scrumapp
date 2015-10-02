var expect = require('expect.js')
  , httpMocks = require('node-mocks-http')
  , getApiInformation = require('../routes/index/getApiInformation');

describe('homepage', function() {

  it('should respond to GET with api metadata', function(done) {

    // Create mock request
    var request = httpMocks.createRequest({
        method: 'GET'
      , url: '/'
    });

    // Create mock response
    var response = response = httpMocks.createResponse();

    getApiInformation(request, response);
    var data = JSON.parse(response._getData());
    expect(response.statusCode).to.equal(200);
    expect(data).to.eql({
        title: 'ScrumAPI'
      , version: '0.0.1'
    });
    done();
  });
});
