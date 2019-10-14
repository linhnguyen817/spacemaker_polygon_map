# spacemaker_polygon_map
####A Leaflet map with Node.js and MongoDB supporting polygon unions and intersections

#####To Run:
1. Install dependencies:
    $ npm install

2. Run the app:
    $ DEBUG=polygon-map:* npm start

3. Display application in browser by going to: http://localhost:3000/map

**Things I would have implemented if given more time:**
- Dynamic starting center point for map
- Removing map layer artifact (i.e. the original boundary lines) after a union or intersection operation (attempted but commented out)
- Resetting of the database back to the original GeoJSON data file at every reload
- A UI for inputting which GeoJSON data file to use as the default, initial file