import React, { useEffect, useRef, useState } from 'react';
import firebaseAppConfig from '../config/firebaseConfig.js';
import axios from 'axios';
import $ from 'jquery';
import crypto from 'crypto';

import Footer from './Footer';
import Header from './Header';

export default function BookForArtist(props){ 

    const [listOfEvents, setListOfEvent] = useState([]);
    const [location, setLocation] = useState("US");
    const [loading, setLoading] = useState(false);
    const selectedEvent = useRef({});
    const email = useRef();
    const name = useRef();
    const coupon = useRef();
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const [notifMessage, setNotifMessage] = useState("");

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const encrypt = (eventJSON) => {
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
        let encrypted = cipher.update(eventJSON);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')}
    }

    useEffect(() => {
        if(listOfEvents.length === 0){
            let db = firebaseAppConfig.database().ref('events');
            db.on("value", (events) => {
              events.forEach((event) => {
                setListOfEvent(prevState => [...prevState, event.val()])
              })
            });
            db = firebaseAppConfig.database().ref('freeevents');
            db.on("value", (events) => {
              events.forEach((event) => {
                setListOfEvent(prevState => [...prevState, event.val()])
              })
            });
        }
        // axios.get('https://extreme-ip-lookup.com/json/?key=Ha4zmwOCLYFuaHAADHmB').then((response) => {
        //   setLocation(response.data.countryCode);
        // });
    }, [])

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

    const validateAuthentication = (e) => {
        e.preventDefault();
        if(name.current.value !== undefined && name.current.value !== null && name.current.value !== ""
            && email.current.value !== undefined && email.current.value !== null && email.current.value !== ""
            && selectedEvent.current.value !== undefined && selectedEvent.current.value !== null && selectedEvent.current.value !== {}
            && location !== null && location !== undefined && location !== ""){
                $('#exampleModal').modal('show');
            }
    }

    const validateInputsAndAuthenticate = (e) => {
        e.preventDefault();
        if(coupon.current.value === "UGZD6HC7"){
            $('#exampleModal').modal('hide');
            setLoading(true);
            let countries = new Map(Object.entries(JSON.parse(selectedEvent.current.value).country))
            let date = "", time="", linkedDate = "";
            if(countries.get(location) !== undefined){
                linkedDate = countries.get(location).date;
                date = countries.get(location).date.split('-');
                time = countries.get(location).time;
            }else{
                linkedDate = countries.get('US').date;
                date = countries.get('US').date.split('-')
                time = countries.get('US').time;
            }
            let url = window.location.origin+'/guest/view-event?data='+JSON.stringify(encrypt(selectedEvent.current.value))+'&isfree='+JSON.parse(selectedEvent.current.value).payment+'&date='+linkedDate+'&key='+key.toString('hex');
            axios({
                method: 'POST',
                url: 'https://dhwanitv-app-api.herokuapp.com/api/email/send-event-email',
                // url: 'http://localhost:5000/api/email/send-event-email',
                data: {
                    sender: '"Dhwani TV" <cloud.dhwaniacademy2021@gmail.com>',
                    recipient: email.current.value,
                    subject: 'Invitation for live concert',
                    details: {
                        name: name.current.value,
                        email: email.current.value,
                        link: url,
                        date: date[2]+superscriptDate(date[2])+" "+monthNames[date[1]-1]+',',
                        time: twelveHourClock(time),
                        event: JSON.parse(selectedEvent.current.value),
                        zone: getLocationName()
                    }
                },
                headers: {
                Accept: "application/json",
                'Content-Type': 'application/json'
                }
            }).then((response) => {
                setLoading(false)
                if(response.data.status === "SUCCESS"){
                    setNotifMessage("We've successfully sent your invitation to "+response.data.recipient+".");
                    $('.alert-container').addClass('d-flex');
                    $('.alert-container').removeClass('d-none');
                    email.current.value = "";
                    name.current.value = "";
                    selectedEvent.current.value = "Select event*";
                    coupon.current.value = "";
                }else if(response.data.status === "FAILURE"){
                    setNotifMessage("We were unable to process your invitation to "+response.data.recipient+". Please try again later.");
                    $('.alert-container').addClass('d-flex');
                    $('.alert-container').removeClass('d-none');
                    email.current.value = "";
                    name.current.value = "";
                    selectedEvent.current.value = "Select event*";
                    coupon.current.value = "";
                }
            })
        }
        
    }

    const getLocationName = () => {
        if(location === "IN"){
            return "Indian"
        }else{
            return "US"
        }
    }
    listOfEvents.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))

    return(
        <>
            <Header/>
            <div className="container my-5">
                <div className="row">
                    <div className="container-fluid mb-0 px-0 mb-4 d-none alert-container"><div role="alert" className="fade alert alert-dark failed-alert w-100 show mb-0"><div className="container"><div className="row justify-content-center"></div><div className="col-12 d-md-flex justify-content-between align-items-center"><p className="mb-0 error-message">{notifMessage}</p></div></div></div></div>
                    <div className="col-12 event-image countdown-boxshadow">
                        <form className="col-12 py-5">
                            <p><i className="mb-3 text-danger">*All fields are compulsory</i></p>
                            <div className="form-group mb-4">
                                <input type="text" ref={name} placeholder="Recipient's Full Name*" className="form-control w-100" required/>
                            </div>
                            <div className="form-group mb-4">
                                <input type="email" ref={email} placeholder="Recipient's Email*" className="form-control w-100" required/>
                            </div>
                            
                            <div className="form-group mb-4">
                                <select defaultValue="Select event*" className="form-control w-100" ref={selectedEvent} required>
                                    <option disabled>Select event*</option>
                                    {listOfEvents.map((event, index) => {
                                        return (<option value={JSON.stringify(event)} key={index}>{event.title}</option>)
                                    })}
                                </select>
                            </div>
                            <div className="form-group mb-4">
                                <span className="mr-3"><input type="radio" value="US" name="timezone" className="mr-2" onChange={loc => setLocation(loc.target.value)} defaultChecked/><span className="text-white">US Time</span></span>
                                <span className="mr-3"><input type="radio" value="IN" name="timezone" className="mr-2" onChange={loc => setLocation(loc.target.value)}/><span className="text-white">India Time</span></span>
                                {/* <span className="mr-3"><input type="radio" value="OTHER" name="timezone" className="mr-2" onChange={loc => setLocation(loc.target.value)}/><span className="text-white">Other Time zones</span></span> */}
                            </div>
                            <div className="col-md-3 col-12 px-0">
                                <button className="w-100 btn btn-magenta done-btn" onClick={validateAuthentication} disabled={loading}>Done</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="modal" tabIndex="-1" role="dialog" id="exampleModal">
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Authenticate Admin</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="my-3">
                            <label className="">Enter coupon code</label>
                            <input type="text" className="w-100" ref={coupon}/>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-magenta" onClick={validateInputsAndAuthenticate}>Send Invite</button>
                        <button type="button" className="btn btn-red" data-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
            <Footer footer="fixed-footer"/>
        </>
    )
}