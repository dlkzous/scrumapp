var httpMocks = require('node-mocks-http');

module.exports = function(method, url, events) {
  var service = {
      request: {}
    , response: {}
  };

  // Create a mock request
  service.request = httpMocks.createRequest({
      method: method
    , url: url
  });

  // Create mock response
  if(events) {
    service.response = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
  } else {
    service.response = httpMocks.createResponse();
  }

  return service;
};
