import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import actionTypes from '../../../reducer/actionTypes';

function PathFinder() {

  const myState = useSelector(state => state.updateProperties);
  const dispatch = useDispatch();

  const roads = myState.roads;
  const x_dir = [-1,-1,-1,0,0,1,1,1];
  const y_dir = [-1,0,1,-1,1,-1,0,1];
  let count = 0, path = [],speed = myState.cities.length < 20? 30: 10;
  var timeouts = [];

  // Return unique hash of two values which can be used as an id for each map block
  const hash = (i,j) => {
    return 2001*(i+1000)+(j+1000);
  }

  const getCityFromCityName = (cityName) => {
    return myState.cities.find(currentCity => currentCity.cityName === cityName);
  }

  const source = getCityFromCityName(myState.source);
  const destination = getCityFromCityName(myState.destination);

  const isACityWithCoordinates = (row, col) => {
    return myState.cities.some(city => city.r === row && city.c === col);
  }

  const isSafeToConstruct = (r,c) => {
    return r >= 0 && c >= 0 && r < myState.mapSize.n && c < myState.mapSize.m;
  }

  // Checks whether given coordinates belongs to city or road
  const isRoadOrCity = (r,c) => {
    return roads.has(hash(r,c)) || isACityWithCoordinates(r,c);
  }

  const calculateHeuristicValue = (r,c, destination) => {
    let dx = Math.abs(destination.r - r), dy = Math.abs(destination.c - c);
    let d = Math.sqrt(2);
    return dx + dy + (d-2)*Math.min(dx,dy);
  }

  // Reset color of each block
  const resetSearchedBlocks = () => {
    for(let i = 0; i < myState.mapSize.n; i++){
      for(let j = 0; j < myState.mapSize.m; j++){
        let hashKey = hash(i,j);
        let block = document.getElementById(hashKey);
        if(block.style.backgroundColor === 'grey')
          block.style.backgroundColor = 'lightgrey';
      }
    }
  }

  // It build path from source to destination and append it to final path
  const buildPath = (parentBlocks, source, destination) => {
    let currentPath = [];
    let row = destination.r, col = destination.c;
    do{
        let hashKey = hash(row,col);
        let parentBlock = parentBlocks[hashKey];

        currentPath.push({r: row, c: col});
        row = parentBlock.r;
        col = parentBlock.c;

    }while(row !== source.r || col !== source.c);

    currentPath.push(...path);
    path = [...currentPath];
  }

  // A* algorithm to find shortest distance between source and destination
  const findPath =  (sourceCity, destinationCity) => {
    let source = getCityFromCityName(sourceCity);
    let destination = getCityFromCityName(destinationCity);
    let blocks = [];
    let cost = {}, parentBlocks = {};
    
    // Initially store cost of each city as Infinity
    for(let i = 0; i < myState.mapSize.n; i++){
      for(let j = 0; j < myState.mapSize.m; j++){
        let hashKey = hash(i,j);
        cost[hashKey] = Number.MAX_VALUE;
      }
    }
    
    blocks.push({
      g: 0,
      f: 0,
      r: source.r,
      c: source.c
    });

    while(blocks.length > 0){
      let currentBlock = blocks.shift();
      
      for(let k = 0; k < 8; k++){
        let newRow = currentBlock.r + x_dir[k];
        let newCol = currentBlock.c + y_dir[k];
        let hashKey = hash(newRow, newCol);
        
        // Store only those blocks which are either cities or roads
        if(isSafeToConstruct(newRow, newCol) && isRoadOrCity(newRow, newCol)){

          if(!isACityWithCoordinates(newRow, newCol)){
            timeouts.push(setTimeout(() => {
              document.getElementById(hashKey).style.backgroundColor = 'blue';
              setTimeout(() => {
                  document.getElementById(hashKey).style.backgroundColor = 'grey';
                },100);
              },count*speed));
            count++;
          }

          // Once destination is reached, build path and add to final path
          if(isACityWithCoordinates(newRow, newCol)){
            if(newRow === destination.r && newCol === destination.c){
              parentBlocks[hashKey] = {r: currentBlock.r, c: currentBlock.c};
              buildPath(parentBlocks,source, destination);
              return true;
            }
          }

          let newG = currentBlock.g + 1;
          let h = calculateHeuristicValue(newRow, newCol, destination);
          let newF = newG + h;

          if(cost[hashKey] > newF){
            cost[hashKey] = newF;
            parentBlocks[hashKey] = {r: currentBlock.r, c: currentBlock.c};
            blocks.push({
                g: newG,
                f: newF,
                r: newRow,
                c: newCol
            });
            blocks.sort(function(x, y) {
              if (x.f < y.f) {
                return -1;
              }
              if (x.f > y.f) {
                return 1;
              }
              return 0;
            });
          }
        }
      }
    }

    // If it reaches here, it means no path found between source and destination
    setTimeout(() => {
      dispatch({
        type: actionTypes.UPDATE_SHORTESTPATH,
        path: []
      });

      window.alert("Sorry. Destination can't be reached");
    },count*speed+100);

    return false;
  }

  const findShortestPath = async () => {

    // Add source and destination to the stops list
    let stops = [...myState.stops];
    stops.unshift(myState.source);
    stops.push(myState.destination);

    // Find path between every two adjacent stops
    let stopIndex = 1;
    for(; stopIndex < stops.length && findPath(stops[stopIndex-1],stops[stopIndex]); stopIndex++);

    // If no path found to any stop, return
    if(stopIndex < stops.length)
      return;

    path.reverse();

    // Color path and update path in Redux
    setTimeout(() => {
      resetSearchedBlocks();
      path.forEach(city => {
        if(!isACityWithCoordinates(city.r, city.c)){
          document.getElementById(hash(city.r, city.c)).style.backgroundColor = 'rgb(102, 187, 140)';
        }
      });
        
      dispatch({
        type: actionTypes.UPDATE_SHORTESTPATH,
        path: path
      })
    },count*speed + 100);  
  }

  useEffect(() => {
    if(myState.findPath){
      findShortestPath();

      dispatch({
          type: actionTypes.UPDATE_FINDPATH,
          findPath: false
      })
    }
  },[myState.findPath])

  return (
    <div></div>
  )
}

export default PathFinder;