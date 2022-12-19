import React, {useState, useEffect } from 'react'
import actionTypes from '../../../../reducer/actionTypes';
import {useSelector, useDispatch} from 'react-redux';
import PlaceIcon from '@mui/icons-material/Place';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import MapIcon from '@mui/icons-material/Map';
import DirectionsIcon from '@mui/icons-material/Directions';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function Sidebar() {

  const myState = useSelector(state => state.updateProperties);
  const dispatch = useDispatch();

  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [stop, setStop] = useState('');
  let stops = [...myState.stops];

  let hash = (i,j) => {
    return 2001*(i+1000)+(j+1000);
  }

  const generateCities = () => {
    let uniqueCities = new Set()
    let citiesGenerated = []
    while(uniqueCities.size < 40){
        let r = Math.floor(Math.floor(uniqueCities.size/8)*10 + Math.random()*10);
        let c = Math.floor((uniqueCities.size%8)*11 + Math.random()*13);
        let has = hash(r,c);

        if(!uniqueCities.has(has)){
            uniqueCities.add(has);
            citiesGenerated.push({
                cityName: uniqueCities.size,
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

        if(!src || !dest || source.length === 0 || destination.length === 0 || src > 40 || dest > 40){
            throw new Error();
        }

        dispatch({
            type: actionTypes.UPDATE_SOURCE,
            source: src
        });
        
        dispatch({
            type: actionTypes.UPDATE_DESTINATION,
            destination: dest
        });

        dispatch({
            type: actionTypes.UPDATE_FINDPATH,
            findPath: true
        })
    } catch(e){
        window.alert('Invalid cities. Please choose cities from the map');
        setSource('');
        setDestination('');
    }
  }

  const startNavigation = () => {

  }

  const addStop = () => {
    if(stops.length > 10){
        window.alert('Maximum 10 stops are allowed');
        return;
    }
    try{
        let stopPoint = Number(stop);
        if(!stopPoint || stop.length === 0 || stop > 40){
            throw new Error();
        }

        stops.push(stopPoint);

        dispatch({
            type: actionTypes.UPDATE_STOPS,
            stops: stops
        })

        setStop('');
    }catch(e){
        window.alert('Invalid stop. Please choose cities from the map');
    }
  }

  const resetStops = () => {
    dispatch({
        type: actionTypes.UPDATE_STOPS,
        stops: []
    })
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

                <div className="location more-icon">
                    <MoreVertIcon />
                </div>

                <div className="stops">
                    {stops.length > 0? 
                        stops.map((stop,index) => {
                            return <h4 key={index}>{index? ' , ': ''} {stop}</h4>
                        }):
                        'No Stops'}
                </div>

                <div className="location more-icon">
                    <MoreVertIcon />
                </div>

                <div className="location">
                    <PlaceIcon className='location-icon'/>
                    <div className='location-search'>
                        <input type="text" placeholder='Choose destination' value={destination} onChange={(e) => setDestination(e.target.value)}/>
                    </div>
                </div>

                <div className="stops-container">
                    <div className="stops-input">
                        <input type="text" placeholder='stop point' value={stop} onChange={e => setStop(e.target.value)}/>
                    </div>
                    <button className='button stop-button' onClick={addStop}>Add</button>
                    <button className='button stop-button' onClick={resetStops}>Reset</button>
                </div>

                <div className="location">
                    <MapIcon className='location-icon'/>
                    <button className='button direction-button' onClick={getDirections}>Get Directions</button>
                </div>
                
                <div className="location">
                    <button className='button start-button' onClick={startNavigation}><DirectionsIcon className='location-icon'/> Start Navigation</button>
                </div>
            </div>
            <button id='swap-button' onClick={swapLocations}><SwapVertIcon className='swap-icon'/></button>
        </div>
        <button className='button' onClick={generateCities}>Change Cities</button>
    </div>
  )
}

export default Sidebar