import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.js";
import { useHistory } from "react-router-dom";
import firebase from "firebase/app";
import google from '../images/google-icon.png'
import facebook from '../images/facebook-icon.png'
import Header from "./Header.js";
import Footer from "./Footer.js";
import Loading from "./Loading.js";
import Route404 from "./Route404.js";

export default function Login(props) {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { currentUser, signin, signinwithgooglefacebook } = useAuth();
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const [changeRender, setChangeRender] = useState(false);

    async function handleSubmit(e) {
      e.preventDefault();
      if(!validateEmail() && !validatePassword()){
        try {
          setError("")
          setLoading(true)
          await signin(emailRef.current.value, passwordRef.current.value)
          if(props.location.destination !== undefined && props.location.destination !== null){
            if(props.location.destination.showEventList){
              history.push({pathname: '/show-event', event: props.location.destination.event});
            }else if(props.location.destination.showHomePage){
              history.push({pathname: '/home'});
            }
          }else{
            history.goBack();
          }
        } catch(error) {
            switch(error.code){
              case "auth/invalid-email":
                setError("The email seems to be invalid. Please try again.")
                break;
              case "auth/wrong-password":
                setError("The password seems to be incorrect. Please try again.")
                break;
              case "auth/user-not-found":
                setError("The requested user is not found. Please try to sign up.")
                break;
              case "auth/user-disabled":
                setError("Sorry, the requested user has been disabled. Please contact us for further queries.")
                break;
              default:
                setError("Oops, we are not able to log you in at the moment. Please try again later.");
            }
        }
      }
      
      setLoading(false)
  }
  async function hangleGoogleLogin(e){
    e.preventDefault();
    setError("")
    setLoading(true)
    try{
      await signinwithgooglefacebook(new firebase.auth.GoogleAuthProvider());
      if(props.location.destination !== undefined && props.location.destination !== null){
        if(props.location.destination.showEventList){
          history.push({pathname: '/show-event', event: props.location.destination.event});
        }else if(props.location.destination.showHomePage){
          history.push({pathname: '/home'});
        }
      }else{
        history.goBack();
      }
    }catch(error){
      switch(error.code){
        case "auth/account-exists-with-different-credential":
          setError("The account seems to exists with a different credential.")
          break;
        case "auth/cancelled-popup-request":
          setError("Oops! You've cancelled the authorization request. Please try again.")
          break;
        case "auth/operation-not-allowed":
          setError("Oops! This operation is not allowed at the moment. Please try again later.")
          break;
        case "auth/operation-not-supported-in-this-environment":
          setError("Oops! This operation is not allowed at the moment. Please try again later.")
          break;
        case "auth/popup-blocked":
          setError("Oops! You've blocked pop-ups. Please try again after enabling pop-ups.")
          break;
        case "auth/popup-closed-by-user":
          setError("Oops! You've cancelled the authorization request. Please try again.")
          break;
        default:
          setError("Oops, we are not able to log you in at the moment. Please try again later.");
      }
    }
    setLoading(false)
  }
  async function handleFacebookLogin(e){
    e.preventDefault();
    setError("")
    setLoading(true)
    try{
      await signinwithgooglefacebook(new firebase.auth.FacebookAuthProvider());
      if(props.location.destination !== undefined && props.location.destination !== null){
        if(props.location.destination.showEventList){
          history.push({pathname: '/show-event', event: props.location.destination.event});
        }else if(props.location.destination.showHomePage){
          history.push({pathname: '/home'});
        }
      }else{
        history.goBack();
      }
    }catch(error){
      switch(error.code){
        case "auth/account-exists-with-different-credential":
          setError("The account seems to exists with a different credential.")
          break;
        case "auth/cancelled-popup-request":
          setError("Oops! You've cancelled the authorization request. Please try again.")
          break;
        case "auth/operation-not-allowed":
          setError("Oops! This operation is not allowed at the moment. Please try again later.")
          break;
        case "auth/operation-not-supported-in-this-environment":
          setError("Oops! This operation is not allowed at the moment. Please try again later.")
          break;
        case "auth/popup-blocked":
          setError("Oops! You've blocked pop-ups. Please try again after enabling pop-ups.")
          break;
        case "auth/popup-closed-by-user":
          setError("Oops! You've cancelled the authorization request. Please try again.")
          break;
        default:
          setError("Oops, we are not able to log you in at the moment. Please try again later.");
      }
    }
    setLoading(false)
  }
  const validateEmail = () => {
    const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailRef.current !== undefined && emailRef.current.value !== undefined && emailRef.current.value !== null && pattern.test(emailRef.current.value)) {
      setEmailError('');
      return false;
    } else {
      setEmailError('Please enter valid email');
      return true;
    }
  }
  const validatePassword = () => {
    if (passwordRef.current !== undefined && passwordRef.current.value !== "" && passwordRef.current.value !== undefined && passwordRef.current.value !== null && !/\s/g.test(passwordRef.current.value)) {
      setPasswordError('');
      return false;
    } else {
      setPasswordError('Please enter a password');
      return true;
    }
  }
  useEffect(() => {
    if(currentUser !== null && currentUser !== undefined){
      setTimeout(() => {
        console.log("Render changed.")
        setChangeRender(true);
      }, 3000)
    }
  })
  if(currentUser === null || currentUser === undefined){
    return (
      <div>
        <div className="container ">
          <div className="col-md-7 col-lg-5 col-12 mx-auto login-black-container py-5 mt-5">
            <div className="container d-flex mb-md-3">
              <div className="px-md-2">
                <a href="/signin" className="text-white">Sign In</a>
                <br/>
                <hr className="mt-0 d-inline-block mx-auto full-golden-line"/>
              </div>
              <div className="mx-5">
                <a href='/signup' className="text-white text-right">Sign Up</a>
              </div>
            </div>
            {error && <div className="container d-flex mb-md-3"><div role="alert" className="fade alert alert-danger w-100 mx-md-2 show">{error}</div></div>}
            <div className="row justify-centent-center">
              <div className="col-12 px-md-3 px-5">
                <form onSubmit={handleSubmit}>
                  <div className="row justify-content-center mb-3" id="email">
                    <label htmlFor="email" className="text-white col-12 col-md-10 px-0">Email</label>
                    <input name="email" type="email" className="col-12 col-md-10 px-3" ref={emailRef} onBlur={validateEmail} onChange={e => setEmailError('')}/>
                    {emailError && <small className="col-12 col-md-10 px-0 error-container d-flex align-items-center"><i className="fa fa-times mr-2 field-error-message"></i><p className="field-error-message mb-0">{emailError}</p></small>}
                  </div>
                  <div className="row justify-content-center mb-3" id="password">
                    <label htmlFor="password" className="col-12 col-md-10 text-white px-0">Password</label>
                    <input name="password" type="password" className="col-12 col-md-10 px-3" ref={passwordRef} onBlur={validatePassword} onChange={e => setPasswordError('')}/>
                    {passwordError && <small className="col-12 col-md-10 px-0 error-container d-flex align-items-center"><i className="fa fa-times mr-2 field-error-message"></i><p className="field-error-message mb-0">{passwordError}</p></small>}
                  </div>
                  <div className="row justify-content-center mb-4 mt-4 mt-mb-5">
                    <button disabled={loading} className="btn btn btn-golden col-md-6 col-12" type="submit">Sign In</button>
                  </div>
                </form>
                <div className="w-100 text-center mt-3">
                  <a href="/forgot-password" className="text-white">Forgot Password?</a>
                </div>
                <div className="row d-flex flex-column p-md-4 py-4 px-0">
                  <hr className="white-line mx-0" /> 
                  <label className="text-white hr-divider-text">OR</label>
                </div>
                <form onSubmit={hangleGoogleLogin}>
                  <div className="row justify-content-center mb-4 mt-4 mt-mb-5">
                    <button disabled={loading} className="btn btn-login-google col-12 col-md-10" type="submit"><img src={google} className="float-left google-icon pt-1"/>Sign in with Google</button>
                  </div>
                </form>
                <form onSubmit={handleFacebookLogin}>
                  <div className="row justify-content-center mb-4 mt-4 mt-mb-5">
                    <button disabled={loading} className="btn btn-login-google col-12 col-md-10" type="submit"><img src={facebook} className="float-left google-icon pt-1"/>Sign in with Facebook</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <p className="w-100 text-center mt-4">Need an account? <a href="/signup">Sign Up</a></p>
        </div>
      </div>
    )
  }else{
    if(changeRender){
      console.log("Routing 404")
      return(
        <Route404/>
      )
    }else{
      console.log("Routing loading")
      return(
        <>
          <Header/>
          <Loading/>
          <Footer footer="fixed-footer"/>
        </>
      )
    }
  }
  
}