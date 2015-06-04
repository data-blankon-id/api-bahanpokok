var cheerio = require('cheerio');

module.exports = function(html) {
  var obj = {};
  var $ = cheerio.load(html);
  $('td').each(function(i, td){
    var text = $(td).text().trim().split('\n').join('');
    if (i == 0) {
      var arr = text.split('(');
      var unit = arr.pop();
      obj.unit = unit.substring(0, unit.length - 1);
      obj.name = arr.join('').trim();
    } else if (i == 1) {
      var arr = text.split(' ');
      obj.price = arr.pop();
      var delta = arr.join('').trim();
      obj.delta = delta.substring(1, delta.length - 1);
    } 
  });
  return obj;
}
