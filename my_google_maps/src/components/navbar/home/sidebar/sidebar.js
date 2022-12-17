import React from 'react'
import PlaceIcon from '@mui/icons-material/Place';
import SwapVertIcon from '@mui/icons-material/SwapVert';

function Sidebar() {
  return (
    <div className='sidebar'>
        <div className="locations_container">
            <div className="location">
                <PlaceIcon className='location-icon'/>
                <div  className='location-search'>
                    <input type="text" placeholder='Choose starting point'/>
                </div>
            </div>
            <div className="location">
                <PlaceIcon className='location-icon'/>
                <div className='location-search'>
                    <input type="text" placeholder='Choose destination'/>
                </div>
            </div>
        </div>
        <button className='swap-button'><SwapVertIcon className='swap-icon'/></button>
    </div>
  )
}

export default Sidebar