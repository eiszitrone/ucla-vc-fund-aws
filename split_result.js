var fs = require("fs")

//result.txt is the top 500 of the sorted result, result1.txt is the top 500 of the unsorted result, result2.txt is the combination
var file = './result/id_all.txt';


function split(file) {
  var data = fs.readFileSync(file).toString();
  var results = data.split(',');
  results.pop();
  results_set = new Set(results);
  results = [];
  for (var id of results_set) {
    results.push(id);
  }

  var part1 = results.slice(0, 500).join(',');
  console.log(part1);
  fs.writeFile('./result/part1.txt', part1);

  var part2 = results.slice(500, 1000).join(',');
  console.log(part2);
  fs.writeFile('./result/part2.txt', part2);

  var part3 = results.slice(1000, results.length).join(',');
  console.log(part3);
  fs.writeFile('./result/part3.txt', part3);
}

split(file);
