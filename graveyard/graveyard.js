Geocode.fromAddress(this.props.markerPosition).then(
  response => {
  const { lat, lng } = response.results[0].geometry.location;
  if(this.props.markerPosition != "places here"){
      L.marker([lat, lng], {icon: DefaultIcon}).addTo(Window.map)
      navigator.geolocation.getCurrentPosition((position)=>{
        Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
          response => {
            // add stuff to the map
            //var polygons = .addTo(Window.map);
          },
          error => {
            console.error(error);
          });
      });
  }
},
error => {
  console.error(error);
}
);
\
\


tracts.map(
   x => {
       const coords = x.geometry.coordinates[0].map(x => x.reverse())
       const poly = L.polygon(
         coords,
         { fillColor: "#FB0F58",
           color: "#FFB6C1",
           opacity: .2,
           weight: 1,
         }
       )
       poly.addTo(Window.map)
   }
)
county.map(
  x => {
      const coords = x.geometry.coordinates[0][0].map(x => x.reverse())
      const poly = L.polygon(
        coords,
        { fillColor: "#F4E9BD",
          color: "#FFA500",
          opacity: .2,
          weight: 1,
        }
      )
      poly.addTo(Window.map)
  }
)
wells.map(x => L.circleMarker(
                  [x.geometry.coordinates[1], x.geometry.coordinates[0]],
                  {   radius: .5,
                      color: '#5FCDB3',
                      opactiy: .5
                  }
                 ).addTo(Window.map)
 )




 // for every polygon in tracts, if it contains a polygon in intResult, add to regression array
 //turf.booleanContains(line, point);
 const tractsFeatures = this.props.tracts;
 const interPolygons = this.makeInterpolation()[1].features
 console.log(interPolygons)
 for(let i=0; i<2 /*tractsFeatures.length*/; i++){
   console.log(i, " Launched")
   const tract = turf.flip(turf.polygon(tractsFeatures[i].geometry.coordinates))
   //console.log(tract)
   for(let j=0; j<interPolygons.length; i++){
     if (turf.booleanContains(tract, turf.flip(turf.polygon(interPolygons[j].geometry.coordinates)))){
       console.log(tract, "contained ", turf.flip(turf.polygon(interPolygons[j].geometry.coordinates)))
     } else {
       console.log("not contained")
     }
   }
 }
