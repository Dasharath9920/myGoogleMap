import React, {useState, useEffect } from 'react'
import actionTypes from '../../../../reducer/actionTypes';
import {useSelector, useDispatch} from 'react-redux';
import PlaceIcon from '@mui/icons-material/Place';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import MapIcon from '@mui/icons-material/Map';
import DirectionsIcon from '@mui/icons-material/Directions';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Alert, LinearProgress, Stepper, Step, StepLabel } from '@mui/material';

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
  const [showStepper, setShowStepper] = useState(false);
  const [showEndRoute, setShowEndRoute] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [alertVariant, setAlertVariant] = useState('filled');


  let stops = [...myState.stops], steps = 1;
  var timer = 0;

  const hash = (i,j) => {
    return 2001*(i+1000)+(j+1000);
  }

  const showToast = (message, type, variant, duration = 0) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVariant(variant);

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

  const isAStop = (row, col) => {
    let currentStop = getCityFromCityName(myState.stops[steps-1]);
    if(currentStop?.r === row && currentStop?.c === col){
        ++steps;
        setActiveStep(steps);
    }
  }

  const isCityValid = (cityName) => {
    let city;
    try{
        city = Number(cityName);

        if(!city || cityName.length === 0 || city > myState.maxCities){
            throw new Error();
        }
    } catch(e){
        city = undefined;
    };

    return city;
  }

  const changeSourceOrDestination = (city, stopType,cities = myState.cities) => {
      let cityName = isCityValid(city) || '';
      let src = source,dest = destination;

      if(cityName || city.length === 0){
          if(stopType === 'source'){
              if(source){
                let sourceCity = getCityFromCityName(source,cities);
                document.getElementById(hash(sourceCity.r, sourceCity.c)).style.backgroundColor = 'yellow';
              }
              src = cityName;
              setSource(cityName);
          }
          else if(stopType === 'destination'){
            if(destination){
                let destinationCity = getCityFromCityName(destination,cities);
                document.getElementById(hash(destinationCity.r, destinationCity.c)).style.backgroundColor = 'yellow';
              }
              dest = cityName;
              setDestination(cityName);
          }
        }

        if(src){
          let sourceCity = getCityFromCityName(src,cities);
          document.getElementById(hash(sourceCity.r, sourceCity.c)).style.backgroundColor = 'green';
        }
        if(dest){
          let destinationCity = getCityFromCityName(dest,cities);
          document.getElementById(hash(destinationCity.r, destinationCity.c)).style.backgroundColor = 'red';
        }
  }

  const generateCities = () => {
    if(playNavigation)
        return;

    setShowStepper(false);
    setDisableNavigation(true);
    setDisableDirection(false);
    setShowEndRoute(false);
    setAlertMessage('');
    setActiveStep(1);

    steps = 1;
    document.getElementById('navigation-icon').style.display = 'none';

    let uniqueCities = new Set()
    let citiesGenerated = [], n = myState.mapSize.n, m = myState.mapSize.m;
    while(uniqueCities.size < myState.maxCities){
        let xRatio = (myState.maxCities > 30 || myState.maxCities < 16)? 5: 4;
        let yRatio = myState.maxCities/xRatio

        let r = Math.floor(Math.floor((uniqueCities.size/yRatio)*(n/xRatio)) + Math.floor(Math.random()*Math.floor(n/xRatio)));
        let c = Math.floor((uniqueCities.size%yRatio)*(m/yRatio) + Math.floor(Math.random()*Math.floor(m/yRatio)));
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

        if(src === dest){
            showToast('Source and Destination should be different','warning','filled',4);
            return;
        }

        setPlayNavigation(true);
        setDisableDirection(true);
        setShowLoader(true);
        showToast('Finding the best route for you. Please wait','info','filled');
        
        let stops = myState.stops.filter(stop => stop !== src && stop !== dest);
        dispatch({
            type: actionTypes.UPDATE_STOPS,
            stops: stops
        })

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
        showToast('Invalid cities. Please choose cities from the map','warning','filled',4);
        setSource('');
        setDestination('');
    }
  }

  const startNavigation = () => {
    if(disableNavigation)
        return;
    
    setDisableNavigation(true);
    setPlayNavigation(true);
    setShowStepper(true);
    setShowEndRoute(false);
    showToast(' ','warning','filled');

    let count = 0,oldRow = source.r,oldCol = source.c;
    myState.path.forEach((city) => {
        setTimeout(() => {
            let transforms = `translate(${city.c*16 - 3}px, ${city.r*16 - 8}px) rotate(${rotate(oldRow,oldCol,city.r,city.c)}deg)`;
            document.getElementById('navigation-icon').style.transform = transforms;
            oldRow = city.r;
            oldCol = city.c;
            if(isACityWithCoordinates(city.r, city.c) && isAStop(city.r, city.c));
            setTimeout(() => {
                document.getElementById(hash(city.r, city.c)).style.backgroundColor = isACityWithCoordinates(city.r,city.c)? 'yellow': 'rgb(95, 165, 231)';
            },100);
        },count*150);
        count++;
      });

    setTimeout(() => {
        setPlayNavigation(false);
        setShowEndRoute(true);
        ++steps;
        setActiveStep(steps);
    },count*150);
  }

  const addStop = () => {
      if(disableDirection)
        return;

      try{
        let maxCitiesAllowed = myState.maxCities < 20? 4: 10;
        if(stops.length === maxCitiesAllowed){
            throw new Error(`Maximum ${maxCitiesAllowed} stops are allowed`);
        }

        let stopPoint = Number(stop);
        if(!stopPoint || stop.length === 0 || stop > 40){
            throw new Error('Invalid stop. Please choose cities from the map');
        }

        if(stops.some(currentStop => currentStop === stopPoint) || (source && stopPoint === Number(source)) || (destination && stopPoint === Number(destination))){
            throw new Error('Stop already exist');
        }

        showToast('Stop added successfully','success','filled',1);
        stops.push(stopPoint);
        dispatch({
            type: actionTypes.UPDATE_STOPS,
            stops: stops
        })
        setStop('');
    }catch(e){
        showToast(e.message,'warning','filled',4);
    }
  }

  const resetStops = () => {
    if(disableDirection)
        return;
        
    if(stops.length === 0)
        showToast('Stops are already Empty','warning','filled',2);
    else{
        showToast('Stops removed successfully','success','filled',2);
        dispatch({
            type: actionTypes.UPDATE_STOPS,
            stops: []
        })
    }
  }

  const endRoute = () => {

    if(!showEndRoute)
        return;

    setShowStepper(false);
    setDisableNavigation(true);
    setDisableDirection(false);
    setAlertMessage('');
    setSource('');
    setDestination('');
    setActiveStep(1);
    setShowEndRoute(false);

    steps = 1;
    document.getElementById('navigation-icon').style.display = 'none';

    myState.path.forEach(city => {
        if(!isACityWithCoordinates(city.r, city.c))
            document.getElementById(hash(city.r, city.c)).style.backgroundColor = 'lightgrey';
    })

    let sourceCity = getCityFromCityName(source);
    document.getElementById(hash(sourceCity.r, sourceCity.c)).style.backgroundColor = 'yellow';
    let destinationCity = getCityFromCityName(destination);
    document.getElementById(hash(destinationCity.r, destinationCity.c)).style.backgroundColor = 'yellow';

    dispatch({
        type: actionTypes.UPDATE_SHORTESTPATH,
        path: []
    })

    dispatch({
        type: actionTypes.UPDATE_STOPS,
        stops: []
    })

    dispatch({
        type: actionTypes.UPDATE_SOURCE,
        source: 0
    });
    
    dispatch({
        type: actionTypes.UPDATE_DESTINATION,
        destination: 0
    });
  }

  useEffect(() => {
    generateCities();
  },[myState.mapSize])

  useEffect(() => {
    setShowLoader(false);
    setPlayNavigation(false);
    if(myState.path.length === 0){
        setDisableNavigation(true);
        setAlertMessage('');
    }
    else{
        setDisableNavigation(false);
        setAlertMessage('');
        setShowEndRoute(true);
        let sourceCity = getCityFromCityName(source);
        document.getElementById('navigation-icon').style.display = 'block';
        document.getElementById('navigation-icon').style.transform = `translate(${sourceCity.c*16 - 3}px, ${sourceCity.r*16 - 8}px)`;
    }
  },[myState.path]);

  return (
    <div className='sidebar'>
        <div className="location_block">
            <div className="locations_container">
                <div className="locations"> 
                    <div className="location">
                        <PlaceIcon className='source-icon'/>
                        <div  className='location-search'>
                            <input type="text" placeholder={myState.maxCities < 20? 'Source': 'Choose starting point'} value={source} onChange={(e) => changeSourceOrDestination(e.target.value,'source')}/>
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
                            <input type="text" placeholder={myState.maxCities < 20? 'Destination': 'Choose destination'} value={destination} onChange={(e) => changeSourceOrDestination(e.target.value,'destination')}/>
                        </div>
                    </div>
                </div>
                <button className={`swap-button ${disableDirection && 'disable-direction-button'}`} onClick={swapLocations}><SwapVertIcon className='swap-icon'/></button>
            </div>

        </div>
        <div className="parent-stops-container">
            <div className="stops-container">
                <div className="stops-input">
                    <input type="text" placeholder='add stop' value={stop} onChange={e => setStop(e.target.value)}/>
                </div>
                <button className={`button stop-button ${disableDirection && 'disable-button'}`} onClick={addStop}>Add</button>
                <button className={`button stop-button ${disableDirection && 'disable-button'}`} onClick={resetStops}>Clear</button>
            </div>

            <div className="location">
                <MapIcon className='location-icon'/>
                <button className={`direction-button ${disableDirection && 'disable-direction-button'}`} onClick={getDirections}>Get Directions</button>
            </div>
        </div>
        
        <div className="parent-button-group">
            <button className={`button navigation-button ${disableNavigation && 'disable-button'}`} onClick={startNavigation}><DirectionsIcon className='location-icon'/> Start Navigation</button>
            <div className="button-group">
                <button className={`button ${!showEndRoute && 'disable-button'}`} onClick={endRoute}>{myState.maxCities < 20? 'Reset': 'Reset Map'}</button>
                <button className={`button ${playNavigation && 'disable-button'}`} onClick={generateCities}>New Map</button>
            </div>
        </div>

        <div className="alert-block">
            {alertMessage.length > 0 && 
                <Alert 
                    variant={alertVariant}
                    severity={alertType}
                    icon={false}>
                    {alertMessage} {showLoader && <LinearProgress className='loading'/>}

                    {showStepper && 
                        <Stepper activeStep={activeStep}>
                            {[source,...myState.stops,destination].map((label, index) => {
                                const stepProps = {};
                                const labelProps = {};
                                return (
                                    <Step key={label} {...stepProps} className='step'>
                                        <StepLabel {...labelProps}><strong>{label}</strong></StepLabel>
                                    </Step>
                                    );
                                }
                            )}
                        </Stepper>
                    }
                </Alert>}
        </div>
    </div>
  )
}

export default Sidebar