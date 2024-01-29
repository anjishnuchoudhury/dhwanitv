import React, { useState,useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import crypto from 'crypto';
import '@vimeo/player';
import Header from './Header';
import CountDownTimer from './CountDownTimer';
import Footer from './Footer';
import axios from 'axios';
import Route404 from './Route404';
import Loading from './Loading';
import Viewport from './Viewport';
import { DateUtils } from 'react-day-picker';
import firebaseAppConfig from '../config/firebaseConfig.js';

// import KolkataGives from '../images/kolkata-gives.jpeg';
// import Nea from '../images/nea.jpeg';
// import SangeetNatakAkademi from '../images/sangeet-natak-akademi.jpeg';
// import MinistryOfCulture from '../images/ministry-of-culture.jpeg';

export default function ViewEvent(props) {
    const {currentUser, getUser, addToWishList} = useAuth();
    const [eventDate, setEventDate] = useState([]);
    const [eventTime, setEventTime] = useState([]);
    const [dateComparator, setDateComparator] = useState();
    const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
    const [authenticatedCustomer, setAuthenticatedCustomer] = useState();
    const history = useHistory();
    const algorithm = 'aes-256-cbc';

    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery();
    const data = JSON.parse(query.get("data"));
    const keyStr = query.get("key") ? query.get("key").toString() : "";
    const linkedDate = query.get("date") ? query.get("date").toString() : "";
    const isFree = query.get("isfree") ? query.get("isfree").toString() : "";
    const key = Buffer.from(keyStr, 'hex');

    let isEventRefreshed = false;

    function decrypt(data){
        let iv =Buffer.from(data.iv, 'hex');
        let encryptedResponse = Buffer.from(data.encryptedData, 'hex');
        let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedResponse);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    const addEventToWishList = async (event) => {
        if(currentUser){
            // console.log(event)
            await addToWishList(currentUser, event);
        }else{
            console.log("Not logged in")
            history.push('/signin');
        }
        
    }

    useEffect(() => {
        window.scroll(0, 0, 0, 0);
        if(data !== null && data !== undefined && key !== undefined && key !== null){
            let event = JSON.parse(decrypt(data));
            // Refresh event code goes here
            let source = "";
            if(isFree !== null && isFree !== undefined && isFree === "free"){
                source = 'freeevents/'+event.title.toLowerCase().replace(/\s+/g, '');
            }else{
                source = 'events/'+event.title.toLowerCase().replace(/\s+/g, '');
            }
            let date = linkedDate.split('-')
            if(event.link === undefined || event.link === null || event.link === "" || DateUtils.isPastDay(new Date(date[0], date[1]-1, date[2]))){
                isEventRefreshed = true;
                const db = firebaseAppConfig.database().ref(source);
                db.on("value", (events) => {
                    event.link = events.toJSON().link;
                    history.push({
                        pathname:'/guest/view-event', 
                        event: event
                    })
                })
            }else{
                history.push({
                    pathname:'/guest/view-event', 
                    event: event
                })
            }
        }
        axios.get('https://extreme-ip-lookup.com/json/?key=Ha4zmwOCLYFuaHAADHmB').then((response) => {
            if(props.location !== undefined && props.location !== null
                && props.location.event !== undefined && props.location.event !== null){
                    let countries = new Map(Object.entries(props.location.event.country))
                    let date = [], time = [], dateComp = new Date();
                    if(countries.get(response.data.countryCode) !== undefined){
                        date = countries.get(response.data.countryCode).date.split('-');
                        time = countries.get(response.data.countryCode).time.split(':');
                    }else{
                        date = countries.get('US').date.split('-');
                        time = countries.get('US').time.split(':');
                    }
                    dateComp.setFullYear(date[0], date[1]-1, date[2]);
                    dateComp.setHours(time[0], time[1], 0, 0);
                    setEventDate(date);
                    setEventTime(time);
                    setDateComparator(dateComp);
            }else if(props.location !== undefined && props.location !== null 
                && props.history.location !== undefined && props.history.location !== null
                && props.history.location.event !== undefined && props.history.location.event !== null){
                    props.location.event = props.history.location.event;
                    let countries = new Map(Object.entries(props.location.event.country))
                    let date = [], time = [], dateComp = new Date();
                    if(countries.get(response.data.countryCode) !== undefined){
                        date = countries.get(response.data.countryCode).date.split('-');
                        time = countries.get(response.data.countryCode).time.split(':');
                    }else{
                        date = countries.get('US').date.split('-');
                        time = countries.get('US').time.split(':');
                    }
                    dateComp.setFullYear(date[0], date[1]-1, date[2]);
                    dateComp.setHours(time[0], time[1], 0, 0);
                    setEventDate(date);
                    setEventTime(time);
                    setDateComparator(dateComp);
            }else{
                if(!isEventRefreshed){
                    history.push({
                        pathname:'/home', 
                    })
                }else{
                    history.push({
                        pathname:'/redirecting', 
                    })
                }
                
            }
        })

        //checking logged in or not
        if (currentUser !== undefined && currentUser !== null) {
            setIsCustomerLoggedIn(true);
            getUser(currentUser).then((result) => {
                setAuthenticatedCustomer(result);
            })
        } else {
            setIsCustomerLoggedIn(false);
        }
    }, [])
    
    if(dateComparator !== undefined && dateComparator !== null){
        const today = new Date();
        if(dateComparator > today){
            return (
                <>
                    <Header/>
                    <CountDownTimer event={props.location.event} date={eventDate} time={eventTime}/>
                    <Footer footer="fixed-footer"/>
                </>
            )
        }else {
            let wishFound = false;
            if(props.location !== undefined && props.location !== null
                && props.location.event !== undefined && props.location.event !== null
                && props.location.event.link !== undefined && props.location.event.link !== null
                ){
                return(
                    <>
                        <Header/>
                        <div className="container">
                            <div className="event-image countdown-boxshadow mt-5">
                                <div className="col-12">
                                    <div className="row">
                                        <Viewport link={props.location.event.link} title={props.location.event.title}/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 mt-4">
                                    <p>{props.location.event.description}</p>
                                </div>
                            </div>
                            <div className="row">
                        <div className="col-12">
                            {authenticatedCustomer !== null && authenticatedCustomer !== undefined 
                                && authenticatedCustomer.wishlist != null && authenticatedCustomer.wishlist !== undefined 
                                && authenticatedCustomer.wishlist.length >0 ? (
                                authenticatedCustomer.wishlist.map((wish) => {
                                    if(wish.eventID === props.location.event.ID){
                                        wishFound = true;
                                    }
                                })
                            ) : (
                                <span className='btn btn-primary watchlist-view-btn mb-5 mr-3' onClick={e => addEventToWishList}>+ Watchlist</span>
                            )}
                            {wishFound ? <span className='btn btn-danger mb-5 mr-3'><i className="fa fa-check-circle" aria-hidden="true"></i>&nbsp;&nbsp;Already added to watchlist</span> : <span className='btn btn-danger mb-5 mr-3' onClick={e => addEventToWishList(props.location.event)}>+ Watchlist</span>}
                            
                            <a className='btn btn-danger mb-5' href="https://www.paypal.com/donate/?hosted_button_id=SUPV8YKN5RXN8">Donate Now</a>
                        </div>
                    </div>
                            {/* <div className="row">
                                <div className="col-md-6 col-12 mb-3">
                                    <label className="countdown-event-label">Our Sponsors</label>
                                    <br/>
                                    <hr className="mt-0 d-inline-block mx-auto half-golden-line"/>
                                </div>
                            </div>
                            <div className="row mb-5">
                                <div className="col-12">
                                    <div className="d-flex align-items-center">
                                        <div className="col-2 px-0 mr-md-5 mr-4">
                                            <img src={MinistryOfCulture} alt="Ministry of culture" className="w-100 countdown-boxshadow"/>
                                        </div>
                                        <div className="col-2 px-0 mr-md-5 mr-4">
                                            <img src={Nea} alt="Ministry of culture" className="w-100 countdown-boxshadow"/>
                                        </div>
                                        <div className="col-2 px-0 mr-md-5 mr-4">
                                            <img src={SangeetNatakAkademi} alt="Ministry of culture" className="w-100 countdown-boxshadow" />
                                        </div>
                                        <div className="col-2 px-0">
                                            <img src={KolkataGives} alt="Ministry of culture" className="w-100 countdown-boxshadow" />
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                        <Footer/>
                    </>
                )
            }else{
                return(
                    <Route404/>
                )
            }
        }
    }else{
        return (
            <>
                <Header/>
                <Loading/>
                <Footer footer="fixed-footer"/>
            </>
        )
    }
    
    
    
}