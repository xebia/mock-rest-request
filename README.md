mock-rest-request
=================

[![Build Status](https://travis-ci.org/xebia/mock-rest-request.svg?branch=master)](https://travis-ci.org/xebia/mock-rest-request)

[![NPM](https://nodei.co/npm/mock-rest-request.png)](https://nodei.co/npm/mock-rest-request/)

This library can be used to Mock REST requests in NodeJS. It works with [Connect](http://www.senchalabs.org/connect/) middleware and adds on the fly mock functionality to a NodeJS server.

## Why use this library

Sometimes when you're testing a website or app that's backed by a NodeJS server, you'd like to see what happens if the server would give different results. That's what this library does for you.

## How it works?

You send a POST request to your webserver telling it that you want to mock a certain request. This POST request contains the mock data. After that, GET requests will return the mocked data.

Of course also wotks with other methods besides GET and you can also mock status codes other than 200.

## Use with Grunt

The above scenario can be easily applied to web applications build with Grunt when using Grunt with Connect middleware. See below for examples of how to configure this.

# Installation

Install with NPM and add to your project.

## With Connect middleware

    var mockRequests = require('mock-rest-requests');
    var app = connect()
      .use(mockRequests())

    http.createServer(app).listen(3000);

## Without Connect middleware

    var http = require('http');
    var mockRequests = require('mock-rest-requests');
    http.createServer(function (req, res) {
      mockRequests()(req, res);
    }).listen(3000);
  
## In Gruntfile.js

    var mockRequests = require('mock-rest-requests');
    
    connect: {
      options: {
        // your options
      },
      livereload: {
        options: {
        },
        middleware: function (connect, options) {
          var middlewares = [];
          middlewares.push(mockRequests());
          return middlewares;
        }
      }
    }
    
# Usage

Once you've added `mock-rest-requests` to your project, you can start making POST requests to mock certain rest requests. These call need to start the path with `/mock`, followed by the path to mock.

Let's say we have our server running on localhost, port 3000 and we want to mock the call that gives back the user. With curl we can send the POST request telling the server that we want to mock this request.

    curl -X POST -d '{"name":"Foo"}' http://localhost:3000/mock/api/user
    
After that, normal calls (like the ones coming from our web application) will then return the mocked data.

    curl http://localhost:3000/api/user
    
    {"name":"Foo"}
      
