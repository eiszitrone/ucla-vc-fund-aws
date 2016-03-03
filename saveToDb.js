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
    angelApi.getStartupInfoById(results[i], 1, function(result) {
      // only need startups joined within two weeks
      var diffDays = (new Date() - new Date(result.created_at)) / (1000 * 60 * 60 * 24);

      if (diffDays <= ndays) {
        Startup.findOne({"id": result.id}, function(err, user) {
          //user is not added yet
          if (user === null) {
            var markets = [];
            var locations = [];

            //get the markets
            for (var j = 0; j < result.markets.length; ++j) {
              markets.push(result.markets[j].display_name);
            }

            //get the locations
            for (j = 0; j < result.locations.length; ++j) {
              locations.push(result.locations[j].display_name);
            }
            //get founders
            var founders = [];
            angelApi.getStartupInfoById(results[i], 2, function(founderInfo)) {
              for (j = 0; j < founderInfo.startup_roles.length; ++j) {
                founders.push(
                  {
                    founderName: founderInfo.startup_roles[j].tagged.name,
                    founderId:   founderInfo.startup_roles[j].tagged.id,
                    founderAngelURL: founderInfo.startup_roles[j].tagged.angellist_url,
                    founderBio:  founderInfo.startup_roles[j].tagged.bio
                  }
                );
              }
            }
            //get investers
            var investors = [];
            angelApi.getStartupInfoById(results[i], 3, function(investorInfo)) {
              for (j = 0; j < investorInfo.startup_roles.length; ++j) {
                investors.push(
                  {
                    investorName: investorInfo.startup_roles[j].tagged.name,
                    investorId:   investorInfo.startup_roles[j].tagged.id,
                    investorAngelURL: investorInfo.startup_roles[j].tagged.angellist_url,
                    investorURL:  investorInfo.startup_roles[j].company_url
                  }
                );
              }
            }
            var newStartup = new Startup(
              {
                id: result.id,
                name: result.name,
                product_desc: result.product_desc,
                high_concept: result.high_concept,
                company_url: result.company_url,
                crunchbase_url: result.crunchbase_url,
                linkedin_url: result.crunchbase_url,
                company_size: result.company_size,
                location: locations,
                markets: markets,
                created_at: result.created_at,
                angellist_url: result.angellist_url,
                logo_url : result.logo_url,
                founders: founders,
                investors: investors
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
