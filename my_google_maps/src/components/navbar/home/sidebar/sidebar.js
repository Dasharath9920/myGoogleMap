import React, {useState, useEffect } from 'react'
import actionTypes from '../../../../reducer/actionTypes';
import {useSelector, useDispatch} from 'react-redux';
import PlaceIcon from '@mui/icons-material/Place';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import MapIcon from '@mui/icons-material/Map';

function Sidebar() {

  const myState = useSelector(state => state.updateProperties);
  const dispatch = useDispatch();

  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');

  let hash = (i,j) => {
    return 2001*(i+1000)+(j+1000);
  }

  const generateCities = () => {
    let uniqueCities = new Set()
    let citiesGenerated = []
    while(uniqueCities.size < 15){
        let r = Math.round(Math.floor(uniqueCities.size/4)*15 + Math.random()*16);
        let c = Math.round(Math.floor(uniqueCities.size%5)*20 + Math.random()*20);
        let has = hash(r,c);

        if(!uniqueCities.has(has)){
            uniqueCities.add(has);
            citiesGenerated.push({
                r: r,
                c: c
            })
        }
    }

    dispatch({
        type: actionTypes.UPDATE_CITIES,
        cities: citiesGenerated
    })
  }

  const swapLocations = () => {
    let src = source;
    setSource(destination);
    setDestination(src);
  }
  
  const getDirections = () => {
    try{
        let src = Number(source);
        let dest = Number(destination);
        if(src > 12 || dest > 12){
            throw new Error;
        }
        dispatch({
            type: actionTypes.UPDATE_SOURCE,
            source: src
        });
        
        dispatch({
            type: actionTypes.UPDATE_DESTINATION,
            destination: dest
        });
    } catch(e){
        window.alert('Invalid cities. Please choose cities from the map');
        setSource('');
        setDestination('');
    }
}

  useEffect(() => {
    generateCities();
  },[])

  return (
    <div className='sidebar'>
        <div className="location_block">
            <div className="locations_container">
                <div className="location">
                    <PlaceIcon className='location-icon'/>
                    <div  className='location-search'>
                        <input type="text" placeholder='Choose starting point' value={source} onChange={(e) => setSource(e.target.value)}/>
                    </div>
                </div>
                <div className="location">
                    <PlaceIcon className='location-icon'/>
                    <div className='location-search'>
                        <input type="text" placeholder='Choose destination' value={destination} onChange={(e) => setDestination(e.target.value)}/>
                    </div>
                </div>
                <div className="location">
                    <MapIcon className='location-icon'/>
                    <button className='button direction-button' onClick={getDirections}>Get Directions</button>
                </div>
            </div>
            <button className='swap-button' onClick={swapLocations}><SwapVertIcon className='swap-icon'/></button>
        </div>
        <button className='button' onClick={generateCities}>Change Cities</button>
    </div>
  )
}

export default Sidebar