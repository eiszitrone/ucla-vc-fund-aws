var phantom = require('phantom');
var angelApi = require('./modules/angel-api');
var mongoose = require('mongoose');
var Startup = require('./modules/models');
// list of urls to query to find all ucla related startups
var url_list = [
                'https://angel.co/university-of-california-los-angeles',
                'https://angel.co/ucla-anderson-school-of-management-1',
                'https://angel.co/ucla-school-of-law-1',
                'https://angel.co/ucla-law',
                'https://angel.co/ucla-extension',
                'https://angel.co/ucla-school-of-theater-film-and-television',
                'https://angel.co/ucla-2',
                'https://angel.co/university-of-california-extension-los-angeles'
              ];

var nConnection = url_list.length;

/**
* @url: url to be scraped
* @ndays: fetch companies created within ndays
**/
function scraper(url, ndays) {
  phantom.create(function (ph) {
    ph.createPage(function (page) {
      page.open(url, function (status) {
        console.log(status);
        page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js", function() {

          // click the joined button, wait for 2 secs for page to load
          setTimeout(function() {
            page.evaluate(function() {
              $(".sortable.joined").click();
            });
          }, 2000);

          // click the more button
          // setTimeout(function() {
          //   page.evaluate(function() {
          //     $(".more.hidden").click();
          //   });
          // }, 4000);

          // parse all results and save to db, wait for 5 seconds after click the button and page fully loaded
          setTimeout(function () {
            page.evaluate(
              function() {
                var results = [];
                // get the id of most recent 20 companies
                var rows = $(".results_holder div[data-_tn='tags/show/row']");
                for (var i = 0; i < rows.length; ++i) {
                  results.push($(rows[i]).find('.name a').attr('data-id'));
                }
                return results;
              },
              // results: all startup ids
              function(results) {
                console.log(url);
                console.log("result: " + results);
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
            );
            ph.exit();
          }, 5000);
        });
      });
    });
  });
}

//disconnect db
function disConnect(count) {
  // console.log("called with " + count);
  if (count === 0) {
    nConnection -= 1;
    // console.log("connection: " + nConnection);
    if (nConnection === 0) mongoose.disconnect();
  }
}

function scrapeAngelist() {
  for (var i = 0; i < url_list.length; ++i) {
    // find the most recent added compines within 14 days
    scraper(url_list[i], 14);
  }
}

scrapeAngelist();

// module.exports.scrapeAngelist = scrapeAngelist;
