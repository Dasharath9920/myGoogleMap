import React from 'react'

function Map() {

  let hash = (i,j) => {
    return ((i+j)*(i+j+1))/2 + i;
  }

  let grid = [];
  
  const generateGrid = () => {
    for(let i = 0; i < 50; i++){
        let temp = [];
        for(let j = 0; j < 100; j++)
            temp.push({
                r: i,
                c: j
            })
        grid.push(temp)
      }
  }

  generateGrid();

  return (
    <div className='map'>
        {grid.map((row,index) => {
            let key = index;
            return <div className='map-row' key={key}>
                {row.map(block => {
                    let key = hash(block.r,block.c);
                    return <div className="block" id={key} key={key} style={{transform:`translateX(${block.c*11}px)`}}></div>
                }
                )}
            </div>  
        })}
    </div>
  )
}

export default Map