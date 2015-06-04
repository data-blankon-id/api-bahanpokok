var parse = require('./lib/parse');

parse(function(err, data){
  console.log(data.dates);
  console.log(err || data.cities['Kota Bandung']);
});
