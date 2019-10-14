var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/polygondb?authSource=admin";

// Mongoose import
var mongoose = require('mongoose');

// Mongoose connection to MongoDB
mongoose.connect('mongodb://localhost/polygondb', { useNewUrlParser: true }, function (error) {
    if (error) {
        console.log(error);
    }
});

// Mongoose Schema definition
var Schema = mongoose.Schema;
var JsonSchema = new Schema({
    name: String,
    type: Schema.Types.Mixed
});
 
// Mongoose Model definition
var json = mongoose.model('JString', JsonSchema, 'polygons');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET json data of features that are visible 
router.get('/mapjson', function (req, res) {
    json.find({isVisible: true}, {}, function (err, docs) {
      if (err) return handleError(err);
      
      res.json(docs);
    })
  });

// POST new feature json to database
router.post('/addFeature', function (req, res) {
    var feature = new json(req.body);
    console.log(feature);

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
    
        var dbo = db.db("polygondb");

        // add isVisible field for this feature
        feature["isVisible"] = true;

        // insert feature to collection
        dbo.collection("polygons").insertOne(feature, function(err, res) {
            if (err) throw err;
            console.log("Feature successfully added");
            db.close();
        });
    });
});

/* GET layers json data. */
// router.get('/maplayers', function (req, res) {
//     Json.find({},{'name': 1}, function (err, docs) {
//         res.json(docs);
//     });
// });

/* GET Map page. */
router.get('/map', function(req,res) {
    json.find({},{}, function(err, docs){
      if (err) return handleError(err);
  
      res.render('map', {
        "jmap" : docs,
        // lng : docs[0]['geometry']['coordinates'][0][0][0],
        // lat : docs[0]['geometry']['coordinates'][0][0][1]
        lat : 51.49698840879303,
        lng : -0.14007568359375
      });
    });
  }); 

module.exports = router;
