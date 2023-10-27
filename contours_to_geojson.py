import geopandas as gpd

# Load the shapefile using geopandas
shapefile = gpd.read_file('path/to/your/shapefile.shp')

# Convert the shapefile to GeoJSON
geojson = shapefile.to_crs('EPSG:4326').to_json()

# Write the GeoJSON data to a file
with open('path/to/your/output.geojson', 'w') as f:
    f.write(geojson)