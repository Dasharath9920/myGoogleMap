import React, {useState, useEffect } from 'react'
import actionTypes from '../../../../reducer/actionTypes';
import {useSelector, useDispatch} from 'react-redux';
import PlaceIcon from '@mui/icons-material/Place';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import MapIcon from '@mui/icons-material/Map';
import DirectionsIcon from '@mui/icons-material/Directions';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Alert, LinearProgress } from '@mui/material';

function Sidebar() {

  const myState = useSelector(state => state.updateProperties);
  const dispatch = useDispatch();

  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [stop, setStop] = useState('');
  const [playNavigation, setPlayNavigation] = useState(false);
  const [disableNavigation, setDisableNavigation] = useState(true);
  const [disableDirection, setDisableDirection] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');
  const [showLoader, setShowLoader] = useState(false);

  let stops = [...myState.stops];
  var timer = 0;

  const hash = (i,j) => {
    return 2001*(i+1000)+(j+1000);
  }

  const showToast = (message, type, duration = 0) => {
    setAlertMessage(message);
    setAlertType(type);

    if(duration > 0){
        if(timer)
            clearTimeout(timer);

        timer = setTimeout(() => {
            setAlertMessage('');
        },duration*1000);
    }
  }

  const rotate = (oldRow, oldCol, newRow, newCol) => {
    if(oldRow < newRow){
        if(oldCol < newCol)
            return 135;
        return oldCol === newCol ? 180: 225;
    }
    else if(oldRow === newRow){
        if(oldCol === newCol)
            return 0;
        return oldCol < newCol ? 90: 270;
    }
    else{
        if(oldCol < newCol)
            return 45;
        return oldCol === newCol ? 0: 315;
    }
  }

  const isACityWithCoordinates = (row, col) => {
    return myState.cities.some(city => city.r === row && city.c === col);
  }

  const getCityFromCityName = (cityName,cities = myState.cities) => {
    return cities.find(currentCity => currentCity.cityName === cityName);
  }

  const isCityValid = (cityName) => {
    let city;
    try{
        city = Number(cityName);

        if(!city || cityName.length === 0 || city > 40){
            throw new Error();
        }
    } catch(e){
        city = undefined;
    };

    return city;
  }

  const changeSourceOrDestination = (city, stopType,cities = myState.cities) => {
      let cityName = isCityValid(city) || '';
      
      if(cityName || city.length === 0){
          let city = getCityFromCityName(cityName,cities);

          if(stopType === 'source'){
              if(source){
                let sourceCity = getCityFromCityName(source,cities);
                document.getElementById(hash(sourceCity.r, sourceCity.c)).style.backgroundColor = 'yellow';
              }
              setSource(cityName);
              if(city)
                document.getElementById(hash(city.r, city.c)).style.backgroundColor = 'green';
          }
          else if(stopType === 'destination'){
            if(destination){
                let destinationCity = getCityFromCityName(destination,cities);
                document.getElementById(hash(destinationCity.r, destinationCity.c)).style.backgroundColor = 'yellow';
              }
              setDestination(cityName);
              if(city)
                document.getElementById(hash(city.r, city.c)).style.backgroundColor = 'red';
          }
      }
  }

  const generateCities = () => {
    if(playNavigation)
        return;

    setDisableNavigation(true);
    setDisableDirection(false);
    document.getElementById('navigation-icon').style.display = 'none';

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

    setTimeout((cities = citiesGenerated) => {
        changeSourceOrDestination(source,'source',cities);
        changeSourceOrDestination(destination,'destination',cities);
    })
  }

  const swapLocations = () => {
    if(disableDirection)
        return;

    let src = isCityValid(source);
    let dest = isCityValid(destination);

    if(src){
        let sourceCity = getCityFromCityName(src);
        document.getElementById(hash(sourceCity.r, sourceCity.c)).style.backgroundColor = 'red';
    }
    if(dest){
        let destinationCity = getCityFromCityName(dest);
        document.getElementById(hash(destinationCity.r, destinationCity.c)).style.backgroundColor = 'green';
    }

    let previousSource = source;
    setSource(destination);
    setDestination(previousSource);

  }
  
  const getDirections = () => {
    if(disableDirection)
        return;

    let src = isCityValid(source), dest = isCityValid(destination);
    if(src && dest){
        if(playNavigation)
            return;

        setPlayNavigation(true);
        setDisableDirection(true);
        setShowLoader(true);
        showToast('Finding the best route for you. Please wait','info');

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
    }
    else{
        showToast('Invalid cities. Please choose cities from the map','warning',4);
        setSource('');
        setDestination('');
    }
  }

  const startNavigation = () => {
    if(disableNavigation)
        return;
    
    setDisableNavigation(true);
    setPlayNavigation(true);

    let count = 0,oldRow = source.r,oldCol = source.c;
    myState.path.forEach(city => {
        setTimeout(() => {

            let transforms = `translate(${city.c*16 + 7}px, ${city.r*16 + 7}px) rotate(${rotate(oldRow,oldCol,city.r,city.c)}deg)`;
            document.getElementById('navigation-icon').style.transform = transforms;

            oldRow = city.r;
            oldCol = city.c;
            setTimeout(() => {
                document.getElementById(hash(city.r, city.c)).style.backgroundColor = isACityWithCoordinates(city.r,city.c)? 'yellow': 'skyblue';
            },100);
        },count*150);
        count++;
      });

    setTimeout(() => {
        setPlayNavigation(false);
    },count*150);
  }

  const addStop = () => {
      if(disableDirection)
        return;

      try{
        if(stops.length > 10){
            throw new Error('Maximum 10 stops are allowed');
        }

        let stopPoint = Number(stop);
        if(!stopPoint || stop.length === 0 || stop > 40){
            throw new Error('Invalid stop. Please choose cities from the map');
        }

        if(stops.some(currentStop => currentStop === stopPoint) || (source && stopPoint === Number(source)) || (destination && stopPoint === Number(destination))){
            throw new Error('Stop already exist');
        }

        showToast('Stop added successfully','success',3);
        stops.push(stopPoint);
        dispatch({
            type: actionTypes.UPDATE_STOPS,
            stops: stops
        })
        setStop('');
    }catch(e){
        showToast(e.message,'warning',4);
    }
  }

  const resetStops = () => {
    if(disableDirection)
        return;
        
    if(stops.length === 0)
        showToast('Stops are already Empty','warning',4);
    else{
        showToast('Stops removed successfully','success',3);
        dispatch({
            type: actionTypes.UPDATE_STOPS,
            stops: []
        })
    }
  }

  useEffect(() => {
    generateCities();
  },[])

  useEffect(() => {
    setShowLoader(false);
    if(myState.path.length === 0){
        setDisableNavigation(true);
        setPlayNavigation(false);
        setAlertMessage('');
    }
    else{
        setDisableNavigation(false);
        setPlayNavigation(false);

        showToast('Here is the Shortest path. Click on Start Navigation','success',5);
        let sourceCity = getCityFromCityName(source);
        document.getElementById('navigation-icon').style.display = 'block';
        document.getElementById('navigation-icon').style.transform = `translate(${sourceCity.c*16 + 7}px, ${sourceCity.r*16 + 7}px)`;
    }
  },[myState.path]);

  return (
    <div className='sidebar'>
        <div className="location_block">
            <div className="locations_container">
                <div className="location">
                    <PlaceIcon className='source-icon'/>
                    <div  className='location-search'>
                        <input type="text" placeholder='Choose starting point' value={source} onChange={(e) => changeSourceOrDestination(e.target.value,'source')}/>
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
                    <PlaceIcon className='destination-icon'/>
                    <div className='location-search'>
                        <input type="text" placeholder='Choose destination' value={destination} onChange={(e) => changeSourceOrDestination(e.target.value,'destination')}/>
                    </div>
                </div>

                <div className="stops-container">
                    <div className="stops-input">
                        <input type="text" placeholder='add stop' value={stop} onChange={e => setStop(e.target.value)}/>
                    </div>
                    <button className={`button stop-button ${disableDirection && 'disable-button'}`} onClick={addStop}>Add</button>
                    <button className={`button stop-button ${disableDirection && 'disable-button'}`} onClick={resetStops}>Reset</button>
                </div>

                <div className="location">
                    <MapIcon className='location-icon'/>
                    <button className={`direction-button ${disableDirection && 'disable-direction-button'}`} onClick={getDirections}>Get Directions</button>
                </div>
            </div>
            <button id='swap-button' className={`${disableDirection && 'disable-direction-button'}`} onClick={swapLocations}><SwapVertIcon className='swap-icon'/></button>
        </div>
        
        <button className={`button start-button ${disableNavigation && 'disable-button'}`} onClick={startNavigation}><DirectionsIcon className='location-icon'/> Start Navigation</button>
        <button className={`button start-button ${playNavigation && 'disable-button'}`} onClick={generateCities}>New Map</button>

        <div className="alert-block">
            {alertMessage.length > 0 && 
                <Alert 
                    variant='filled' 
                    severity={alertType}>
                    {alertMessage} {showLoader && <LinearProgress className='loading'/>}
                </Alert>}
        </div>
    </div>
  )
}

export default Sidebar