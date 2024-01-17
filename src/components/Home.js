import React, {useEffect} from 'react';

import Title from './Title.js';
import Events from './Events.js';
// import About from './About.js';
import Metrics from './Metrics';
import Contact from './Contact'
import Header from './Header.js';
import Footer from './Footer.js';
import EventCatalogue from './EventCatalogue.js';
import FreeEvents from './FreeEvents.js';

export default function Home(){

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  

    return(
      <div>
        <Header/>
        <Title/>
        {/* <About/> */}
        {/* <Events/> */}
        <EventCatalogue/>
        {/* <FreeEvents/> */}
        {/* <Metrics/> */}
        {/* <Contact/>  */}
        <Footer/>
      </div>
    )

}