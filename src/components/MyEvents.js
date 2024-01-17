import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import firebaseAppConfig from '../config/firebaseConfig.js';
import Loading from './Loading';
import { DateUtils } from 'react-day-picker';

import axios from 'axios'
import Header from './Header';
import Footer from './Footer';
import NoEventsRegistered from './NoEventsRegistered';

export default function MyEvents(props){ 

  const { currentUser, getUser } = useAuth();
  const [listOfEvents, setListOfEvent] = useState([]);
  const [eventImages, setEventImages] = useState(new Map());
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [authenticatedCustomer, setAuthenticatedCustomer] = useState();
  const [location, setLocation] = useState("");

  var isEventRegistered = false;
  var loadImagesErrorFlag = "true";
  var registeredEvents = 0; 
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    axios.get('https://extreme-ip-lookup.com/json/?key=Ha4zmwOCLYFuaHAADHmB').then((response) => {
      setLocation(response.data.countryCode);
    });
    if(listOfEvents.length === 0){
      const db = firebaseAppConfig.database().ref('events');
      db.on("value", (events) => {
        events.forEach((event) => {
          getImages(event.val().title);
          setListOfEvent(prevState => [...prevState, event.val()])
        })
      });
    }
    if(currentUser !== undefined && currentUser !== null){
      setIsCustomerLoggedIn(true);
      getUser(currentUser).then((result) => {
        setAuthenticatedCustomer(result);
      })
    }else{
      setIsCustomerLoggedIn(false);
    }
  }, [])
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
  const getPrintableDate = (eventDate) => {
    let date = eventDate.split('-');
    return monthNames[date[1]-1]+", "+date[0];
  }
  const superscriptDate = (date) => {
    if((date % 10) == 1){
      return "st";
    }else if((date % 10) == 2){
      return "nd";
    }else if((date % 10) == 3){
      return "rd";
    }else{
      return "th";
    }
  }
  const twelveHourClock = (eventTime) => {
    let time = eventTime.split(':')
    if(parseInt(time[0]) > 12){
      return (parseInt(time[0]) - 12)+':'+time[1]+' PM';
    }else if(time[0] === '00'){
      return '12:'+time[1]+' AM';
    }else if(time[0] === '12'){
      return eventTime+' PM';
    }else{
      return eventTime+' AM';
    }
  }
  listOfEvents.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    if(listOfEvents !== undefined && listOfEvents.length > 0 && eventImages !== undefined && eventImages.size > 0){
      return(
      <>
      <Header/>
      <div className="events py-5 px-3 px-md-0">
        <div className="container ">
          {listOfEvents.map((event, index) => {
            const countries = new Map(Object.entries(event.country));
            isEventRegistered =false;
            if(isCustomerLoggedIn && (authenticatedCustomer !== undefined && authenticatedCustomer !== null)
                    && (authenticatedCustomer.registeredFor !== undefined && authenticatedCustomer.registeredFor !== null)){
              authenticatedCustomer.registeredFor.forEach((registeredEvent) => {
                if(registeredEvent.eventID === event.ID){
                  isEventRegistered = true;
                }
              })
            }
            event.image = eventImages.get(event.title);
            if(isCustomerLoggedIn && isEventRegistered){
                registeredEvents++;
                return(
                    <div className="row event-background mb-5" key={index} id={event.title}>
                      <div className="d-flex align-items-center event-image event-image-overlay col-12">
                          <div className="row align-items-center">
                              <div className="col-xl-4 col-lg-4 col-md-4 col-12 py-4 event-thumbnail d-md-block d-none">
                                  <img src={eventImages.get(event.title)} alt={event.title} className="w-100 pl-md-3 event-thumbnail-image"></img>
                              </div>
                              <div className="col-xl-8 col-lg-8 col-md-8 col-12 py-4">
                                  
                                  <div className="row">
                                    <div className="col-12">
                                      <Link to={{ pathname: "/show-event", event: event }} className="text-white">
                                        <label className="text-white event-title cursor-pointer">{event.title}</label>
                                      </Link>
                                      <br/>
                                      <hr className="mt-0 d-inline-block mx-auto half-golden-line"/>
                                      </div>
                                  </div>
                                  <div className="row d-md-none d-flex mb-3">
                                    <div className="col-12">
                                      <img src={eventImages.get(event.title)} alt={event.title} className="w-100 event-thumbnail-image"></img>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-12">
                                      <p className="text-white event-description">{event.description}</p>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-12">
                                      {countries.get(location) !== undefined && countries.size > 0 ? !DateUtils.isPastDay(new Date(countries.get(location).date.split('-')[0], countries.get(location).date.split('-')[1] - 1, countries.get(location).date.split('-')[2])) ? <p className="text-white event-date-time">Date: {countries.get(location).date.split('-')[2]}<sup>{superscriptDate(countries.get(location).date.split('-')[2])}</sup>&nbsp;&nbsp;{getPrintableDate(countries.get(location).date)}.</p> : "" : !DateUtils.isPastDay(new Date(countries.get('US').date.split('-')[0], countries.get('US').date.split('-')[1] - 1, countries.get('US').date.split('-')[2])) ?  <p className="text-white event-date-time">Date: {countries.get('US').date.split('-')[2]}<sup>{superscriptDate(countries.get('US').date.split('-')[2])}</sup>&nbsp;&nbsp;{getPrintableDate(countries.get('US').date)}.</p> : ""}
                                      {countries.get(location) !== undefined && countries.size > 0 ? !DateUtils.isPastDay(new Date(countries.get(location).date.split('-')[0], countries.get(location).date.split('-')[1] - 1, countries.get(location).date.split('-')[2])) ? <p className="text-white event-date-time">Time:  {twelveHourClock(countries.get(location).time)}.</p> : "" : !DateUtils.isPastDay(new Date(countries.get('US').date.split('-')[0], countries.get('US').date.split('-')[1] - 1, countries.get('US').date.split('-')[2])) ? <p className="text-white event-date-time">Time:  {twelveHourClock(countries.get('US').time)}.</p> : ""}
                                    </div>
                                  </div>
                                  <div className="row pt-3">  
                                    <div className="col-12">
                                      {isEventRegistered && isCustomerLoggedIn ? <Link to={{pathname: "/view-event", event: event}} className="btn btn-magenta col-md-6 col-12">View Event</Link> : <Link to={{ pathname: "/show-event", event: event }} className="btn btn-magenta col-md-6 col-12">Get tickets</Link>}
                                    </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                    </div>
                )
            }else{
                return (<></>);
            }
          })}
          {
            registeredEvents === 0 ? 
              (
                <><NoEventsRegistered isLoggedIn={isCustomerLoggedIn}/></>
              ) : (
                <></>
              )
          }
        </div>
    </div> 
    <Footer/>
    </>
    )}else{
      return (
        <>
        <Header/>
        <Loading/>
        <Footer footer="fixed-footer"/>
        </>
      )
    }
}