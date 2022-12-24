import React, { useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import actionTypes from '../../../../reducer/actionTypes';
import NavigationIcon from '@mui/icons-material/Navigation';

function Map() {

  const myState = useSelector(state => state.updateProperties);
  const dispatch = useDispatch();

  const grid = [...myState.map];

  // Use (-1,-1) twice just to populate with dense roads
  const x_dir = [-1,0,0,1,-1,-1,1,1];
  const y_dir = [0,-1,1,0,-1,-1,-1,1];

  const hash = (i,j) => {
    return 2001*(i+1000)+(j+1000);
  }

  const resetCities = () => {
    for(let i = 0; i < myState.mapSize.n; i++){
      for(let j = 0; j < myState.mapSize.m; j++){
        let key = hash(i,j);
        let cell = document.getElementById(key);
        if(cell){
          cell.innerText = '';
          cell.style.backgroundColor = 'white';
        }
      }
    }
  }

  // Color cities
  const constructCities = () => {
   myState.cities.forEach((block) => {
      let key = hash(block.r, block.c);
      let cell = document.getElementById(key);
      if(cell){
        cell.innerText = block.cityName;
        cell.style.backgroundColor = 'yellow';
        cell.style.color = 'black';
      }
    })
  }

  const getRandomCity = () => {
    let randomIndex = Math.floor(Math.random()*myState.cities.length);
    return myState.cities[randomIndex];
  }

  const getCityWithCoordinates = (r,c) => {
    return myState.cities.find(city => city.r === r && city.c === c);
  }

  const isSafeToConstruct = (r,c) => {
    return r >= 0 && c >= 0 && r < myState.mapSize.n && c <myState.mapSize.m;
  }

  // Color roads
  const buildRoad = (row, col, parentBlocks, roads, source) => {
    if(getCityWithCoordinates(row,col))
      return;
    let key = hash(row,col);
    while(parentBlocks[key].r !== source.r || parentBlocks[key].c !== source.c){
      let block = document.getElementById(key);
      block.style.backgroundColor = 'lightgrey';

      roads.add(key);
      row = parentBlocks[key].r;
      col = parentBlocks[key].c;
      key = hash(row,col);
    }
    let block = document.getElementById(key);
    block.style.backgroundColor = 'lightgrey';
    roads.add(key);
  }

  // Checks if we have road passing adjacent to current block
  const hasNearByRoad = (roads,row,col,blocksVisited) => {
    for(let k = 0; k < 4; k++){
      let newRow = row + x_dir[k];
      let newCol = col + y_dir[k];
      let hashKey = hash(newRow,newCol);

      if(isSafeToConstruct(newRow,newCol) && !blocksVisited.has(hashKey) && roads.has(hashKey))
        return true;
    }
    return false;
  }

  const connectThreeCitiesTo = (city, connectedCities, roads) => {
    let grid = [];
    let blocksVisited = new Set();
    let parentBlocks = {};

    grid.push({
      r: city.r,
      c: city.c
    });
    blocksVisited.add(hash(city.r, city.c));

    // For each city, connect with maximum 3 other cities
    while(connectedCities[city.cityName].length < 3 && grid.length > 0){
      let currentBlock = grid.shift();

      for(let k = Math.floor(Math.random()*8), count = 0; count < 8; count++, k = (k+1)%8){
        let newRow = currentBlock.r + x_dir[k];
        let newCol = currentBlock.c + y_dir[k];
        let hashKey = hash(newRow,newCol);

        if(isSafeToConstruct(newRow,newCol) && !blocksVisited.has(hashKey) && !hasNearByRoad(roads,newRow,newCol,blocksVisited)){
          parentBlocks[hashKey] = {...currentBlock};
          let reachedCity = getCityWithCoordinates(newRow, newCol);
          if(reachedCity){
            if(!connectedCities[city.cityName].some(currentCity => currentCity === reachedCity.cityName)){
              buildRoad(currentBlock.r, currentBlock.c, parentBlocks, roads,city);
              connectedCities[city.cityName].push(reachedCity.cityName);
            }
          }
          else{
            grid.push({
              r: newRow,
              c: newCol
            });
            blocksVisited.add(hashKey);
          }
        }
      }
    }
  }

  // Construct Roads between cities starting with random city to avoid similar maps
  const constructRoads = () => {
    let city = getRandomCity();
    let roads = new Set();
    let connectedCities = {};
    myState.cities.forEach(currentCity => connectedCities[currentCity.cityName] = []);

    for(let i = 0; i < myState.cities.length; i++){
      connectThreeCitiesTo(city,connectedCities,roads);

      let nextCity = (city.cityName === myState.maxCities)? 1: city.cityName + 1;
      city = myState.cities.find(currentCity => currentCity.cityName === nextCity);
    }

    dispatch({
      type: actionTypes.UPDATE_ROADS,
      roads: roads
    });
  }

  useEffect(() => {
    resetCities();
    constructCities();
    constructRoads();
  },[myState.cities]);

  return (
    <div className='map-container'>
        {grid.map((row,index) => {
            return <div className='map-row' key={index}>
                {row.map(block => {
                    let has = hash(block.r,block.c);
                    return <div className="block" id={has} key={has} style={{transform:`translateX(${block.c*11}px)`}}></div>
                  })
                }
            </div>
        })}
        <NavigationIcon id="navigation-icon"/>
    </div>
  )
}

export default Map