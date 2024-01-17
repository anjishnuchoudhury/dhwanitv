import React from 'react';
import {ReactComponent as LoadInfinity} from '../images/loading-infinity.svg';
// import '../footer.css';

export default function Loading(){
    return (
        <>
            <div className="container my-5">
                <div className="event-image countdown-boxshadow">
                    <div className="col-12 pt-4 px-5">
                        <div className="row">
                            <div className="mb-2 col-12 text-center">
                                <LoadInfinity/>
                                <label className="home-event-title text-white mt-3 mb-5">Loading...</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}