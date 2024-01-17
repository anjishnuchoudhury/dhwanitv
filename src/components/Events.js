import React, { useEffect, useState } from 'react';
import { DateUtils } from 'react-day-picker';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js'
import firebaseAppConfig from '../config/firebaseConfig.js';

import axios from 'axios'
import spinner from '../images/spinner.gif';

export default function Events(props){
  const { currentUser, getUser } = useAuth();
  const [listOfEvents, setListOfEvent] = useState([]);
  const [eventImages, setEventImages] = useState(new Map());
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false)
  const [authenticatedCustomer, setAuthenticatedCustomer] = useState();
  const [location, setLocation] = useState("");

  // var loadImagesErrorFlag = "true";
  var futureEvents = 0;
  // var pastEvents = 0;
  var isEventRegistered = false;
  var isFree = false;
  useEffect(() => {
    axios.get('https://extreme-ip-lookup.com/json/?key=Ha4zmwOCLYFuaHAADHmB').then((response) => {
      setLocation(response.data.countryCode);
    });
    if(listOfEvents.length === 0){
      let db = firebaseAppConfig.database().ref('events');
      db.on("value", (events) => {
        events.forEach((event) => {
          getImages(event.val().title);
          setListOfEvent(prevState => [...prevState, event.val()])
        })
      });
      db = firebaseAppConfig.database().ref('freeevents');
      db.on("value", (events) => {
        events.forEach((event) => {
          getImages(event.val().title);
          setListOfEvent(prevState => [...prevState, event.val()])
        })
      })
    }
    if(currentUser !== undefined && currentUser !== null){
      setIsCustomerLoggedIn(true);
      getUser(currentUser).then((result) => {
        setAuthenticatedCustomer(result);
      });
    }else{
      setIsCustomerLoggedIn(false);
    }
  },[])
  async function getImages(name){
    const source = 'events/'+name.toLowerCase().replace(/\s+/g, '');
    await firebaseAppConfig.storage().ref().child(source).listAll().then((result) => {
        if(result.items.length === 0){
          // loadImagesErrorFlag = "true";
        }else{
            result.items.forEach((imageRef) => {
                imageRef.getDownloadURL().then((url) => {
                  // loadImagesErrorFlag = "false";
                  setEventImages(prevState => new Map([...prevState, [name, url]]));
                });
            })
        }
    }).catch((error) => {
      // loadImagesErrorFlag = "true";
    });  
  }
  const superscriptDate = (date) => {
    if((date % 10) === 1){
      return "st";
    }else if((date % 10) === 2){
      return "nd";
    }else if((date % 10) === 3){
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
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  listOfEvents.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
  if(listOfEvents !== undefined && listOfEvents.length > 0 && eventImages !== undefined && eventImages.size > 0){
    return(
      <div>
        <div className="container-fluid home-event-info py-5">
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-12 text-center event-border py-3 py-md-0 px-auto px-lg-5">
              <label className="text-white home-event-title mb-3">Upcoming events</label>
              {listOfEvents.slice(0, 3).map((event, index) => {
                let countries = new Map(Object.entries(event.country))
                let date = "";
                event.image = eventImages.get(event.title);
                if(countries.get(location) !== undefined){
                  date = countries.get(location).date.split('-')
                }else{
                  date = countries.get('US').date.split('-')
                }
                isEventRegistered = false;
                var border = "";
                if (futureEvents !== 0) {
                  border = "home-event-end-border";
                }
                const eventDate = new Date();
                eventDate.setFullYear(date[0], date[1]-1, date[2]);
                eventDate.setHours(0, 0, 0, 0)
                if(event.payment === "free"){
                  isFree = true;
                }
                if(isCustomerLoggedIn && (authenticatedCustomer !== undefined && authenticatedCustomer !== null)
                    && (authenticatedCustomer.registeredFor !== undefined && authenticatedCustomer.registeredFor !== null)){
                  authenticatedCustomer.registeredFor.forEach((registeredEvent) => {
                    if(registeredEvent.eventID === event.ID){
                      isEventRegistered = true;
                    }
                  })
                }
                if (DateUtils.isFutureDay(eventDate) || DateUtils.isSameDay(new Date(), eventDate)) {
                  futureEvents = futureEvents+1;
                  return (
                    <div className={`row align-items-center ${border} mx-lg-5 mx-3 pt-4 pb-2`} key={index}>
                      <div className="col-12 col-md-2 mb-3">
                        <img src={event.image} alt={event.title} className="up-event-poster"/>
                      </div>
                      <div className="col-12 col-md-5 text-white text-md-left mb-3">
                        {!isFree ? (
                          <Link to={{ pathname: "/show-event", event: event }} className="text-white">
                            <label className="home-event-name cursor-pointer">{event.title}</label>
                          </Link>
                        ) : (
                          <Link to={{ pathname: "/view-event", event: event }} className="text-white">
                            <label className="home-event-name cursor-pointer">{event.title}</label>
                          </Link>
                        )}
                        
                        <br />
                        <hr className="mt-0 d-inline-block mx-auto half-golden-line" />
                        <p className="mb-1">{date[2]}<sup>{superscriptDate(date[2])}</sup>&nbsp;&nbsp;{monthNames[date[1]-1]}, {date[0]}.</p>
                        <p className="mb-1">{countries.get(location) !== undefined ? twelveHourClock(countries.get(location).time) : twelveHourClock(countries.get('US').time)}</p>
                      </div>
                      <div className="col-md-4 col-12 text-md-right mb-3">
                        {!isFree ? 
                          (isEventRegistered && isCustomerLoggedIn ? <Link to={{pathname: "/view-event", event: event}} className="btn btn-magenta col-lg-8 col-10">View Event</Link> : <Link to={{ pathname: "/show-event", event: event }} className="btn btn-magenta col-lg-8 col-10">Buy tickets</Link>) : 
                          <Link to={{pathname: "/view-event", event: event}} className="btn btn-magenta col-lg-8 col-10">View Event</Link>
                        }
                        </div>
                    </div>
                  );
                }
              })}
              {futureEvents > 2 ? <a href="/events" className="btn btn-magenta col-6 col-md-3 my-3">See more</a> : futureEvents === 0 ? (
                <>
                  <p className="text-white mb-5">Coming up soon...</p>
                  <p className="text-white">Watch our premiered events from the vault...</p>
                  <a href="/past-events" className="btn btn-magenta col-10 col-md-3">Watch past events</a>
                </>
              ) : <></>}

            </div>
          </div>
        </div>
      </div>
    )
  }else{
    return (
      <>
        <div className="container-fluid home-event-info py-5">
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-12 text-center event-border py-3 py-md-0 px-auto px-lg-5">
              <label className="text-white home-event-title mb-3">Upcoming events</label>
              <br/>
              <img src={spinner} alt="Spinner" className=""/>
              <br/>
            </div>
          </div>
        </div>
      </>
    )
  }
    
}