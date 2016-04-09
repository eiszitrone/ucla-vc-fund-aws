var fs = require('fs');
var path_base = "./result/";

var system = require('system');
var args = system.args;

var page = require('webpage').create();
page.viewportSize = { width: 1920, height: 1080 };

// function scrape(i, url) {
//  console.log(url);
//   var path = path_base + i +  ".txt";
//   console.log(path);
//   page.open(url, function(status) {
//     console.log(status);
//     page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js", function() {
//       console.log('include js');
//
//       // click on the joined button in 2 secs after page finishes loading
//       window.setTimeout(function() {
//         page.evaluate(function() {
//           $(".sortable.joined").click();
//         });
//       }, 2000);
//
//       //click more
//       function clickMore() {
//         console.log('click more!');
//         window.setTimeout( function () {
//           var isMore = page.evaluate(function() {
//             if ($('.more.hidden').css('display') == 'block') {
//               $('.more.hidden').click();
//               return true;
//             }
//             else {
//               return false;
//             }
//           });
//           console.log(isMore);
//           window.setTimeout(function() {
//             // page.render('more.png');
//             // phantom.exit();
//             var results = page.evaluate(
//               function() {
//                 var results = [];
//                 // get the id of most recent 20 companies
//                 var rows = $(".results_holder div[data-_tn='tags/show/row']");
//                 console.log(rows.length);
//                 for (var i = 0; i < rows.length; ++i) {
//                   results.push($(rows[i]).find('.name a').attr('data-id'));
//                 }
//                 return results;
//               }
//             );
//             fs.write(path, results.join(","), "w");
//             console.log(results);
//             phantom.exit();
//           }, 2000 );
//         }, 5000);
//       }
//       clickMore();
//     });
//   });
// }

//clikc more once
function scrape(i, url) {
 console.log(url);
  var path = path_base + i +  ".txt";
  console.log(path);
  page.open(url, function(status) {
    console.log(status);
    page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js", function() {
      console.log('include js');

      // click on the joined button in 2 secs after page finishes loading
      window.setTimeout(function() {
        page.evaluate(function() {
          $(".sortable.joined").click();
        });
      }, 2000);

      window.setTimeout(function() {
        page.evaluate(function() {
          if ($('.more.hidden').css('display') == 'block') {
              $('.more.hidden').click();
          }
        });
      }, 4000);

      // show the result
      window.setTimeout(
        function () {
          var results = page.evaluate(
            function() {
              var results = [];
              // get the id of most recent 20 companies
              var rows = $(".results_holder div[data-_tn='tags/show/row']");
              console.log(rows.length);
              for (var i = 0; i < rows.length; ++i) {
                results.push($(rows[i]).find('.name a').attr('data-id'));
              }
              return results;
            }
          );
          fs.write(path, results.join(","), "w");
          console.log(results);
          phantom.exit();
        },
        7000
      );
    });
  });
}
scrape(args[1], args[2]);
