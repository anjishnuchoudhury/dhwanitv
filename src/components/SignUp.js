import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.js";
import { Link, useHistory } from "react-router-dom";
import firebase from "firebase";
import axios from 'axios';
import google from '../images/google-icon.png'
import facebook from '../images/facebook-icon.png'
import Route404 from "./Route404.js";
import Header from "./Header.js";
import Footer from "./Footer.js";
import Loading from "./Loading.js";

export default function SignUp(props) {
  const nameRef = useRef()
  const contactRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { currentUser, signup, signinwithgooglefacebook } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  const [nameRefError, setNameRefError] = useState('');
  const [contactRefError, setContactRefError] = useState('');
  const [emailRefError, setEmailRefError] = useState('');
  const [passwordRefError, setPasswordRefError] = useState('');
  const [passwordConfirmRefError, setpasswordConfirmRefError] = useState('');

  const [changeRender, setChangeRender] = useState(false);

  const validateName = () => {
    if (nameRef.current !== undefined && nameRef.current.value !== "" && nameRef.current.value !== undefined && nameRef.current.value !== null && nameRef.current.value.trim() !== "") {
      setNameRefError('');
      return false;
    } else {
      setNameRefError('Please enter a name');
      return true;
    }
  }

  const validateEmail = () => {
    const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailRef.current !== undefined && emailRef.current.value !== undefined && emailRef.current.value !== null && pattern.test(emailRef.current.value)) {
      setEmailRefError('');
      return false;
    } else {
      setEmailRefError('Please enter valid email');
      return true;
    }
  }

  const validateContact = () => {
    const pattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (contactRef.current !== undefined && (pattern.test(contactRef.current.value) || contactRef.current.value === '' || contactRef.current.value === undefined || contactRef.current.value === null)) {
      setContactRefError('');
      return false;
    } else {
      setContactRefError('Please enter valid phone number');
      return true;
    }
  }

  const validatePassword = () => {
    if (passwordRef.current !== undefined && passwordRef.current.value !== "" && passwordRef.current.value !== null && passwordRef.current.value !== undefined && !/\s/g.test(passwordRef.current.value)) {
      setPasswordRefError('');
      return false;
    } else {
      setPasswordRefError('Please enter a password');
      return true;
    }
  }

  const validateConfirmPassword = () => {
    if (passwordConfirmRef.current !== undefined && passwordConfirmRef.current.value !== "" && passwordConfirmRef.current.value !== null && passwordConfirmRef.current.value !== undefined && !/\s/g.test(passwordConfirmRef.current.value && (passwordRef.current.value !== passwordConfirmRef.current.value))) {
      if (passwordRef.current.value !== passwordConfirmRef.current.value) {
        setpasswordConfirmRefError('Please enter the same password.');
        return true;
      } else {

        setpasswordConfirmRefError('');
        return false;
      }
    }
    else {
      setpasswordConfirmRefError('Please confirm the password');
      return true;
    }
  }


  async function handleSubmit(e) {
    e.preventDefault()
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }
    if(!validateName() && !validateEmail() && !validatePassword() && !validateConfirmPassword() && !validateContact()){
      try {
        setError("")
        setLoading(true)
        signup(emailRef.current.value, passwordRef.current.value, nameRef.current.value, contactRef.current.value).then(() => {
          history.push('/')
        })
      } catch (error) {
        setError(error.code)
      }
      setLoading(false)
    }
  }
  async function hangleGoogleLogin(e) {
    e.preventDefault();
    setError("")
    setLoading(true)
    try {
      await signinwithgooglefacebook(new firebase.auth.GoogleAuthProvider());
      history.push('/')
    } catch (error) {

    }
    setLoading(false)
  }
  async function handleFacebookLogin(e) {
    e.preventDefault();
    setError("")
    setLoading(true)
    try {
      await signinwithgooglefacebook(new firebase.auth.FacebookAuthProvider());
      history.push('/')
    } catch (error) {

    }
    setLoading(false)
  }

  useEffect(() => {
    if(currentUser !== null && currentUser !== undefined){
      setTimeout(() => {
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
                <a href='/signup' className="text-white text-right">Sign Up</a>
                <br />
                <hr className="mt-0 d-inline-block mx-auto full-golden-line" />
              </div>
              <div className="mx-5">
                <Link to={{ pathname: "/signin", destination: { showHomePage: true } }} className="text-white">Sign In</Link>
              </div>
            </div>
            {error && <div className="container d-flex mb-md-3"><div role="alert" className="fade alert alert-danger w-100 mx-md-2 show">{error}</div></div>}
            <div className="row justify-centent-center">
              <div className="col-12 px-md-3 px-5">
                <form onSubmit={handleSubmit} id="customer-details-form">
                  <div className="row justify-content-center mb-3" id="email">
                    <label htmlFor="name" className="text-white col-12 col-md-10 px-0">Name</label>
                    <input name="name" type="text" className="col-12 col-md-10 px-3" ref={nameRef} onBlur={validateName} onChange={e => setNameRefError('')} />
                    {nameRefError && <small class="col-12 col-md-10 px-0 error-container d-flex align-items-center"><i class="fa fa-times mr-2 field-error-message"></i><p class="field-error-message mb-0">{nameRefError}</p></small>}
                  </div>
                  <div className="row justify-content-center mb-3" id="email">
                    <label htmlFor="email" className="text-white col-12 col-md-10 px-0">Email</label>
                    <input name="email" type="email" className="col-12 col-md-10 px-3" ref={emailRef} onBlur={validateEmail} onChange={e => setEmailRefError('')} />
                    {emailRefError && <small class="col-12 col-md-10 px-0 error-container d-flex align-items-center"><i class="fa fa-times mr-2 field-error-message"></i><p class="field-error-message mb-0">{emailRefError}</p></small>}
                  </div>
                  <div className="row justify-content-center mb-3" id="contact">
                    <label htmlFor="contact" className="col-12 col-md-10 text-white px-0">Contact number</label>
                    <input name="contact" type="tel" className="col-12 col-md-10 px-3" ref={contactRef} onBlur={validateContact} onChange={e => setContactRefError('')} />
                    {contactRefError && <small class="col-12 col-md-10 px-0 error-container d-flex align-items-center"><i class="fa fa-times mr-2 field-error-message"></i><p class="field-error-message mb-0">{contactRefError}</p></small>}
                  </div>
                  <div className="row justify-content-center mb-3" id="password">
                    <label htmlFor="password" className="col-12 col-md-10 text-white px-0">Password</label>
                    <input name="password" type="password" className="col-12 col-md-10 px-3" ref={passwordRef} onBlur={validatePassword} onChange={e => setPasswordRefError('')} />
                    {passwordRefError && <small class="col-12 col-md-10 px-0 error-container d-flex align-items-center"><i class="fa fa-times mr-2 field-error-message"></i><p class="field-error-message mb-0">{passwordRefError}</p></small>}
                  </div>
                  <div className="row justify-content-center mb-3" id="confirm-password">
                    <label htmlFor="confirm-password" className="col-12 col-md-10 text-white px-0">Confirm Password</label>
                    <input name="confirm-password" type="password" className="col-12 col-md-10 px-3" ref={passwordConfirmRef} onBlur={validateConfirmPassword} onChange={e => setpasswordConfirmRefError('')} />
                    {passwordConfirmRefError && <small class="col-12 col-md-10 px-0 error-container d-flex align-items-center"><i class="fa fa-times mr-2 field-error-message"></i><p class="field-error-message mb-0">{passwordConfirmRefError}</p></small>}
                  </div>
                  <div className="row justify-content-center mb-3" id="confirm-terms-conditions">
                    <small className="col-12 col-md-10 text-white px-0">By signing up, you are agreeing to our <a href="terms-and-conditions">Terms and conditions</a></small>
                  </div>
                  <div className="row justify-content-center mt-4">
                    <button disabled={loading} className="btn btn btn-golden col-md-6 col-12" type="submit">Sign up</button>
                  </div>
                </form>
                <div className="row d-flex flex-column p-md-4 py-4 px-0">
                  <hr className="white-line mx-0" />
                  <label className="text-white hr-divider-text">OR</label>
                </div>
                <form onSubmit={hangleGoogleLogin}>
                  <div className="row justify-content-center mb-4 mt-4 mt-mb-5">
                    <button disabled={loading} className="btn btn-login-google col-12 col-md-10" type="submit"><img src={google} className="float-left google-icon"/>Sign up with Google</button>
                  </div>
                </form>
                <form onSubmit={handleFacebookLogin}>
                  <div className="row justify-content-center mb-4 mt-4 mt-mb-5">
                    <button disabled={loading} className="btn  btn-login-google col-12 col-md-10" type="submit"><img src={facebook} className="float-left google-icon"/>Sign up with Facebook</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <p className="w-100 text-center mt-4">Already have an account? <a href="/signin">Sign In</a></p>
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