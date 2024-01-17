import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext.js';
import { useHistory, useLocation } from "react-router-dom";
import crypto from 'crypto';

import firebaseAppConfig from '../../../config/firebaseConfig.js';
import RaagaAndRhythmBanner from '../../../images/raagaandrhythmmain.jpg';
import EventCarousel from '../../EventCarousel.js';


export default function RaagaAndRhythm(props){

    const { currentUser, getUser, addToWishList } = useAuth();
    const [listOfEvents, setListOfEvent] = useState([]);
    const [eventImages, setEventImages] = useState(new Map());
    const history = useHistory();
    const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
    const [authenticatedCustomer, setAuthenticatedCustomer] = useState();

    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    let wishFound = false;
    var loadImagesErrorFlag = "true";

    const encrypt = (eventJSON) => {
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
        let encrypted = cipher.update(eventJSON);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')}
    }

    async function getImages(name){
        const source = 'events/'+name.toLowerCase().replace(/\s+/g, '');
        await firebaseAppConfig.storage().ref().child(source).listAll().then((result) => {
            if(result.items.length === 0){
              loadImagesErrorFlag = "true";
            }else{
                result.items.forEach((imageRef) => {
                    imageRef.getDownloadURL().then((url) => {
                      loadImagesErrorFlag = "false";
                      setEventImages(prevState => new Map([...prevState, [name, url]]));
                    });
                })
            }
        }).catch((error) => {
          loadImagesErrorFlag = "true";
        });  
    }

    const addEventToWishList = async () => {
        if(currentUser){
            await addToWishList(currentUser, listOfEvents[0]);
        }else{
            console.log("Not logged in")
            history.push('/signin');
        }
        
    }

    const toggleVisibilityEpisodes = (title, key, keys) => {
        let targetId = `infinite-carousel-${title}${key}`;
        document.getElementById(targetId).classList.add('d-flex');
        document.getElementById(targetId).classList.remove('d-none');
        document.getElementById('latest-season').innerHTML = `Season ${key}`;
        keys = keys.filter(item => !item.includes(key));
        keys.forEach((k) => {
            let others = `infinite-carousel-${title}${k}`;
            document.getElementById(others).classList.remove('d-flex');
            document.getElementById(others).classList.add('d-none');
        })
    }

    useEffect(() => {
        if (listOfEvents.length === 0) {
            const db = firebaseAppConfig.database().ref('concertseries/raagaandrhythm');
            db.on("value", (events) => {
                    
                Object.values(events.val().episodes).forEach((episodes) => {
                    episodes.forEach((episode) => {
                        getImages(episode.title);
                    })
                    
                })
                setListOfEvent(prevState => [...prevState, events.val()])
            });
        }

        //checking logged in or not
        if (currentUser !== undefined && currentUser !== null) {
            setIsCustomerLoggedIn(true);
            getUser(currentUser).then((result) => {
                setAuthenticatedCustomer(result);
            })
        } else {
            setIsCustomerLoggedIn(false);
        } 
    }, []);
    // console.log(listOfEvents)
    return(
        <>
            <div className='event-image countdown-boxshadow text-center pt-mb-0 pt-3'>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <img src={RaagaAndRhythmBanner} alt="mystic-monsoon-banner" className="w-100 mm-banner" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="event-image countdown-boxshadow pb-5">
                <div className="container">
                    {/* <label className="col-12 pt-5 text-center text-white home-event-title">Mystic Monsoon: A journey through the rhythm of rain</label> */}
                    <div className="row">
                        <div className="col-12">
                            <p className="pt-5 opacity-3 text-white">“RAGA and RHYTHM” is a series with music and musicians from Indian Classical music tradition. Every year DHWANI ACADEMY, USA, Presents these festivals outside INDIA to promote and propagate the top-class artistry from Indian Music Tradition. Be a part of it and enjoy rich, colorful traditional music from INDIA.</p>
                            <div className='d-flex'>
                                <div className="dropdown mr-3 mb-5">
                                        {listOfEvents !== null && listOfEvents !== undefined && listOfEvents.length !== 0 ? (
                                            <>
                                                <button type="button" className="btn btn-primary watchlist-btn dropdown-toggle h-100" id="latest-season" data-toggle="dropdown">{`Season ${Object.keys(listOfEvents[0].episodes)[Object.keys(listOfEvents[0].episodes).length - 1]}`}</button>
                                                <ul class="dropdown-menu" >
                                                    {Object.keys(listOfEvents[0].episodes).map(key => {
                                                        return(
                                                            <li className="dropdown-item" onClick={e => {toggleVisibilityEpisodes(listOfEvents[0].title.toLowerCase().replace(/\s+/g, ''), key, Object.keys(listOfEvents[0].episodes))}}>{`Season ${key}`}</li>
                                                        )
                                                    })}
                                                </ul>
                                            </>
                                        ): (
                                                <></>
                                        )}
                                </div>
                                {authenticatedCustomer !== null && authenticatedCustomer !== undefined 
                                    && authenticatedCustomer.wishlist != null && authenticatedCustomer.wishlist !== undefined 
                                    && authenticatedCustomer.wishlist.length >0 && listOfEvents[0] !== undefined && listOfEvents[0] !== null ? (
                                    authenticatedCustomer.wishlist.map((wish) => {
                                        if(wish.eventID === listOfEvents[0].ID){
                                            wishFound = true;
                                        }
                                    })
                                ) : (
                                    wishFound = false
                                    // <span className='btn btn-primary watchlist-btn mb-5 mr-3' onClick={addEventToWishList}>+ Watchlist</span>
                                )}
                                {wishFound ? <span className='btn btn-primary watchlist-view-btn mb-5 mr-3'><i className="fa fa-check-circle" aria-hidden="true"></i>&nbsp;&nbsp;Already added to watchlist</span> : <span className='btn btn-primary watchlist-view-btn mb-5 mr-3' onClick={e => addEventToWishList()}>+ Watchlist</span>}
                                <a className='btn btn-primary watchlist-btn mb-5' href="https://www.paypal.com/donate/?hosted_button_id=SUPV8YKN5RXN8">Donate Now</a>
                            </div>
                            
                            <p className='text-white carousel-event-title'>Episodes</p>
                        </div>
                    </div>
                    {listOfEvents !== null && listOfEvents !== undefined && listOfEvents.length !== 0 ? (
                        Object.keys(listOfEvents[0].episodes).reverse().map((year) => {
                            let display = "d-none";
                            if(year === Object.keys(listOfEvents[0].episodes)[Object.keys(listOfEvents[0].episodes).length - 1]){
                                display = "d-flex";
                            }
                            return(
                                <EventCarousel listOfEvents={listOfEvents[0].episodes[year]} eventImages={eventImages} title={listOfEvents[0].title.toLowerCase().replace(/\s+/g, '').concat(year)} display={display}/>
                            )
                        })
                    ) : (
                        <></>
                    )}
                </div>
                <div className='container' id="marketing-adv-container">
                    <div className='row' id="maketing-adv-row">
                        
                    </div>
                </div>
            </div>
        </>
    )
}