/**
 * Mock REST requests.
 *
 * See README.md for documentation of options.
 *
 * @param {Object} options
 * @return {Function} middleware
 * @api public
 */

module.exports = function mockRequests(options) {
  var mocks = {
    GET: {},
    PUT: {},
    POST: {},
    PATCH: {},
    DELETE: {}
  };

  function mocksForRequest(req) {
    var method = req.headers['mock-method'] || 'GET';

    if(typeof mocks[method] === 'undefined')
      mocks[method] = {};

    return mocks[method];
  }

  if (options.hasOwnProperty('map')) {
    mocks['GET'] = options.map['GET'] || {};
    mocks['POST'] = options.map['POST'] || {};
    mocks['PUT'] = options.map['PUT'] || {};
  }

  return function (req, res, next) {
    if (req.method === 'POST' && req.url.indexOf('/mock') === 0) {
      var path = req.url.substring(5);

      var body = '';
      req.on('data', function (data) {
        body += data;
      });
      req.on('end', function () {

        var headers = {
          'Content-Type': req.headers['content-type']
        };
        for (var key in req.headers) {
          if (req.headers.hasOwnProperty(key)) {
            if (key.indexOf('mock-header-') === 0) {
              headers[key.substring(12)] = req.headers[key];
            }
          }
        }

        var mocks = mocksForRequest(req);
        mocks[path] = {
          body: body,
          responseCode: req.headers['mock-response'] || 200,
          headers: headers
        };

        res.writeHead(200);
        res.end();
      });
    } else if (req.url.indexOf('/reset') === 0) {
      mocksForRequest(req)[req.url.substring(6)] = null;
      res.writeHead(200);
      res.end();
    } else if (req.url.indexOf('/list') === 0) {
      res.writeHead(200, {
          'Content-Type': 'text/plain'
      });
      for(var method in mocks) {
          res.write(method + ":\n");
          for(var p in mocks[method]) {
            res.write(" " + p + "\n");
          }
      }
      res.end();
    } else  {
      var mockedResponse = mocks[req.method][req.url];
      if (mockedResponse) {
        res.writeHead(mockedResponse.responseCode, mockedResponse.headers);
        res.write(mockedResponse.body);
        res.end();
      } else {
        next();
      }
    }
  };
};
