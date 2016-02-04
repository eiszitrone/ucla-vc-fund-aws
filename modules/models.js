var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/angellist-crawler');
mongoose.connect('mongodb://ec2-52-32-83-104.us-west-2.compute.amazonaws.com/angellist', {user: 'uclaVCfund1', pass: 'uclaVCfund'});
var db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', function (callback) {
   console.log("connection success");
 });

var startupSchema = new mongoose.Schema(
  {
    "id": Number,
    "name": String,
    "created_at": String,
    "angellist_url" : String,
    "logo_url" : String
  }
);

var Startup = mongoose.model('Startup', startupSchema)

module.exports = Startup;
