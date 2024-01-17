import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import $, { event } from 'jquery';
import {useAuth} from '../context/AuthContext.js';
import { Link, useHistory } from "react-router-dom";
import { DateUtils } from 'react-day-picker';

import eventImagePlaceholder from '../images/event-image-placeholder.jpg';

export default function EventDetails(props) {
  const {currentUser, getUser, updateContact} = useAuth();
  const [location, setLocation] = useState("");
  const [countries, setCountries] = useState(new Map());
  const [isTicketBooked, setIsTicketBooked] = useState(false);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [customer, setCustomer] = useState();
  const [price, setPrice] = useState();
  const [currencySymbol, setCurrencySymbol] = useState();
  const [loading, setLoading] = useState(false);

  const contactRef = useRef();

  const [error, setError] = useState();
  const [contactError, setContactError] = useState();

  const history = useHistory()
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  function isDate(val) {
    // Cross realm comptatible
    return Object.prototype.toString.call(val) === '[object Date]'
  }

  function isObj(val) {
      return typeof val === 'object'
  }

  function stringifyValue(val) {
      if (isObj(val) && !isDate(val)) {
          return JSON.stringify(val)
      } else {
          return val
      }
  }

  function buildForm({ action, params }) {
      const form = document.createElement('form')
      form.setAttribute('method', 'post')
      form.setAttribute('action', action)
      Object.keys(params).forEach(key => {
          const input = document.createElement('input')
          input.setAttribute('type', 'hidden')
          input.setAttribute('name', key)
          input.setAttribute('value', stringifyValue(params[key]))
          form.appendChild(input)
      })

      return form
  }

  async function post(details) {
      const form = buildForm(details)
      document.body.appendChild(form)
      await form.submit()
      form.remove()
  }
  
  function buyEventTickets(e){
    e.preventDefault();
    if(location !== undefined || location !== null){
      setLoading(true);
      if(location === "IN"){
        makePaytmPayment();
      }else{
        makePaypalPayment();
      }
    }
  }
  async function makePaypalPayment(){
   axios({
     method: 'POST',
    //  url: 'http://localhost:5000/api/paypal/v1/pay',
     url: 'https://dhwanitv-app-api.herokuapp.com/api/paypal/v1/pay',
     data: {
        event: props.event,
        price: price, 
        currency: "USD"
     },
     headers: {
        Accept: "application/json",
        'Content-Type': 'application/json'
     }
   }).then((res) => {
     if(res.status === 200){
        setLoading(false);
       window.location = res.data.link;
     }
     
        // registerUserForEvent(res.data);
   }).catch((err) => {

   })
   
  }
  async function makePaytmPayment(){
    if(customer.contact === undefined || customer.contact === null){
      setContactError("Please enter your contant number to continue");
      window.scrollTo(0, 0);
    }else{
      axios({
        method: 'POST',
        // url: 'https://localhost:5000/api/paytm/ind/v1/pay',
        url: 'https://dhwanitv-app-api.herokuapp.com/api/paytm/ind/v1/pay',
        data: {
          key: currentUser.uid,
          event: props.event,
          price: price,
          name: customer.name.replaceAll(/\s/g,''),
          email: customer.email,
          contact: customer.contact
        },
        headers:{
          Accept: "application/json",
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        setLoading(false);
        const information = {
          action: "https://securegw.paytm.in/order/process",
          params: response.data
        }
        post(information);
      })
    }
    
  }
  // async function registerUserForEvent(paymentStatus){
  //   if(currentUser === null || currentUser === undefined){
  //     history.push('/signin')
  //   }
  //   if(paymentStatus){
  //     await addTickets(currentUser, props.event, "SUCCESS")
  //     history.push({
  //       pathname:'/show-event', 
  //       event: props.event
  //     })
  //   }else{
  //   }
  // }
  async function submitContactNumber(e){
    e.preventDefault();
    if(currentUser !== undefined && currentUser !== null){
      $(".alert").alert('close')
      await updateContact(currentUser, contactRef.current.value);
      getUser(currentUser).then((result) => {
        setCustomer(result);
        if(result.contact === undefined || result.contact === null){
          setError("We are unable to update your contact number. Please try again later.")
        }else{
          window.scroll(0,findPos(document.getElementById("description-box")));
        }
      });
      
    }else{
      setError("We are unable to update your contact number. Please try again later.")
    }
  }
  useEffect(() => {
    setCountries(new Map(Object.entries(props.event.country)));
    axios.get('https://extreme-ip-lookup.com/json/?key=Ha4zmwOCLYFuaHAADHmB').then((response) => {
      setLocation(response.data.countryCode);
      if(response.data.countryCode === 'IN'){
        setPrice(props.event.country.IN.price);
        setCurrencySymbol("fa fa-inr")
      }else{
        setPrice(props.event.country.US.price);
        setCurrencySymbol("fa fa-usd")
      }
    })
    if(currentUser !== undefined && currentUser !== null){
      setIsCustomerLoggedIn(true);
      getUser(currentUser).then((result) => {
        if(result !== undefined && result !== null){
          const registeredEvents = result.registeredFor;
          if(registeredEvents !== undefined && registeredEvents !== null){
            for(var i = 0; i < registeredEvents.length; i++){
              if(registeredEvents[i].eventID === props.event.ID){
                setIsTicketBooked(true);
                break;
              }
            }
          }else{
            setIsTicketBooked(false);
          }
        }
        setCustomer(result);
      })
      if((props.status !== undefined && props.status !== null) && (props.reason !== undefined && props.reason !== null)){
        if(props.status === "TXN_FAILURE" || props.status === "LINK_EXPIRED"){
          setError(props.reason)
        }else if(props.status === "PENDING"){
          setError(props.reason+" Please write to us at dhwaniacademy@gmail.com or call us at +91-(33)-2446-6076.")
        }else{
          setError();
        }
      }
    }else{
      setIsCustomerLoggedIn(false);
    }
    $("#scrollToDescription").click(function() {
      window.scroll(0,findPos(document.getElementById("prevent-logout")));
    });
    $("#scrollToDetails").click(function() {
      window.scroll(0,findPos(document.getElementById("scroll-details")));
    });
  }, [])
  function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    return [curtop];
    }
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
  return (
    <div className="show-event">
      <div className="container-fluid event-details-heading">
        <div className="row">
        {contactError && <div className="container-fluid d-flex mb-0 px-0"><div role="alert" className="fade alert alert-dark failed-alert w-100 show mb-0"><div className="container"><div className="col-12 d-md-flex align-items-center"><form className="row align-items-center input-contact-form col-12 px-0" onSubmit={submitContactNumber}><p className="mb-md-0 mb-3 error-message col-md-5"><b>{contactError}</b></p><input type="number" className="form-control col-md-3 mb-md-0 mb-3" ref={contactRef} name="phone-number"/><div className="col-md-2 d-md-block d-none"/><button type="submit" className="btn btn-red col-md-2 mb-md-0 mb-3">Submit</button></form></div></div></div></div>}
        {error && <div className="container-fluid d-flex mb-0 px-0"><div role="alert" className="fade alert alert-dark alert-dismissible failed-alert w-100 show mb-0"><div className="container"><div className="row justify-content-center"><i className="fa fa-times-circle-o error-close-icon close d-block d-md-none" data-dismiss="alert"/></div><div className="col-12 d-md-flex justify-content-between align-items-center"><p className="mb-0 error-message">{error}</p><i className="fa fa-times-circle-o error-close-icon close d-none d-md-block" data-dismiss="alert"/></div></div></div></div>}
          <div className="col-12">
            <div className="col-12 event-caption px-0">
              <div className="container text-center">
                <h1 className="text-white event-name mb-4 mt-4">{props.event.title}</h1>
                <h3 className="text-white mb-4"><i className={currencySymbol}/> {price}</h3>
                {(isCustomerLoggedIn) ? ((isTicketBooked) ? <Link to={{pathname: "/view-event", event: props.event}} className="btn btn-magenta col-md-3 mb-5 col-12">View Event</Link> : <a className="btn btn-magenta col-md-3 col-12 d-none d-md-inline-block mb-5" id="scrollToDetails">Buy tickets</a>) : (<a className="btn btn-magenta col-md-3 col-12 mb-5" id="scrollToDetails">Buy tickets</a>)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid event-base-description" id="scroll-details">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-md-6 col-lg-6 col-12 my-5">
              {props.event.image !== null && props.event.image !== undefined ? <img src={props.event.image} alt={props.event.name} className="w-100"/> : <img src={eventImagePlaceholder} alt={props.event.name} className="w-100"/>}
            </div>
            <div className="col-xl-6 col-md-6 col-lg-6 col-12 mt-5">
              <div>
                <p className="text-justify mt-1" id="description-box">{props.event.description}</p>
                <p className="text-justify mt-1" id="description-box"><b>{props.event.comments}</b></p>
                
                {countries.size > 0 ? (
                  countries.get(location) !== undefined ? !DateUtils.isPastDay(new Date(countries.get(location).date.split('-')[0], countries.get(location).date.split('-')[1] - 1, countries.get(location).date.split('-')[2])) ? <p className="mb-2">Date: {countries.get(location).date.split('-')[2]}<sup>{superscriptDate(countries.get(location).date.split('-')[2])}</sup>&nbsp;&nbsp;{getPrintableDate(countries.get(location).date)}.</p> : "" : !DateUtils.isPastDay(new Date(countries.get('US').date.split('-')[0], countries.get('US').date.split('-')[1] - 1, countries.get('US').date.split('-')[2])) ? <p className="mb-2">Date: {countries.get('US').date.split('-')[2]}<sup>{superscriptDate(countries.get('US').date.split('-')[2])}</sup>&nbsp;&nbsp;{getPrintableDate(countries.get('US').date)}.</p> : ""
                ): ""}
                {countries.size > 0 ? countries.get(location) !== undefined ? !DateUtils.isPastDay(new Date(countries.get(location).date.split('-')[0], countries.get(location).date.split('-')[1] - 1, countries.get(location).date.split('-')[2])) ? <p className="mb-2">Time: {twelveHourClock(countries.get(location).time)} .</p> : "" : !DateUtils.isPastDay(new Date(countries.get('US').date.split('-')[0], countries.get('US').date.split('-')[1] - 1, countries.get('US').date.split('-')[2])) ? <p className="mb-2">Time: {twelveHourClock(countries.get('US').time)} .</p> : "" : ""}
                {(isCustomerLoggedIn) ? ((isTicketBooked) ? <Link to={{pathname: "/view-event", event: props.event}} className="btn btn-magenta col-md-6 col-12 mt-md-1 mt-3 mb-5">View Event</Link> : <button className="btn btn-magenta col-md-6 col-12 mt-md-1 mt-3 mb-5" id="prevent-logout" onClick={buyEventTickets} disabled={loading}>{loading ? "Redirecting to payment gateway" : "Book now"}</button>) : (<Link to={{ pathname: "/signin", destination: {showEventList: true, event: props.event} }} className="btn btn-magenta col-md-6 col-12 mt-md-1 mt-3 mb-5" id="prevent-logout">Sign in to book &nbsp;<i className="fa fa-angle-right font-weight-bold"></i></Link>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}