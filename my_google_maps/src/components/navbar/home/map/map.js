import React from 'react'

function Map() {

  let hash = (i,j) => {
    return 2001*(i+1000)+(j+1000);
  }

  let grid = [];
  
  const generateGrid = () => {
    let test = new Set()
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
  }

  const generateCities = (numberOfCities) => {
    let uniqueCities = new Set()
    let citiesGenerated = []
    while(uniqueCities.size < numberOfCities){
        let r = Math.round(Math.random()*50);
        let c = Math.round(Math.random()*100);
        let has = hash(r,c);
        if(!uniqueCities.has(has)){
            uniqueCities.add(has);
            citiesGenerated.push({
                r: r,
                c: c
            })
        }
    }

    citiesGenerated.forEach(block => {
        let key = hash(block.r, block.c);
        document.getElementById(key).style.backgroundColor='black';
    })
  }

  generateGrid();
  setTimeout(() => {
      generateCities(10);
  });

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