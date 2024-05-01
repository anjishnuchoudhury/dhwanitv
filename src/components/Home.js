import React, { useEffect } from 'react'

import Title from './Title.js'
import Events from './Events.js'
// import About from './About.js';
import Metrics from './Metrics'
import Contact from './Contact'
import Header from './Header.js'
import Footer from './Footer.js'
import EventCatalogue from './EventCatalogue.js'
import FreeEvents from './FreeEvents.js'
import Categories from './Categories/Categories.jsx'
import Series from './Series/Series.jsx'

export default function Home () {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div>
      <div className="backdrop-image">
        {/* <div className='nav-gradient'></div> */}
        <Header />
        <Title />
        <div className='gradient-div'></div>
      </div>
      <Categories/>
      <Series/>
      {/* <About/> */}
      {/* <Events/> */}
      {/* <EventCatalogue /> */}
      {/* <FreeEvents/> */}
      {/* <Metrics/> */}
      {/* <Contact/>  */}
      <Footer />
    </div>
  )
}
