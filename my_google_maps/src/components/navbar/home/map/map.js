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

  const resetCities = () => {
    for(let i = 0; i < 50; i++){
      for(let j = 0; j < 100; j++){
        let key = hash(i,j);
        let cell = document.getElementById(key);
        if(cell){
          cell.innerText = '';
        }
      }
    }
  }

  useEffect(() => {
    resetCities();
    myState.cities.forEach((block,index) => {
      let key = hash(block.r, block.c);
      let cell = document.getElementById(key);
      if(cell){
        cell.innerText = index+1;
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
                    return <h5 className="block" id={has} key={has} style={{transform:`translateX(${block.c*11}px)`}}></h5>
                }
                )}
            </div>  
        })}
    </div>
  )
}

export default Map