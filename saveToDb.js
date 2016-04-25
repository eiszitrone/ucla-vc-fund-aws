var angelApi = require('./modules/angel-api');
var mongoose = require('mongoose');
var Startup = require('./modules/models');
var fs = require("fs")

var GoogleSpreadsheet = require("google-spreadsheet");
// spreadsheet key is the long id in the sheets URL
// var my_sheet = new GoogleSpreadsheet('1QYPfi6RCTeq1SmQELpvzuMFemWOIJkI4gG63eKRLBvk');
var my_sheet = new GoogleSpreadsheet('1Ak6H4bPKPmmYFgX79GhIeMeWiZ5sNvRsmKdUv7fmkY4');

// var creds = require('./ucla-vc-fund1-a79372de14ea.json');
var creds = require('./ucla--vc-fund-web-app-35176ee5cf77.json');


function saveToDB(file) {
  my_sheet.useServiceAccountAuth(creds, function(err){
    console.log("useServiceAccount err: " + err);
    var data = fs.readFileSync(file).toString();
    var results = data.split(',');
    if (results[results.length - 1] === "") {
      results.pop();
    }
    console.log(results);
    var count = results.length;
    console.log(count);
    // for(var i = 0; i < results.length; ++i) {
    function process() {
      if (count === 0) {
        console.log('finish processing!');
        return;
      }
      angelApi.getStartupInfoById(results[results.length - count], 1, function(result) {
        // only need startups joined within two weeks

        var diffDays = (new Date() - new Date(result.created_at)) / (1000 * 60 * 60 * 24);

        if (true) {
          console.log("add one new startup: " + result.name);
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
              angelApi.getStartupInfoById(result.id, 2, function(founderInfo) {
                var founders = [];
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
                //get investers
                angelApi.getStartupInfoById(result.id, 3, function(investorInfo) {
                  var investors = [];
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
                  //save to database
                  var created_date = new Date(result.created_at);
                  var newStartup = new Startup(
                    {
                      id: result.id,
                      name: result.name,
                      product_desc: result.product_desc,
                      high_concept: result.high_concept,
                      company_url: result.company_url,
                      crunchbase_url: result.crunchbase_url,
                      linkedin_url: result.linkedin_url,
                      company_size: result.company_size,
                      location: locations,
                      markets: markets,
                      created_at: created_date,
                      angellist_url: result.angellist_url,
                      logo_url : result.logo_url,
                      founders: founders,
                      investors: investors
                    }
                  );
                  newStartup.save(function(err) {
                    if (err) console.log("save error: " + err);
                    // count -= 1;
                    // disConnect(count);
                  });

                  if (result.company_size !== null) {
                    result.company_size = result.company_size.replace('-', '~');
                  }
                  var newRow = {
                      Name: result.name,
                      Product_desc: result.product_desc,
                      High_concept: result.high_concept,
                      Company_url: result.company_url,
                      Crunchbase_url: result.crunchbase_url,
                      Linkedin_url: result.linkedin_url,
                      Company_size: result.company_size,
                      Locations: locations.join(" | "),
                      Markets: markets.join(" | "),
                      Created_at: created_date.toISOString().substring(0, 10),
                      Angellist_url: result.angellist_url,
                      Founder1_name: null,
                      Founder1_AngelURL: null,
                      Founder1_Bio: null,
                      Founder2_name: null,
                      Founder2_AngelURL: null,
                      Founder2_Bio: null,
                      Investor1_name: null,
                      Investor1_AngelURL: null,
                      Investor1_URL: null,
                      Investor2_name: null,
                      Investor2_AngelURL: null,
                      Investor2_URL: null,
                    };
                  if (founders.length >= 1) {
                    newRow.Founder1_name = founders[0].founderName;
                    newRow.Founder1_AngelURL = founders[0].founderAngelURL;
                    newRow.Founder1_Bio = founders[0].founderBio;
                  }
                  if (founders.length >= 2) {
                    newRow.Founder2_name = founders[1].founderName;
                    newRow.Founder2_AngelURL = founders[1].founderAngelURL;
                    newRow.Founder2_Bio = founders[1].founderBio;
                  }
                  if (investors.length >= 1) {
                    newRow.Investor1_name = investors[0].investorName;
                    newRow.Investor1_AngelURL = investors[0].investorAngelURL;
                    newRow.Investor1_URL = investors[0].investorURL;
                  }
                  if (investors.length >= 2) {
                    newRow.Investor2_name = investors[1].investorName;
                    newRow.Investor2_AngelURL = investors[1].investorAngelURL;
                    newRow.Investor2_URL = investors[1].investorURL;
                  }
                  //save to spreadsheet
                  // console.log(newRow);
                  if (newRow.Product_desc) {
                    newRow.Product_desc = newRow.Product_desc.replace(/\x0b/g, '');
                  }
                	my_sheet.addRow(1, newRow, function(err) {
                    console.log("addRow err  " + err);
                    count -= 1;
                    disConnect(count);
                    process();
                  });
                });
              });
            }
            else {
              console.log("duplicated item");
              count -= 1;
              disConnect(count);
              process();
            }
          })
        }
        else {
          count -= 1;
          disConnect(count);
          process();
        }
      });
    }

    process();
  });
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

// emptyDB();

saveToDB('./result/result1.txt');
// Startup.find({}).sort({created_at: -1}).limit(1).exec(function(err, doc) {
//     // console.log(doc[0].created_at);
//     saveToDB('./result/result.txt', doc[0].created_at);
//
// });
// saveToDB('/home/bitnami/result.txt', 14);
