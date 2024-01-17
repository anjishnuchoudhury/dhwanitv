import React from 'react';
import CountUp from 'react-countup';
import metricsImage from '../images/metrics-tabla.jpg';
import VisibilitySensor from 'react-visibility-sensor'

export default class Metrics extends React.Component{
  render(){
    return(
      <div className="metrics">
        <div className="container-fluid">
          <div className="row">
            <div className="d-flex align-items-center metrics-background col-12 px-0">
              <img src={metricsImage} className="w-100 metrics-image-overlay d-md-block d-none"/>
              <div className="metrics-position py-5 py-md-0 col-12">
                <div className="d-md-flex d-block">
                  <div className="col-xl-3 col-lg-3 col-md-3 col-12 text-center">
                    <i className="fa fa-eye fa-3x metrics-icon pb-2" aria-hidden="true"></i><br/>
                    <label className="text-white metrics-figure">
                        <CountUp end={1500} duration={4}suffix="+">
                        {({ countUpRef, start }) => (
                            <VisibilitySensor onChange={start} delayedCall>
                                <span ref={countUpRef} />
                            </VisibilitySensor>
                        )}
                        </CountUp>
                    </label>
                    <p className="text-white metrics-title">Engagements</p>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-3 col-12 text-center">
                    <i className="fa fa-users fa-3x metrics-icon pb-2" aria-hidden="true"></i><br/>
                    <label className="text-white metrics-figure">
                        <CountUp end={30} duration={4}suffix="+">
                        {({ countUpRef, start }) => (
                            <VisibilitySensor onChange={start} delayedCall>
                                <span ref={countUpRef} />
                            </VisibilitySensor>
                        )}
                        </CountUp>
                    </label>
                    <p className="text-white metrics-title">Live Concerts</p>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-3 col-12 text-center">
                    <i className="fa fa-video-camera fa-3x metrics-icon pb-2" aria-hidden="true"></i><br/>
                    <label className="text-white metrics-figure">
                        <CountUp end={100} duration={4}suffix="+">
                        {({ countUpRef, start }) => (
                            <VisibilitySensor onChange={start} delayedCall>
                                <span ref={countUpRef} />
                            </VisibilitySensor>
                        )}
                        </CountUp>
                    </label>
                    <p className="text-white metrics-title">Recorded Concerts</p>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-3 col-12 text-center">
                    <i className="fa fa-music fa-3x metrics-icon pb-2" aria-hidden="true"></i><br/>
                    <label className="text-white metrics-figure">
                      <CountUp end={1000} duration={4}suffix="+">
                      {({ countUpRef, start }) => (
                          <VisibilitySensor onChange={start} delayedCall>
                              <span ref={countUpRef} />
                          </VisibilitySensor>
                      )}
                      </CountUp>
                    </label>

                    <p className="text-white metrics-title">Exuberant Performances</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}