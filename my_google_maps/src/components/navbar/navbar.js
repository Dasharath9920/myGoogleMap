import React from 'react'
import { useState } from 'react';
import PlaceIcon from '@mui/icons-material/Place';
import PhoneIcon from '@mui/icons-material/Phone';

function Navbar() {

  const [showHeaderBar, setShowHeaderBar] = useState(true);

  const contactHandler = () => {
    setShowHeaderBar(!showHeaderBar);
  }

  return (
    <div className='navbar'>
      <div className='navbar_content_block'>
        <PlaceIcon className='map-icon'/>
        <h1>My G<span>o</span><span>o</span><span>g</span>le Maps</h1>
      </div>
      <div className='navbar_content_block' onClick = {contactHandler}>
        <PhoneIcon className='map-icon'/>
        <h1>Get In Touch</h1>
      </div>

      <div id="header__bar" style = {{transform: showHeaderBar? `translateY(120px)`: `translateY(0px)`}}>
        <h3 className="header__bar__title">Frontend Developer</h3>
        <div className="header__bar__icons">
          <a href="https://www.facebook.com/dasharath.dasharath.1694/" target='_blank' rel="noreferrer"><img src="https://img.icons8.com/ios/50/000000/facebook--v1.png" alt='icon'/></a>
          <a href="https://www.instagram.com/dasharath_116/" target='_blank' rel="noreferrer"><img src="https://img.icons8.com/ios/50/000000/instagram-new--v1.png" alt='icon'/></a>
          <a href="https://github.com/Dasharath9920" target='_blank' rel="noreferrer"><img src="https://img.icons8.com/ios/50/000000/github--v1.png" alt='icon'/></a>
          <a href="https://www.linkedin.com/in/dyavari-dasharath-b767021b3/" target='_blank' rel="noreferrer"><img src="https://img.icons8.com/ios/50/000000/linkedin.png" alt='icon'/></a>
        </div>
      </div>
    </div>
  )
}

export default Navbar