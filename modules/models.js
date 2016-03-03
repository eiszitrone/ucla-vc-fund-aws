var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/angellist-crawler');
//mongoose.connect('mongodb://ec2-52-32-83-104.us-west-2.compute.amazonaws.com/angellist', {user: 'uclaVCfund1', pass: 'uclaVCfund'});
var db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', function (callback) {
   console.log("connection success");
 });

var startupSchema = new mongoose.Schema(
  {
    "id": Number,
    "name": String,
    "product_desc": String,
    "high_concept": String,
    "company_url": String,
    "crunchbase_url": String,
    "linkedin_url": String,
    "company_size": String,
    "location": [String],
    "markets": [String],
    "created_at": String,
    "angellist_url" : String,
    "logo_url" : String,
    "founders" : [{
      "founderName": String,
      "founderId": Number,
      "founderAngelURL": String,
      "founderBio": String
    }],
    "investors": [{
      "investorName": String,
      "investorId": Number,
      "investorAngelURL": String,
      "investorURL": String
    }]
  }
);

var Startup = mongoose.model('Startup', startupSchema)

module.exports = Startup;
