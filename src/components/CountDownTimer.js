import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from "react-router-dom";
import Loading from './Loading';
// import '../footer.css';

export default function CountDownTimer(props) {

  const history = useHistory();
  const email = useRef();
  const [counter, setCounter] = useState([]);

  const eventDate = new Date();
  eventDate.setFullYear(props.date[0], props.date[1]-1, props.date[2]);
  eventDate.setHours(props.time[0], props.time[1], 0, 0)

  const today = new Date();

  const timeDiffCalc = (dateFuture, dateNow) => {
    //console.log(dateFuture, ',,,,',dateNow);
    let diffInMilliSeconds = Math.abs(eventDate - today) / 1000;

    
    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    // console.log("calculated dateNow", days)
 
    
    if (eventDate >= today && (eventDate.getTime() > today.getTime())) {


      if (days === 0) {

        // calculate hours
        const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
        diffInMilliSeconds -= hours * 3600;
        //console.log("calculated hours", hours);

        // calculate minutes
        const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
        diffInMilliSeconds -= minutes * 60;
        //console.log("minutes", minutes);

        //calculate seconds
        const seconds = Math.floor(diffInMilliSeconds);
        diffInMilliSeconds -= seconds * 1000;
        //console.log('seconds',seconds);

        let difference = "";
        if (days > 0) {
          difference += days === 1 ? `${days} day, ` : `${days} days, `;
        }

        if (hours > 0) {
          difference +=
            hours === 0 || hours === 1 ? `${hours} hour, ` : `${hours} hours, `;
        }

        if (minutes > 0) {
          difference +=
            minutes === 0 || hours === 1
              ? `${minutes} minute, `
              : `${minutes} minutes, `;
        }
        difference +=
          seconds === 0 || seconds === 1
            ? `${seconds} second`
            : `${seconds} seconds`;

        // setTimeLeft(difference);
        setCounter([days,hours,minutes,seconds]);
        // console.log(counter)
      }
      
    }else{
      setCounter('PAST')
      // console.log('past event');
      history.push({
        pathname:'/view-event', 
        event: props.event
      })
    }

    if (days < 31 && days != 0) {
      let diffInMilliSeconds = Math.abs(eventDate - today) / 1000;

    
    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    // console.log("calculated dateNow", days)

    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
        diffInMilliSeconds -= hours * 3600;
        //console.log("calculated hours", hours);

        // calculate minutes
        const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
        diffInMilliSeconds -= minutes * 60;
        //console.log("minutes", minutes);

        //calculate seconds
        const seconds = Math.floor(diffInMilliSeconds);
        diffInMilliSeconds -= seconds * 1000;
        //console.log('seconds',seconds);

        let difference = "";
        if (days > 0) {
          difference += days === 1 ? `${days} day, ` : `${days} days, `;
        }

        if (hours > 0) {
          difference +=
            hours === 0 || hours === 1 ? `${hours} hour, ` : `${hours} hours, `;
        }

        if (minutes > 0) {
          difference +=
            minutes === 0 || hours === 1
              ? `${minutes} minute, `
              : `${minutes} minutes, `;
        }
        difference +=
          seconds === 0 || seconds === 1
            ? `${seconds} second`
            : `${seconds} seconds`;


      setCounter([days,hours,minutes,seconds]);
      //  console.log(counter[0],' days left')
    }
    if (days > 31) {
      console.log(eventDate.getDate())
    }

  };

  const handleSubscription = () => {
    if(email !== undefined && email !== null && email !== ""){
      // Add - add to email subscription list logic here
      console.log(email);
    }
  }

  useEffect(() => {
    const timer = setInterval(() => (timeDiffCalc(eventDate, today)), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  if(counter.length > 0){
    return (
      <div className="container">
          <div className="page-not-found-holder">
              <div className="col-12 pt-4 px-5 event-image countdown-boxshadow">
                  <div className="row">
                      <div className="mb-2 col-12">
                          <div className="row justify-content-center mt-4">
                              <div className="page-not-found-text mb-3">
                                  <label className="text-center text-white countdown-event-label">{props.event.title}</label>
                              </div>
                          </div>
                          <div className="text-center text-white countdown-event-start mb-4">
                              <label>The event will start in </label>
                          </div>
                          <div className="row justify-content-center text-white mb-5">
                              <div className="countdown-box mr-lg-3 mr-3 mb-md-0 mb-3">
                                <label className="pt-4"><b>{counter[0]}</b></label>
                                <p>Days</p>
                              </div>
                              <div className="countdown-box mr-lg-3 mr-sm-3 mb-md-0 mb-3">
                                <label className="pt-4"><b>{counter[1]}</b></label>
                                <p>Hours</p>
                              </div>
                              <div className="countdown-box mr-lg-3 mr-3">
                                <label className="pt-4"><b>{counter[2]}</b></label>
                                <p>Minutes</p>
                              </div>
                              <div className="countdown-box">
                                <label className="pt-4"><b>{counter[3]}</b></label>
                                <p>Seconds</p>
                              </div>
                          </div>
                          <div className="text-center text-white mb-2">
                              <label>Join us to know the latest updates!</label>
                          </div>
                          <div className="text-center mb-5">
                            <form onSubmit={handleSubscription}>
                              <div className="row form-group justify-content-center align-items-center">
                                <input type="email" placeholder="Enter email" className="form-control subscribe-input mr-md-3 mr-0 mb-md-0 mb-4" name="email" ref={email}/>
                                <button type="submit" className="btn btn-magenta col-12 col-md-3">Subscribe</button>
                              </div>
                            </form>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    )
  }else{
    return (
      <>
        <Loading/>
      </>
    )
  }
  

}

