var url = 'https://angel.co/university-of-california-los-angeles';
var page = require('webpage').create();
page.viewportSize = { width: 1920, height: 1080 };

console.log('in');
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

    // show the result
    window.setTimeout(
      function () {
        var results = page.evaluate(
          function() {
            var results = [];

            // get the id of most recent 20 companies
            var rows = $(".results_holder div[data-_tn='tags/show/row']");
            for (var i = 0; i < rows.length; ++i) {
              results.push($(rows[i]).find('.name a').attr('data-id'));
            }
            return results;
          }

        );
        console.log(results);
        // console.log(row);

        page.render('xx.png');
        phantom.exit();
      },
      5000
    );
  });
});
