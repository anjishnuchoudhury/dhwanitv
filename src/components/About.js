import React from 'react';
import aboutImage from '../images/aboutus-image.jpg';

export default class About extends React.Component{
  render(){
    return(
      <div className="about-us-backround" id="about-us">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 about-us-image d-md-block d-none">
              <img src={aboutImage} className="w-100 "/>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 about-us-info">
              <label className="text-white about-us-header">About us</label>
              <p className="text-white about-us-para pb-md-3">It is a non-profit charitable organization devoted to the cause of expanding the beneficial
                  and multidimentional influences of traditional Indian music beyond its commonly defined scopes.
                  With this aspiration as its guiding force, the Academy has,on one hand,set itself the task of 
                  raising a new breed of musicians dedicated to the promotion and perpetuation of the musical and 
                  cultural legacy of ancient India while on the other,it pledges to enfold the socially marginalized
                  and culturally sidelined section of the population within the enriching sweep of India’s grand musical 
                  traditions by adopting a host of goal-oriented projects.
              </p>
              <a href="https://www.dhwaniacademy.in" className="btn btn-golden col-12 col-md-6 mb-md-4 mb-4">Know more &gt;</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}