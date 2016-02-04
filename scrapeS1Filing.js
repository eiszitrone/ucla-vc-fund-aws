var phantom = require('phantom');

function makeURL(date) {
  var format1 = /\d{2}\/\d{4}/;
  var format2 = /\d{4}/;
  var fromDate, toDate, url;
  if (format1.test(date)) {
    var month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var month = parseInt(date.substring(0, 2));
    var year = parseInt(date.substring(3));
    var days = month_days[month - 1];
    if (month == 2 && (year % 4 == 0 && year % 100 != 0 || year % 400 == 0)) days += 1;

    fromDate = date.substring(0, 2) + "/01/" + date.substring(3);
    toDate = date.substring(0, 2) + "/" + days + "/" + date.substring(3);
    url = "https://searchwww.sec.gov/EDGARFSClient/jsp/EDGAR_MainAccess.jsp?search_text=ucla&sort=Date&formType=FormS1&isAdv=true&stemming=true&numResults=100&fromDate=" + fromDate + "&toDate=" + toDate + "&numResults=100";
  }
  else if(format2.test(date)) {
    console.log("in format2");
    fromDate = "01/01/" + date;
    toDate = "12/31/" + date;
    url = "https://searchwww.sec.gov/EDGARFSClient/jsp/EDGAR_MainAccess.jsp?search_text=ucla&sort=Date&formType=FormS1&isAdv=true&stemming=true&numResults=100&fromDate=" + fromDate + "&toDate=" + toDate + "&numResults=100";
  }
  else {
    url = "";
  }
  return url;
}

function scraper(date, callback) {
  var url = makeURL(date);
  if (url === "" ) {
    callback([]);
    return;
  }
  phantom.create(function (ph) {
    ph.createPage(function (page) {
      page.open(url, function (status) {
        page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js", function() {
          // setTimeout(function() {
            page.evaluate(
              // this function should not return a dom object cause it's going to be very time consuming
              function() {
                var rows = $('.infoBorder').parent().children('tr:nth-of-type(4n+2)');
                var results = [];
                for(var i = 0; i < rows.length; ++i) {
                  var s1_url = $(rows[i]).find('a').attr('href').match(/\'(.*?)\'/g)[0];
                  s1_url = s1_url.substring(1, s1_url.length - 1);
                  results.push({
                    date:$(rows[i]).find("i.blue").html(),
                    name:$(rows[i]).find('a').html().substr(8).trim(),
                    url: s1_url
                  });
                }
                return results;
              },
              function(results) {
                callback(results);
                ph.exit();
              }
            );
          // },
          // 1000);
        });

      });
    });
  });
}

module.exports.scrapeS1 = scraper;
