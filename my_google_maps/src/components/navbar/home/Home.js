import React from 'react';
import Sidebar from './sidebar/sidebar';
import Map from './map/map';

function Home() {
  return (
    <div className='home'>
        <Sidebar />
        <Map />
    </div>
  )
}

export default Home