import React from "react";
import L from "leaflet";
import { Map, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import interpolate from '@turf/interpolate'
import * as turf from '@turf/turf'
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import foodicon from 'leaflet/dist/images/marker-icon-food.png';
import homeicon from 'leaflet/dist/images/marker-icon-home.png';
import Geocode from "react-geocode";
import 'leaflet-easybutton';
import 'leaflet-ajax';
import 'leaflet-easybutton/src/easy-button.css';
import 'font-awesome/css/font-awesome.css'
Geocode.setApiKey("AIzaSyCEsvEY5TsylaZu9oJLxAidDE2gbgpf2_I");

//default icon
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25,41],
    iconAnchor: [12.5 ,41],
    popupAnchor: [0, -41]
});
let wellLayer;
let tractsLayer;
let countyLayer;
let overlays = {};
let LC = L.control.layers();

L.Marker.prototype.options.icon = DefaultIcon;


class Map extends React.Component {
  componentDidMount() {
    //baselayer setup
    var light = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicHNteXRoMiIsImEiOiJjaXNmNGV0bGcwMG56MnludnhyN3Y5OHN4In0.xsZgj8hsNPzjb91F31-rYA', {
			id: 'mapbox.streets',
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
		}),
		dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicHNteXRoMiIsImEiOiJjaXNmNGV0bGcwMG56MnludnhyN3Y5OHN4In0.xsZgj8hsNPzjb91F31-rYA', {
			id: 'mapbox.dark',
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
		}),
		streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicHNteXRoMiIsImEiOiJjaXNmNGV0bGcwMG56MnludnhyN3Y5OHN4In0.xsZgj8hsNPzjb91F31-rYA', {
			id: 'mapbox.streets',
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
		}),
		imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
		});;
	//create the map
  Window.map = L.map('map', {
  		center: [43.073051, -89.401230],
  		zoom: 6,
  		minZoom: 3,
  		maxZoom: 18,
  		layers: [dark]
  	}).on('click', function(e){
    var coord = e.latlng;
    var lat = coord.lat;
    var lng = coord.lng;
    console.log(lat + "," + lng);
  });
	//create basylayers
	const baseLayers = {
		"Light": light,
		"Dark": dark,
		"Streets": streets,
		"Imagery": imagery
	};
	//add the base layers control to the map
	//L.control.layers(baseLayers, overlays).addTo(Window.map);
  //create button to get user location and draw marker on map
  L.easyButton('fa-location-arrow', function(btn, map){
      navigator.geolocation.getCurrentPosition((position)=>{
        Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then( response => {
          const address = response.results[0].formatted_address;
          L.marker([position.coords.latitude, position.coords.longitude],{icon: DefaultIcon}).addTo(Window.map).bindPopup(address);
        },
        error => {
          console.error(error);
        }
      )}
  )}).addTo(Window.map);


 function pointToLayer(feature, latlng) {
		var geojsonMarkerOptions = {
			radius: 13,
			fillColor: "red",
			color: "#000000",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.5
		}
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  }
componentDidUpdate() {
  const wells = this.props.well;
  const tracts = this.props.tracts;
  const county = this.props.county;
   //TODO HANDLE LOADING
   //TODO make these layers. So they can be added/ removed from the map!
   tractsLayer = L.featureGroup(tracts.map(
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
          //poly.addTo(Window.map)
          return poly
      }
   ))
   //tractsLayer.addTo(Window.map)
   countyLayer = L.featureGroup(county.map(
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
         //poly.addTo(Window.map)
         return poly
     }
   ))
   //countyLayer.addTo(Window.map)
   wellLayer = L.featureGroup(wells.map(
      x => {
        const point = L.circleMarker(
         [x.geometry.coordinates[1], x.geometry.coordinates[0]],
         {   radius: .5,
             color: '#5FCDB3',
             opactiy: .5
         })//.addTo(Window.map)
         return point
     }
  ))
  //wellLayer.addTo(Window.map)
  //L.control.layers().addTo(Window.map).addOverlay(wellLayer,"Wells")
    LC = L.control.layers(overlays)

    LC.addOverlay(wellLayer,"Wells")
    LC.addOverlay(tractsLayer,"Tracts")
    LC.addOverlay(countyLayer,"Counties")

    if (wellLayer.length > 0 && tractsLayer.length > 0 && countyLayer.length > 0) {LC.addTo(Window.map)}
  }

  remove(layer){
    console.log("Removing: ", layer)
    Window.map.removeLayer(layer)
  }
  add(layer){
    layer.addTo(Window.map)
  }
  makeInterpolation(){
    const wells = turf.featureCollection(this.props.well)
    console.log("this.props.well HERE: ", this.props.well)
    const options = {gridType: 'hex', property: 'nitr_ran'};
    const grid = turf.interpolate(wells, 20, options);
    console.log(grid)
    grid.features.map(
      x => {
          const coords = x.geometry.coordinates[0].map(x => x.reverse())
          const poly = L.polygon(
            coords,
            { fillColor: "#5FCDB3",
              color: "#ffffff",
              opacity: 1,
              weight: 1,
            }
          )
          poly.addTo(Window.map)
      }
    )
    //grid.addTo(Window.map)
  }

  render() {
    if (this.props.interpolate === true){this.makeInterpolation()}
    //if (this.props.remove != null){this.remove(wellLayer)}
    return <div id="map" />;
  }
  }

export default Map;
