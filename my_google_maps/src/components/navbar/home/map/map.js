import React, { useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import actionTypes from '../../../../reducer/actionTypes';

function Map() {

  const myState = useSelector(state => state.updateProperties);
  const dispatch = useDispatch();

  let hash = (i,j) => {
    return 2001*(i+1000)+(j+1000);
  }

  const grid = [...myState.map];

  useEffect(() => {
    myState.cities.forEach(block => {
      let key = hash(block.r, block.c);
      if(document.getElementById(key)){
        document.getElementById(key).style.backgroundColor = 'black';
      }
    })
  },[myState.cities]);

  return (
    <div className='map'>
        {grid.map((row,index) => {
            let key = index;
            return <div className='map-row' key={key}>
                {row.map(block => {
                    let has = hash(block.r,block.c);
                    return <div className="block" id={has} key={has} style={{transform:`translateX(${block.c*11}px)`}}></div>
                }
                )}
            </div>  
        })}
    </div>
  )
}

export default Map