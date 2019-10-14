# spacemaker_polygon_map
### Description:
A Leaflet map with Node.js and MongoDB with polygon union and intersection operations

### To Run:
1. Install dependencies:  
    $ npm install

2. Setup a local MonogoDB database
  1. Install MongoDB (https://docs.mongodb.com/manual/installation/)  
  2. Start the `mongo` shell in a terminal window  
  3. Create a database named `polygondb`  
    `> use polygondb`  
  4. Create a collection named `polygons` within your new `polygondb` database  
    `> db.polygons.insert()`  
  5. In a different terminal window in the project directory, load the GeoJSON data file contents into your `polygons` collection  
    ` $ node loadData.js data/ex1.geojson`

3. Run the app:  
    $ DEBUG=polygon-map:* npm start

4. Display application in browser by going to:  
    http://localhost:3000/map

**Things I would have done if given more time:**  
- Use a dynamic starting center point for map
- Removing map layer artifacts (i.e. the original boundary lines) after a union or intersection operation (I unsuccessfully attempted in the given time, so it is currently commented out)
- Resetting the database back to the original GeoJSON data file at every reload (currently, the original and user-created polygons persist in the database for following sessions)
- A UI for inputting which GeoJSON data file to use as the default, initial file