var request = require('./parse');
var config = require('../config');
var boom = require('boom');
var joi = require('joi');

var Plugin = function(server, options, next) {
  if (!(this instanceof Plugin)) {
    return new Plugin(server, options, next);
  }
  this.server = server;
  this.options = options || {};
  this.register();

  function bahanpokok(next) {
    request(next);
  }

  server.method('bahanpokok', bahanpokok, {
    cache: {
      expiresIn: config.cacheExpiresIn
    }
  });
}

Plugin.prototype.register = function() {
  var self = this;
  var routes = config.routes;
  self.server.route({
    method: 'GET',
    path: '/bahanpokok/period',
    config: {
      handler: function(req, reply) {
        self.server.methods.bahanpokok(function(err, data) {
          if (err)
            return reply(boom.wrap(err));
          reply(data.dates);
        });
      },
      description: 'No description yet.',
      notes: 'No implementation notes yet.',
      validate: {},
      tags: ['api']
    }
  });  
  
  self.server.route({
    method: 'GET',
    path: '/bahanpokok/cities',
    config: {
      handler: function(req, reply) {
        self.server.methods.bahanpokok(function(err, data) {
          if (err)
            return reply(boom.wrap(err));
          reply(Object.keys[data.cities]);
        });
      },
      description: 'No description yet.',
      notes: 'No implementation notes yet.',
      validate: {},
      tags: ['api']
    }
  });  
  
  self.server.route({
    method: 'GET',
    path: '/bahanpokok', // /bahanpokok?q=Kota+Bandung
    config: {
      handler: function(req, reply) {
        self.server.methods.bahanpokok(function(err, data) {
          if (err)
            return reply(boom.wrap(err));
          var reply = {};
          var cities = Object.keys(data.cities);
          cities = cities.filter(function(city){
            return city.toLowerCase().indexOf(req.query.q.toLowerCase()) >= 0;
          });

          var pickedCities = [];
          
          for (var k in data.cities) {
            if (cities.indexOf(data.cities[k]).name) {
              pickedCities.push(data.cities[k]); 
            }  
          }

          var ret = {
            period : data.dates,
            cities : pickedCities
          }

          reply.send(ret);
        });
      },
      description: 'No description yet.',
      notes: 'No implementation notes yet.',
      validate: {
        query : {
          q: joi.string().required()
        }
      },
      tags: ['api']
    }
  });  
}

exports.register = function(server, options, next) {
  Plugin(server, options, next);
  next();
}

exports.register.attributes = {
  pkg: require(__dirname + '/../package.json')
};

