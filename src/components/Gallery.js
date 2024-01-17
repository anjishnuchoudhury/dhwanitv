import React, {useEffect} from 'react';

import Header from './Header.js';
import Footer from './Footer.js';
import GalleryImages from './GalleryImages.js';

export default function Gallery(){

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
    return(
      <div>
        <Header/>
        <GalleryImages/>
        <Footer/>
      </div>
    )
}