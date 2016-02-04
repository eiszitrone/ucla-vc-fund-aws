var client_ID = 'd72fc260373e734b2569867db0e4d3d90a966d17167180e0';
var client_secret = '0c21a1176da15d4dcabc149f1d7384dfaa83a3956186328e';
var access_token = 'ba666f0229495e5b6c0f9a3e72ccc70dcb113b61db5d834c';
var https = require('https');

/*
@slugs startup name in angellist
*/
var getStartupById = function (id, callback) {
  var searchOption = {
    hostname: 'api.angel.co',
    path: '/1/startups/' + id + '?access_token=' + access_token,
    method: 'GET'
  };

  var searchReq = https.request(searchOption, function (searchRes) {
    var searchData = "";
    searchRes.setEncoding('utf8');

    searchRes.on('data', function(d) {
      searchData += d;
    });

    searchRes.on('end', function() {
      searchData = JSON.parse(searchData);
      callback(searchData);
    })
  });

  searchReq.end();
  searchReq.on('error', function (e) {
      console.error(e);
  });
};
module.exports.getStartupById = getStartupById;
