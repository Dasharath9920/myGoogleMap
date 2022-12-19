import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import actionTypes from '../../../reducer/actionTypes';

function PathFinder() {

  const myState = useSelector(state => state.updateProperties);
  const dispatch = useDispatch();
  const roads = myState.roads;
  const x_dir = [-1,-1,-1,0,0,1,1,1];
  const y_dir = [-1,0,1,-1,1,-1,0,1];
  let count = 0,count2 = 0;

  let hash = (i,j) => {
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
    return r >= 0 && c >= 0 && r < 50 && c < 90;
  }

  const isRoadOrCity = (r,c) => {
    return roads.has(hash(r,c)) || isACityWithCoordinates(r,c);
  }

  const calculateHeuristicValue = (r,c) => {
    let dx = Math.abs(destination.r - r), dy = Math.abs(destination.c - c);
    let d = Math.sqrt(2);
    return dx + dy + (d-2)*Math.min(dx,dy);
  }

  const resetSearchedBlocks = () => {
    for(let i = 0; i < 50; i++){
      for(let j = 0; j < 90; j++){
        let hashKey = hash(i,j);
        let block = document.getElementById(hashKey);
        if(block.style.backgroundColor === 'grey')
          block.style.backgroundColor = 'lightgrey';
      }
    }
  }

  const buildPath = (parentBlocks, source, destination) => {
    let path = [];
    let row = destination.r, col = destination.c;
    do{
        let hashKey = hash(row,col);
        let parentBlock = parentBlocks[hashKey];

        path.push({r: row, c: col});
        row = parentBlock.r;
        col = parentBlock.c;

    }while(row !== source.r || col !== source.c);

    path.shift();
    path.reverse();

    path.forEach(city => {
      setTimeout(() => {
        document.getElementById(hash(city.r, city.c)).style.backgroundColor = isACityWithCoordinates(city.r,city.c)? 'yellow': 'blue';
      },count*20+count2*20);
      count2++;
    });

    setTimeout(() => {
      resetSearchedBlocks();
    },count*20 + count2*20)

    // setTimeout(() => {
    //   window.alert(`Estimated time: ${path.length} sec`);
    // },count*20 + count2*20 + 100)

    // dispatch({
    //     type: actionTypes.UPDATE_SHORTESTPATH,
    //     path: path
    // })
  }

  const findPath =  (sourceCity, destinationCity) => {
    let source = getCityFromCityName(sourceCity);
    let destination = getCityFromCityName(destinationCity);
    let blocks = [];
    let visitedBlocks = new Set(), cost = {};
    let parentBlocks = {};

    for(let i = 0; i < 50; i++){
        for(let j = 0; j < 90; j++){
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
    visitedBlocks.add(hash(source.r, source.c));

    while(blocks.length > 0){
        let currentBlock = blocks.shift();

        for(let k = 0; k < 8; k++){
            let newRow = currentBlock.r + x_dir[k];
            let newCol = currentBlock.c + y_dir[k];
            let hashKey = hash(newRow, newCol);

            if(isSafeToConstruct(newRow, newCol) && isRoadOrCity(newRow, newCol)){
              setTimeout(() => {
                if(currentBlock.r !== source.r && currentBlock.c !== source.c && !isACityWithCoordinates(currentBlock.r, currentBlock.c)){
                  if(document.getElementById(hash(currentBlock.r, currentBlock.c)).style.backgroundColor !== 'blue'){
                    document.getElementById(hash(currentBlock.r, currentBlock.c)).style.backgroundColor = 'grey';
                  }
                }
              },count*20)
              count++;

                if(isACityWithCoordinates(newRow, newCol)){
                    if(newRow === destination.r && newCol === destination.c){
                        parentBlocks[hashKey] = {r: currentBlock.r, c: currentBlock.c};
                        buildPath(parentBlocks,source, destination);
                        return;
                    }
                }

                let newG = currentBlock.g + 1;
                let h = calculateHeuristicValue(newRow, newCol);
                let newF = newG + h;
                if(cost[hashKey] > newF){
                    parentBlocks[hashKey] = {r: currentBlock.r, c: currentBlock.c};
                    visitedBlocks.add(hashKey);
                    blocks.push({
                        g: newG,
                        f: newF,
                        r: newRow,
                        c: newCol
                    });
                    cost[hashKey] = newF;
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
    setTimeout(() => {
      window.alert("Sorry. Destination can't be reached");
    },count*20);
  }

  const findShortestPath = async () => {
    let stops = [...myState.stops];
    
    stops.unshift(myState.source);
    stops.push(myState.destination);

    for(let i = 1; i < stops.length; i++){
      findPath(stops[i-1],stops[i]);
    }
  }

  useEffect(() => {
    if(myState.findPath){
      let sourceBlock = document.getElementById(hash(source.r, source.c));
      let destinationBlock = document.getElementById(hash(destination.r, destination.c));
      sourceBlock.style.backgroundColor = 'green';
      destinationBlock.style.backgroundColor = 'red';

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