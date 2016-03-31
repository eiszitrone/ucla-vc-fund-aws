var fs = require("fs")

var file = './result/result.txt';
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

var part2 = results.slice(500, results.length).join(',');
console.log(part2);
fs.writeFile('./result/part2.txt', part2);
