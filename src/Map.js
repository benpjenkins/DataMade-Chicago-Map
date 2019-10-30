import React, { useState, useEffect } from 'react';
import ReactMapGL, {Marker} from 'react-map-gl';
import styled from 'styled-components'
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';

const defaultViewPort = {
  width: 600,
  height: 600,
  latitude: 41.847,
  longitude: -87.639,
  zoom: 10
}

const Container = styled.div`
  margin: auto;
  width: 40%;
`

const Map = () => {
  const [viewPort, setViewPort] = useState(defaultViewPort)
  const [landLords, setLandLords] = useState([])
  const [buildings, setBuildings] = useState([]);
  const [loaded,  setLoaded] = useState(false);
  const [landLordsAreVisible, toggleLandLordsAreVisible]  = useState(false);
  const [buildingsAreVisible, toggleBuildingsAreVisible] = useState(false);


  const fetchLandLords = async () =>  {
    const { data } = await axios.get('https://data.cityofchicago.org/resource/n5zj-r44u.json', {
      params: {
        "$$app_token" : "en14hP97bjWK3ZfCd5cIe7sRP"
    }})
    setLandLords(data);
  }
  const fetchBuildings = async() => {
    let { data } = await axios.get('https://data.cityofchicago.org/resource/          22u3-xenr.json', {
    params: {
      "$$app_token" : "en14hP97bjWK3ZfCd5cIe7sRP",
    }})
    if (data.length > 25) data = data.slice(0,25)
    setBuildings(data)
  }

  const makeInitials = (name) => {
    return name.split(' ').map(name => name[0]).join('.')
  }

  useEffect(()  => {
    fetchLandLords();
    fetchBuildings();
    setLoaded(true)
  }, [])

  return (
    <Container>
      <ReactMapGL
        width={viewPort.width}
        height={viewPort.height}
        latitude={viewPort.latitude}
        longitude={viewPort.longitude}
        zoom={viewPort.zoom}
        onViewportChange={(viewport) => {
          setViewPort(viewport)
        }}
        mapStyle="mapbox://styles/mapbox/light-v9"
        scrollZoom={'wheel'}
        mapboxApiAccessToken={'pk.eyJ1IjoiYmVuamVua2luc2RldiIsImEiOiJjanhham5hbDUxNzdjM3pxYmpwb21jZGw5In0.rwNJu7SgFpQL3RBdJpJSnw'}
        >
        {landLordsAreVisible && loaded ? landLords.map((landlord, index) => {
          return (
            <Marker key={index}  latitude={Number(landlord.latitude)} longitude={Number(landlord.longitude)} offsetLeft={-20} offsetTop={-10}><div>{makeInitials(landlord.respondent)}</div></Marker>
          )
        }): <div></div>}
        {buildingsAreVisible && loaded ? buildings.map((building, index) => {
          return (
            <Marker key={index}  latitude={Number(building.latitude)} longitude={Number(building.longitude)}>
              <div>{building.violation_description}</div>
            </Marker>
          )
        }) : <div></div>}
        </ReactMapGL>
      <button type='button' onClick={() => toggleLandLordsAreVisible(!landLordsAreVisible)}>Toggle Problematic Landlords</button>
      <button type='button' onClick={() => toggleBuildingsAreVisible(!buildingsAreVisible)}>Building Violations</button>
    </Container>
  )
}

export default Map
