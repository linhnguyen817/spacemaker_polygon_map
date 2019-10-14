var fs = require('fs'); 
var MongoClient = require('mongodb').MongoClient;
var GJV = require("geojson-validation");
var url = "mongodb://localhost:27017/polygondb?authSource=admin";
const geoJSONFile = process.argv.slice(2).toString();

// load GeoJSON input data
var data;
try {
    var jsonString = fs.readFileSync(geoJSONFile);
    data = JSON.parse(jsonString);
}
catch (err) {
    throw new Error("Error parsing GeoJSON: " + err);
}

// validate polygons
if (!GJV.valid(data)) {
    throw new Error("Input polygons did not pass validation");
}

// connect to MongoDB database
MongoClient.connect(url, function(err, db) {
    if (err) throw err;

    var dbo = db.db("polygondb");
    console.log("Database created!");

    // create polygons collection
    dbo.createCollection("polygons", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");

        // add isVisible field for every polygon and initialize to true
        data.features.forEach(element => {
            element["isVisible"] = true;
        });

        // insert polygons to polygons collection
        dbo.collection("polygons").insertMany(data.features, function(err, res) {
            if (err) throw err;
            console.log("# of GeoJSON objects inserted to database: " + data.features.length);
            db.close();
        });
    });
});

