var fs = require('fs'); 
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/polygondb?authSource=admin";
const geoJSONFile = "data/ex1.geojson";


// mongoose connection to MongoDB
mongoose.connect('mongodb://localhost/polygondb', { useNewUrlParser: true }, function (error) {
    if (error) {
        console.log(error);
    }
});

// mongoose Schema definition
var Schema = mongoose.Schema;
var jsonSchema = new Schema({
    type: Schema.Types.Mixed,
    properties: Schema.Types.Mixed,
    geometry: Schema.Types.Mixed,
    isVisible: Schema.Types.Mixed
});
 
// mongoose Model definition
var json = mongoose.model('JString', jsonSchema, 'polygons');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET map page. */
router.get('/map', function(req,res) {
    json.find({},{}, function(err, docs){
      if (err) return handleError(err);
  
      res.render('map', {
        "jmap" : docs,
        lat : 51.49698840879303,
        lng : -0.14007568359375
      });
    });
  }); 

// GET json data of features that are visible 
router.get('/mapjson', function (req, res) {
    json.find({isVisible: true}, {}, function (err, docs) {
      if (err) return handleError(err);
      
      res.json(docs);
    })
  });

// POST new feature to database
router.post('/addFeature', function (req, res) {
    var feature = new json(req.body);

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
    
        var dbo = db.db("polygondb");

        // add isVisible field for this feature
        feature["isVisible"] = true;

        // insert feature to collection
        dbo.collection("polygons").insertOne(feature, function(err, res) {
            if (err) throw err;
            console.log("Feature successfully added to database");
            db.close();
        });
    });
});

// POST change in visibility for a given feature in database
router.post('/hideFeature', function (req, res) {
    var featureGeom = req.body.geometry;
    var f = json.findOneAndUpdate(
        {geometry: featureGeom},
        {isVisible: false},
        function (err, doc) {
            if (err) return handleError(err);
            console.log("Visibility of feature successfully updated in database");
        }
    )
});

module.exports = router;

