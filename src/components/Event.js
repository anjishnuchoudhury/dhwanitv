import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import crypto from 'crypto';
import {useAuth} from '../context/AuthContext.js';
import Footer from './Footer';
import Header from './Header';
import EventDetails from './EventDetails';
import Loading from './Loading.js';
import PageNotFound from './PageNotFound.js';
import Route404 from './Route404.js';

export default function Event(props){

  const {currentUser, addTickets} = useAuth();
  const history = useHistory()
  const [event, setEvent] = useState();
  const [result, setResult] = useState();
  const [location, setLocation] = useState("US");
  const algorithm = 'aes-256-cbc';

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let query = useQuery();
  const data = JSON.parse(query.get("data"));
  const keyStr = query.get("key") ? query.get("key").toString() : "";
  const key = Buffer.from(keyStr, 'hex');
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  function decrypt(data){
    let iv =Buffer.from(data.iv, 'hex');
    let encryptedResponse = Buffer.from(data.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedResponse);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
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

  async function registerPaytmUserForEvent(regEvent, paymentStatus, transactionID){
    if(currentUser === null || currentUser === undefined){
      history.push('/signin')
    }
    if(paymentStatus.resultStatus === "TXN_SUCCESS"){
      let countries = new Map(Object.entries(regEvent.country));
      let date = "", time = "";
      if(countries.get(location) !== undefined){
        date = countries.get(location).date.split('-');
        time = countries.get(location).time;
      }else{
          date = countries.get('US').date.split('-')
          time = countries.get('US').time;
      }
      await addTickets(currentUser, regEvent, transactionID, date[2]+superscriptDate(date[2])+" "+monthNames[date[1]-1]+',', twelveHourClock(time))
      window.setTimeout(() => {
        history.push({
          pathname:'/show-event', 
          event: regEvent,
          status: paymentStatus.resultStatus,
          reason: paymentStatus.resultMsg
        })
      }, 3000);
    }else{
    }
  }
  async function registerPaypalUserForEvent(regEvent, paymentStatus, transactionID){
    if(currentUser === null || currentUser === undefined){
      history.push('/signin')
    }
    if(paymentStatus === "approved"){
      let countries = new Map(Object.entries(regEvent.country));
      let date = "", time = "";
      if(countries.get(location) !== undefined){
        date = countries.get(location).date.split('-');
        time = countries.get(location).time;
      }else{
          date = countries.get('US').date.split('-')
          time = countries.get('US').time;
      }
      await addTickets(currentUser, regEvent, transactionID, date[2]+superscriptDate(date[2])+" "+monthNames[date[1]-1]+',', twelveHourClock(time));
      window.setTimeout(() => {
        history.push({
          pathname:'/show-event', 
          event: regEvent,
          status: paymentStatus,
          reason: "Txn Success"
        })
      }, 3000);
    }else{
    }
  }
  useEffect(() => {
    window.scroll(0,0);
    // axios.get('https://extreme-ip-lookup.com/json/?key=Ha4zmwOCLYFuaHAADHmB').then((response) => {
    //   setLocation(response.data.countryCode);
    // });
    if(data !== undefined && data !== null && key !== undefined && key !== null){
      let redirectedResponse = JSON.parse(decrypt(data))
      setEvent(redirectedResponse.event);
      setResult(redirectedResponse.result);
      if(redirectedResponse.timestamp > new Date()){
        window.setTimeout(() => {
          history.push({
            pathname:'/show-event', 
            event: redirectedResponse.event,
            status: "LINK_EXPIRED",
            reason: "Link has expired. If payment is not reflected in your account, please reach out to us write to us at dhwaniacademy@gmail.com or call us at +91-(33)-2446-6076."
          })
        }, 3000);
      }
      if(redirectedResponse.paymentGateway === 'PTM'){
        if(redirectedResponse.result.resultInfo.resultStatus === "TXN_SUCCESS"){
          registerPaytmUserForEvent(redirectedResponse.event, redirectedResponse.result.resultInfo, redirectedResponse.result.txnId)
        }else if(redirectedResponse.result.resultInfo.resultStatus === "PENDING"){
          window.setTimeout(() => {
            history.push({
              pathname:'/show-event', 
              event: redirectedResponse.event,
              status: redirectedResponse.result.resultInfo.resultStatus,
              reason: redirectedResponse.result.resultInfo.resultMsg
            })
          }, 3000);
          
        }else{
          window.setTimeout(() => {
            history.push({
              pathname:'/show-event', 
              event: redirectedResponse.event,
              status: redirectedResponse.result.resultInfo.resultStatus,
              reason: redirectedResponse.result.resultInfo.resultMsg
            })
          }, 3000);
        }
      }else{
        if(redirectedResponse.result.state === "approved"){
          registerPaypalUserForEvent(redirectedResponse.event, redirectedResponse.result.state, redirectedResponse.result.id)
        }else if(redirectedResponse.result.state === "failed"){
          window.setTimeout(() => {
            history.push({
              pathname:'/show-event', 
              event: redirectedResponse.event,
              status: "TXN_FAILURE",
              reason: "Payment failed due to some reason. Please re-try making a payment."
            })
          }, 3000);
        }else{
          window.setTimeout(() => {
            history.push({
              pathname:'/show-event', 
              event: redirectedResponse.event,
              status: "PENDING",
              reason: "Looks like the payment is not complete."
            })
          }, 3000);
        }
      }
    }
  }, [])
  return(
    <div >
      {(props.location.event === undefined || props.location.event === null) ? 
        ((event === undefined || event === null) || (result === undefined || result === null)?
          (<Route404/>):
          (<><Header/><Loading/><Footer footer="fixed-footer"/></>)): 
        (<><Header/><EventDetails event={props.location.event} status={props.location.status} reason={props.location.reason}/><Footer/></>)}
    </div> 
  )
}