var client_ID = 'd72fc260373e734b2569867db0e4d3d90a966d17167180e0';
var client_secret = '0c21a1176da15d4dcabc149f1d7384dfaa83a3956186328e';
// var access_token = 'ba666f0229495e5b6c0f9a3e72ccc70dcb113b61db5d834c';
var access_token = '705b264b43a8a61cf7705f91a58849e25eccc6b9fa9b6c28';
var https = require('https');

/*
@slugs startup name in angellist
*/
var getStartupInfoById = function (id, flag, callback) {
  //using angellist api to retrieve data
  //flag = 1 retrieving info of the startup
  //flag = 2 retrieving founder info of the startup
  //flag = 3 retrieving investor info of the startup

  console.log(id);
  var searchOption;
  if (flag === 1) {
    searchOption = {
      hostname: 'api.angel.co',
      path: '/1/startups/' + id + '?access_token=' + access_token,
      method: 'GET'
    };
  }
  else if (flag === 2) {
      searchOption = {
        hostname: 'api.angel.co',
        path: '/1/startup_roles?v=1&startup_id=' + id + '&role=founder&access_token=' + access_token,
        method: 'GET'
    };
  }
  else if (flag === 3) {
    searchOption = {
      hostname: 'api.angel.co',
      path: '/1/startup_roles?v=1&startup_id=' + id + '&role=past_investor&access_token=' + access_token,
      method: 'GET'
    };
  }

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

module.exports.getStartupInfoById = getStartupInfoById;
