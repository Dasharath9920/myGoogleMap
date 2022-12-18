import React, { useEffect } from 'react';
import {useDispatch} from 'react-redux'
import Sidebar from './sidebar/sidebar';
import Map from './map/map';
import PathFinder from './pathFinder';
import actionTypes from '../../../reducer/actionTypes';

function Home() {
  const dispatch = useDispatch();

  const generateMap = () => {
    let grid = [];
    for(let i = 0; i < 50; i++){
        let temp = [];
        for(let j = 0; j < 90; j++){
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
  }

  useEffect(() => {
    generateMap();
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