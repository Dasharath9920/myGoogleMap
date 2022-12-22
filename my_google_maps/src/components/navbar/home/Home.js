import React, { useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import Sidebar from './sidebar/sidebar';
import Map from './map/map';
import PathFinder from './pathFinder';
import actionTypes from '../../../reducer/actionTypes';

function Home() {
  const myState = useSelector(state => state.updateProperties);
  const dispatch = useDispatch();

  var n = myState.mapSize.n, m = myState.mapSize.m, maxCities = myState.maxCities;

  const generateMap = () => {
    let grid = [];
    for(let i = 0; i < n; i++){
        let temp = [];
        for(let j = 0; j < m; j++){
            temp.push({
                r: i,
                c: j
            })
        }
        grid.push(temp)
    }
  
    dispatch({
      type: actionTypes.UPDATE_MAP,
      map: grid
    })

    dispatch({
      type: actionTypes.UPDATE_MAPSIZE,
      mapSize: {n,m}
    })

    dispatch({
      type: actionTypes.UPDATE_MAXIMUM_CITIES,
      maxCities: maxCities
    })
  }

  const handleWidth = () => {
    if(window.innerWidth > 1700){
      n = 50;
      m = 90;
      maxCities = 40;
    }
    else if(window.innerWidth > 1550){
      n = 45;
      m = 72;
      maxCities = 35;
    }
    else if(window.innerWidth > 1400){
      n = 41;
      m = 63;
      maxCities = 28;
    }
    else if(window.innerWidth > 1220){
      n = 38;
      m = 54;
      maxCities = 24;
    }
    else{
      n = 35;
      m = 50;
      maxCities = 20;
    }

    generateMap();
  }

  useEffect(() => {
    handleWidth();
    window.addEventListener('resize',handleWidth);
    return () => window.removeEventListener('resize',handleWidth);
  },[])

  return (
    <div className='home'>
        <Sidebar />
        <Map />
        <PathFinder />
    </div>
  )
}

export default Home