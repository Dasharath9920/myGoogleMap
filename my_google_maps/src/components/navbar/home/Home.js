import React from 'react';
import {useSelector, useDispatch} from 'react-redux'
import Sidebar from './sidebar/sidebar';
import Map from './map/map';
import actionTypes from '../../../reducer/actionTypes';

function Home() {
  const dispatch = useDispatch();

  let grid = [];
  for(let i = 0; i < 50; i++){
      let temp = [];
      for(let j = 0; j < 100; j++){
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

  return (
    <div className='home'>
        <Sidebar />
        <Map />
    </div>
  )
}

export default Home