import React from 'react';
import pagenotfound from '../images/pagenotfound2.svg';

export default function PageNotFound() {
    return (
        <div className="container">
            <div className="page-not-found-holder">
                <div className="col-12 pt-4 px-5">
                    <div className="row">
                        <div className="col-xl-6 col-md-6 col-lg-6 col-12">
                            <img src={pagenotfound} className="page-not-found-image w-100"></img>
                        </div>
                        <div className="mb-2 col-xl-6 col-md-6 col-lg-6 col-12">
                            <div className="row justify-content-center mt-4">
                                <div className="page-not-found-text">
                                    <label className="text-center display-3">Oops!</label>
                                </div>
                            </div>
                            <div className="row page-not-found-text-second-message">
                                <label>You're Off Track</label>
                            </div>
                            <div className="row">
                                <label className="text-left col-12 px-0">The page you are looking for might have been removed, had its name changed or is temporarily unavilable </label>
                            </div>
                            <div className="row mr-1 page-not-found-get-back">
                                <a href="/home" className="d-flex align-items-center mb-md-0 mb-3">
                                    <i className="fa fa-chevron-left text-dark cursor-pointer"></i>
                                    <label className="text-dark mb-0 cursor-pointer"><b>&nbsp;&nbsp;Back</b></label>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}