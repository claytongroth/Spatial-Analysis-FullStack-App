import React, { Component } from 'react'
import { Map, AttributionControl, Marker, TileLayer, GeoJSON, Circle, Popup, FeatureGroup, CircleMarker, Polygon, LayersControl } from 'react-leaflet';
import * as turf from '@turf/turf'
const GGeoJSON = require('geojson')
const position = [42.857458,-89.656543] //-89.656543, 42.857458 //44.2088619, -89.4790088
const zoom = 6;


export default class MyMap extends React.Component{
  done = () => {
    this.props.done();
  }
  notDone = () => {
    this.props.notDone();
  }
  getWellGeoJson(){
      const geoJ = {
                    "type": "FeatureCollection",
                    "features": [this.props.well]
                  }
      return geoJ.features[0].map(
              x=> {
                //console.log(x)
                return <CircleMarker
                  key={x._id}
                  center={x.geometry.coordinates.reverse()}
                  radius= {.5}
                  color= '#5FCDB3'
                  opactiy= {.5}
                  radius={.5}
                  attribution={x.properties}
                  >
                  <Popup>Well Nitrate Value: {x.properties.nitr_ran}</Popup>
                  </CircleMarker>
              })//<GeoJSON data={geoJ} style ={this.style()}/>
  }
  getTractsGeoJson(){
      const geoJ = {
                    "type": "FeatureCollection",
                    "features": [this.props.tracts]
                  }
      return geoJ.features[0].map(
              x=> {
                //console.log(x)
                return <Polygon
                  key={x._id}
                  positions={x.geometry.coordinates[0].map(x => {return [x[1],x[0]]})}
                  fillColor= "#FB0F58"
                  color= "#FFB6C1"
                  opacity= {.5}
                  weight= {1}
                  attribution={x.properties}
                  >
                  <Popup>Nitrate Value: {x.properties.nitrate} <br/> Cancer Rate: {x.properties.canrate}</Popup>
                  </Polygon>
              })//<GeoJSON data={geoJ} style ={this.style()}/>
  }
  getCountiesGeoJson(){
      const geoJ = {
                    "type": "FeatureCollection",
                    "features": [this.props.county]
                  }
      return geoJ.features[0].map(
              x=> {
                return <Polygon
                  key={x._id}
                  positions={x.geometry.coordinates[0][0].map(x => {return [x[1],x[0]]})}
                  fillColor= "#F4E9BD"
                  color= "#FFA500"
                  opacity= {.9}
                  weight= {1}
                  attribution={x.properties}
                  >
                  <Popup>Nitrate Value: {x.properties.nitrate} <br/> Cancer Rate: {x.properties.canrate}</Popup>
                  </Polygon>
              })//<GeoJSON data={geoJ} style ={this.style()}/>
  }
  shouldComponentUpdate(state, props){
    if (this.props.interpolate === true && !isNaN(this.props.km)){
      return false
    } else {
      return true
    }
  }
  componentWillMount(){
    this.notDone();
  }
  componentDidMount(){
    //this.done();
  }
  componentWillReceiveProps(){

  }
  render() {
    console.log("Map Rendered", this.props.interpolate && !isNaN(this.props.km))
    return (
      <Map id="map" center={position} zoom={zoom}>
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Dark">
          <TileLayer
            url='https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicHNteXRoMiIsImEiOiJjaXNmNGV0bGcwMG56MnludnhyN3Y5OHN4In0.xsZgj8hsNPzjb91F31-rYA'
            attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay checked ="true" name="Tracts">
          <FeatureGroup>{this.getTractsGeoJson()}</FeatureGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked ="true" name="Wells">
          <FeatureGroup>{this.getWellGeoJson()}</FeatureGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked ="true" name="Counties">
          <FeatureGroup>{this.getCountiesGeoJson()}</FeatureGroup>
        </LayersControl.Overlay>
      </LayersControl >
        <TileLayer
          url='https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicHNteXRoMiIsImEiOiJjaXNmNGV0bGcwMG56MnludnhyN3Y5OHN4In0.xsZgj8hsNPzjb91F31-rYA'
          attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
        />
        {(this.props.interpolate === true && !isNaN(this.props.km))? <FeatureGroup>{this.props.interpolatefunction()}</FeatureGroup> : null}
      </Map>
    )
  }
}
