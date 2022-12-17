import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import actionTypes from '../../../../reducer/actionTypes';

function Map() {

  const myState = useSelector(state => state.updateProperties);
  const dispatch = useDispatch();

  let hash = (i,j) => {
    return 2001*(i+1000)+(j+1000);
  }

  let grid = [];
  
  const generateGrid = (n,m) => {
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
    });
  }

  generateGrid(50,100);

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