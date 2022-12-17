import React, {useState, useEffect } from 'react'
import actionTypes from '../../../../reducer/actionTypes';
import {useSelector, useDispatch} from 'react-redux';
import PlaceIcon from '@mui/icons-material/Place';
import SwapVertIcon from '@mui/icons-material/SwapVert';

function Sidebar() {

  const myState = useSelector(state => state.updateProperties);
  const dispatch = useDispatch();

  const [source, setSource] = useState(myState.source);
  const [destination, setDestination] = useState(myState.destination);

  let hash = (i,j) => {
    return 2001*(i+1000)+(j+1000);
  }

  const generateCities = (numberOfCities) => {
    let uniqueCities = new Set()
    let citiesGenerated = []
    while(uniqueCities.size < numberOfCities){
        let r = Math.round(Math.random()*50);
        let c = Math.round(Math.random()*100);
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

  const getDirections = () => {
    dispatch({
        type: actionTypes.UPDATE_SOURCE,
        source: source
    });

    dispatch({
        type: actionTypes.UPDATE_DESTINATION,
        destination: destination
    });
  }

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
            </div>
            <button className='swap-button'><SwapVertIcon className='swap-icon'/></button>
        </div>
        <button className='button' onClick={generateCities(10)}>Change Cities</button>
    </div>
  )
}

export default Sidebar