import React from 'react';

export default class Title extends React.Component{
  render(){
    return(
      <div className="backdrop-image">       
        <div className="text-white text-center title-padding container">
            <label className="title-title mb-4">Tv Dhwani</label>
            <p className="title-sub-title font-weight-light mb-5">An unforgettable experience</p>
            {/* <a href="/events" className="btn btn-tv-home col-xl-3 col-md-4 col-8">Upcoming events</a> */}
            {/* <a href="/tv" className="btn btn-tv-home col-xl-3 col-md-4 col-8">Watch Now</a> */}
        </div>
      </div>
    )
  }
}