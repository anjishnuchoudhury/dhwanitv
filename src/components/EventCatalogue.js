import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import firebaseAppConfig from '../config/firebaseConfig.js';
import FreeEventCarousel from './FreeEventCarousel'
import Carousel from './Carousel.jsx';

function EventCatalogue() {
    const { currentUser, getUser } = useAuth();
    const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
    const [authenticatedCustomer, setAuthenticatedCustomer] = useState();

    const [listOfEventSeries, setListOfEventSeries] = useState([]);
    const [eventImages, setEventImages] = useState(new Map());
    var loadImagesErrorFlag = "true";

    async function getImages(name) {
        const source = 'events/' + name.toLowerCase().replace(/\s+/g, '');
        await firebaseAppConfig.storage().ref().child(source).listAll().then((result) => {
            if (result.items.length === 0) {
                loadImagesErrorFlag = "true";
            } else {
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
    useEffect(() => {
        if (listOfEventSeries.length === 0) {
            const db = firebaseAppConfig.database().ref('concertseries');
            db.on("value", (events) => {
                events.forEach((event, index) => {
                    Object.values(event.val().episodes)[Object.values(event.val().episodes).length - 1].forEach((episode) => {
                        getImages(episode.title);
                    })
                    setListOfEventSeries(prevState => [...prevState, event.val()])
                })
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

    return (
        <div className="container-fluid carousel-container pt-3 pb-5">
            <label className='text-white home-event-title mb-3 ml-4'><b>LATEST IN CONCERT SERIES</b></label>
            {listOfEventSeries !== null && listOfEventSeries !== undefined && listOfEventSeries.length !== 0 ? (
                
                listOfEventSeries.map((event, index) => {
                    return(
                        <>
                            {/* <div className="ml-4 mb-4 text-white carousel-event-title"><a href={`/${event.url}`} className="text-white">{event.title}</a></div> */}
                            <FreeEventCarousel listOfEvents={Object.values(event.episodes)[Object.values(event.episodes).length - 1].reverse()} eventImages={eventImages} title={event.title.toLowerCase().replace(/\s+/g, '')} displayTitle={event.title}/> 
                            {/* <Carousel listOfEvents={Object.values(event.episodes)[Object.values(event.episodes).length - 1].reverse()} eventImages={eventImages} title={event.title}/> */}
                         
                            <br/>
                        </>
                    )
                    
                })
                
            ): (
                <div className="text-center">
                  <p className="text-white mb-5">Sorry, we don't have any free events to watch</p>
                  <p className="text-white">Watch our premiered events from the vault...</p>
                  <a href="/past-events" className="btn btn-signin text-white col-10 col-md-3">Watch past events</a>
                </div>
            )}
        </div>
    )
}

export default EventCatalogue
