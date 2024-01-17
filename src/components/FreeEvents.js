import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import firebaseAppConfig from '../config/firebaseConfig.js';
import { Link } from 'react-router-dom';
import FreeEventCarousel from './FreeEventCarousel'

function FreeEvents() {
    const { currentUser, getUser } = useAuth();
    const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
    const [authenticatedCustomer, setAuthenticatedCustomer] = useState();

    const [listOfEvents, setListOfEvent] = useState([]);
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
    // console.log(listOfEvents)

    useEffect(() => {
        if (listOfEvents.length === 0) {
            const db = firebaseAppConfig.database().ref('freeevents');
            db.on("value", (events) => {
                events.forEach((event) => {
                    getImages(event.val().title);
                    setListOfEvent(prevState => [...prevState, event.val()])
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
            <div className="text-center text-white carousel-event-title">
                Free Events
            </div>
            {listOfEvents !== null && listOfEvents !== undefined && listOfEvents.length !== 0 ? <FreeEventCarousel listOfEvents={listOfEvents} eventImages={eventImages} title="free"/> : (
                <div className="text-center">
                  <p className="text-white mb-5">Sorry, we don't have any free events to watch</p>
                  <p className="text-white">Watch our premiered events from the vault...</p>
                  <a href="/past-events" className="btn btn-magenta col-10 col-md-3">Watch past events</a>
                </div>
            )}
        </div>
    )
}

export default FreeEvents
