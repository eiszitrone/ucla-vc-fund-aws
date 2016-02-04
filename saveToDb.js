var angelApi = require('./modules/angel-api');
var mongoose = require('mongoose');
var Startup = require('./modules/models');
var fs = require("fs")

function saveToDB(file, ndays) {
  var data = fs.readFileSync(file).toString();
  var results = data.split(',');
  results.pop();
  var count = results.length;
  for(var i = 0; i < results.length; ++i) {
    angelApi.getStartupById(results[i], function(result) {
      // only need startups joined within two weeks
      var diffDays = (new Date() - new Date(result.created_at)) / (1000 * 60 * 60 * 24);

      if (diffDays <= ndays) {
        Startup.findOne({"id": result.id}, function(err, user) {
          //user is not added yet
          if (user === null) {
            var newStartup = new Startup(
              {
                id: result.id,
                name: result.name,
                created_at: result.created_at,
                angellist_url: result.angellist_url,
                logo_url : result.logo_url
              }
            );
            newStartup.save(function(err) {
              if (err) console.log("save error: " + err);
              count -= 1;
              disConnect(count);
            });
          }
          else {
            console.log("duplicated item");
            count -= 1;
            disConnect(count);
          }
        })
      }
      else {
        count -= 1;
        disConnect(count);
      }
    });
  }
}
//disconnect db
function disConnect(count) {
  console.log('called with: ' + count);
  if (count === 0) {
    mongoose.disconnect();
  }
}

function emptyDB() {
  Startup.remove({}, function(err) {
    if(err){
      console.log(err)
    }
  });
}

emptyDB();
saveToDB('/home/bitnami/result.txt', 14);
