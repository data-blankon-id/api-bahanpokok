var cheerio = require('cheerio');
var request = require('request');
var parseCol = require('./parse-col');
var ROOT = 'http://ews.kemendag.go.id/';

function parse(html) {
  var $ = cheerio.load(html);
  var cities = {};
  var currentName = '';
  
  var domesticDates = $('#domestik-header').find('span');
  var internationalDates = $('#int-header').find('span');

  var domestic = {
    from: $(domesticDates[1]).text(),
    to: $(domesticDates[2]).text()
  }
  
  var international = {
    from: $(internationalDates[1]).text(),
    to: $(internationalDates[2]).text()
  }

  $('.city').each(function(i, el){
    currentName = $(el).text().trim();
    cities[currentName] = cities[currentName] || {};
    cities[currentName].name = currentName;
    var table = $(el).next();
    $(table).find('tr').each(parseRow);
  });
  function parseRow(i, row) {
    $(row).each(parseColumn);
  }
  function parseColumn(i, col) {
    var obj = parseCol($(col).html());
    cities[currentName].prices = cities[currentName].prices || [];
    cities[currentName].prices.push(obj);
  }
  var ret = {
    dates : {
      domestic : domestic,
      international : international
    },
    cities : cities
  }
  return ret;
}
var options = {
  url: ROOT,
  headers : {
    'User-Agent': 'Bahan Pokok NKRI Mahal?v1.0'
  }
}

module.exports = function(cb) {
  request.get(options, function(err, response, body){
    if (err || response.statusCode != 200)
      return cb(err || new Error('Cannot reach upstream'));
    cb(null, parse(body));
  });
}

