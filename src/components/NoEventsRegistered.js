import React, { useEffect, useRef, useState } from 'react';

export default function EventComingSoon(props){
    const email = useRef();

    const handleSubscription = () => {

    }
    return (
        <>
            <div className="container px-0 my-5">
                <div className="event-image countdown-boxshadow">
                    <div className="col-12 pt-4 px-5">
                        <div className="row">
                            <div className="mb-2 col-12">
                                <div className="row justify-content-center mt-4">
                                    <div className="page-not-found-text mb-3">
                                        <label className="text-center text-white countdown-event-label">GO GRAB YOUR SEAT NOW</label>
                                    </div>
                                </div>
                                <div className="text-center text-white countdown-event-start mb-4">
                                    <label>DhwaniTV - An unforgettable experience</label>
                                </div>
                                <div className="text-center text-white mb-4">
                                    <label className="mb-md-4 mb-5">We couldn't find any events that you've registered with us. Follow the links below to find an event of your choice.</label>
                                    {props.isLoggedIn ? (<>
                                        <a className="btn btn-magenta col-12 col-md-3 mr-md-5 mb-md-0 mb-4" href="/events">Upcoming events</a>
                                        <a className="btn btn-magenta col-12 col-md-3" href="/past-events">Past events</a>
                                    </>) : (<>
                                        <a className="btn btn-magenta col-12 col-md-3" href="/signin">Sign in</a>
                                    </>)}
                                    
                                </div>
                                <hr className="bg-light my-5"/>
                                <div className="text-center text-white mb-2">
                                    <label>Join us to know the latest updates!</label>
                                </div>
                                <div className="text-center mb-5">
                                    <form onSubmit={handleSubscription}>
                                        <div className="row form-group justify-content-center align-items-center">
                                        <input type="email" placeholder="Enter email" className="form-control subscribe-input mr-md-3 mr-0 mb-md-0 mb-4" name="email" ref={email}/>
                                        <button type="submit" className="btn btn-magenta col-12 col-md-3">Subscribe</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}