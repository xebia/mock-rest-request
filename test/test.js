var http = require('http');
var request = require('supertest');

var mockRequests = require('..');

describe('mockRequests()', function () {

  var server;

  beforeEach(function () {
    server = createServer({}, function (req, res) {
      res.end('not mocked')
    });
  })
  it('should not mock when no mocks are configured', function (done) {

    request(server)
      .get('/')
      .expect(200)
      .expect('not mocked', done);
  });

  describe('that mocks a GET request', function () {

    beforeEach(function () {
      request(server)
        .post('/mock/api')
        .send({mock: 'data'})
        .end(function () {});
    });

    it('should return the mocked content when the mocked path is requested', function (done) {
      request(server)
        .get('/api')
        .expect(200)
        .expect('{"mock":"data"}', done);
    });

    it('should return the normal content when another path is requested', function (done) {
      request(server)
        .get('/something')
        .expect(200)
        .expect('not mocked', done);
    });

    it('should not mock non GET requests', function (done) {
      request(server)
        .put('/api')
        .expect(200)
        .expect('not mocked', done);
    })
  })

});

function createServer(opts, fn) {
  var _mockRequests = mockRequests(opts)
  return http.createServer(function (req, res) {
    _mockRequests(req, res, function (err) {
      if (err) {
        res.statusCode = err.status || 500
        res.end(err.message)
        return;
      }

      fn(req, res)
    })
  })
}
