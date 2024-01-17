import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import $ from 'jquery';

export default function Contact() {

  const firstName = useRef();
  const lastName = useRef();
  const phone = useRef();
  const email = useRef();
  const comments = useRef();

  const [notifMessage, setNotifMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emptyCommentsError, setEmptyCommentsError] = useState('')

  const validateFirstName = () => {
    if (firstName.current !== undefined && firstName.current.value !== "" && firstName.current.value !== undefined && firstName.current.value !== null && !/\s/g.test(firstName.current.value)) {
      setFirstNameError('');
      return false;
    } else {
      setFirstNameError('Please enter a valid First Name');
      return true;
    }
  }

  const validateLastName = () => {
    if (lastName.current !== undefined && lastName.current.value !== "" && lastName.current.value !== undefined && lastName.current.value !== null && lastName.current.value.trim() !== '') {
      setLastNameError('');
      return false;
    } else {
      setLastNameError('Please enter a valid Last Name');
      return true;
    }
  }

  const validateEmail = () => {
    const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.current !== undefined && email.current.value !== undefined && email.current.value !== null && pattern.test(email.current.value)) {
      setEmailError('');
      return false;
    } else {
      setEmailError('Please enter valid email');
      return true;
    }
  }

  const validatePhone = () => {
    const pattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (phone.current !== undefined && phone.current.value !== null && phone.current.value !== undefined && pattern.test(phone.current.value)) {
      setPhoneError('');
      return false;
    } else {
      setPhoneError('Please enter valid phone number');
      return true;
    }
  }

  const validateComments = () => {
    if (comments.current !== undefined && comments.current.value !== "" && comments.current.value !== null && comments.current.value !== undefined && comments.current.value.trim() !== "") {
      setEmptyCommentsError('');
      return false;
    } else {
      setEmptyCommentsError('Please enter comments');
      return true;
    }
  }

  const handleContactFormSubmit = (e) => {
    e.preventDefault();
    if(!validateFirstName() && !validateLastName() && !validateEmail() && !validatePhone() && !validateComments()){
      setLoading(true);
      axios({
        method: 'POST',
        url: 'https://dhwanitv-app-api.herokuapp.com/api/email/send-contact-email',
        data: {
          sender: email.current.value,
          recipient: 'cloud.dhwaniacademy2021@gmail.com',
          subject: `Awaiting query request from - ${firstName.current.value} ${lastName.current.value}`,
          details: {
            firstName: firstName.current.value,
            lastName: lastName.current.value,
            phone: phone.current.value,
            email: email.current.value,
            comments: comments.current.value
          }
        },
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        setLoading(false)
        if (response.data.status === "SUCCESS") {
          setNotifMessage("We've successfully received your query. Our team will get in touch with you soon.")
          $('.alert-container').addClass('d-flex');
          $('.alert-container').removeClass('d-none');
          if (window.location.pathname !== '/home') {
            window.scroll(0, 0, 0, 0);
          }
          firstName.current.value = "";
          lastName.current.value = "";
          phone.current.value = "";
          email.current.value = "";
          comments.current.value = "";
        } else if (response.data.status === "FAILURE") {
          setNotifMessage("We were unable to process your query. Please try again later.")
          $('.alert-container').addClass('d-flex');
          $('.alert-container').removeClass('d-none');
          if (window.location.pathname !== '/home') {
            window.scroll(0, 0, 0, 0);
          }
          firstName.current.value = "";
          lastName.current.value = "";
          phone.current.value = "";
          email.current.value = "";
          comments.current.value = "";
        }
      })
    }
  }
  return (
    <div className="contact" id="contact-us">
      <div className="container-fluid ">
        <div className="row">
          <div className="container-fluid d-none mb-0 px-0 alert-container"><div role="alert" className="fade alert alert-dark alert-dismissible failed-alert w-100 show mb-0"><div className="container"><div className="row justify-content-center"><i className="fa fa-times-circle-o error-close-icon close d-block d-md-none" data-dismiss="alert" /></div><div className="col-12 d-md-flex justify-content-between align-items-center"><p className="mb-0 error-message">{notifMessage}</p><i className="fa fa-times-circle-o error-close-icon close d-none d-md-block" data-dismiss="alert" /></div></div></div></div>
          <div className="col-12 px-0">
            <div className="col-12 pt-4 px-0 contact-backgroud-image">
              <div className="container">
                <div className="row mb-4">
                  <label className="col-12 text-white contact-title text-center">Reach us at...</label>
                </div>
                <div className="row">
                  <div className="col-xl-6 col-lg-6 col-md-6 contact-info">
                    <label className="text-white contact-title mb-2">Address</label><br />
                    <p className="text-white contact-info">1336 Via Del Rio,
                    <br/>Corona, CA 92882</p>
                    <label className="text-white contact-title mb-2">Email</label><br />
                    <p className="text-white contact-info">info@dhwaniacademy.net</p>
                    <label className="text-white contact-title mb-2">Mobile</label><br />
                    <p className="text-white contact-info">+1 714-455-2897</p>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 px-0">
                  <label className="col-12 text-white contact-title d-md-none d-block mt-3 mb-2">Write to us</label>
                    <div className="form-container">
                      <form onSubmit={handleContactFormSubmit}>
                        <div className="form-group name">
                          <div className="d-md-flex justify-content-between">
                            <div className="col-md-6 col-12">
                              <input type="text" className="form-control mb-md-0 mb-3" id="first-name" placeholder="Enter first name" name="first-name" ref={firstName} onBlur={validateFirstName} onChange={e => setFirstNameError('')}/>
                              {firstNameError && <small class="error-container d-flex align-items-center"><i class="fa fa-times mr-2 field-error-message"></i><p class="field-error-message mb-0">{firstNameError}</p></small>}
                            </div>
                            <div className="col-md-6 col-12">
                              <input type="text" className="form-control" id="last-name" placeholder="Enter last name" name="last-name" ref={lastName} onBlur={validateLastName} onChange={e => setLastNameError('')}/>
                              {lastNameError && <small class="error-container d-flex align-items-center"><i class="fa fa-times mr-2 field-error-message"></i><p class="field-error-message mb-0">{lastNameError}</p></small>}
                            </div>
                          </div>
                        </div>

                        <div className="form-group mb-0">
                          <div className="col-12">
                            <div className="mb-3">
                              <input type="number" className="form-control w-100 mb-1" id="phone" placeholder="Enter phone number" name="phone-number" ref={phone} onBlur={validatePhone} onChange={e => setPhoneError('')}/>
                              {phoneError && <small class="error-container d-flex align-items-center"><i class="fa fa-times mr-2 field-error-message"></i><p class="field-error-message mb-0">{phoneError}</p></small>}
                            </div>
                            <div className="mb-3">
                              <input type="email" className="form-control w-100 mb-1" id="email" aria-describedby="email" placeholder="Enter email" ref={email} onBlur={validateEmail} onChange={e => setEmailError('')}/>
                              {emailError && <small class="error-container d-flex align-items-center"><i class="fa fa-times mr-2 field-error-message"></i><p class="field-error-message mb-0">{emailError}</p></small>}
                            </div>
                            <div className="mb-4">
                              <textarea className="form-control w-100 mb-1" id="message" rows="2" placeholder="Suggestions or Comments" ref={comments} onBlur={validateComments} onChange={e => setEmptyCommentsError('')}></textarea>
                              {emptyCommentsError && <small class="error-container d-flex align-items-center"><i class="fa fa-times mr-2 field-error-message"></i><p class="field-error-message mb-0">{emptyCommentsError}</p></small>}
                            </div>
                            <button type="submit" className="btn btn-magenta col-12 col-md-6" disabled={loading}>{loading ?"Sending":"Submit"}</button>
                          </div>
                        </div>
                      </form>
                    </div>

                  </div>
                </div>
              </div>
              <div className="container-fluid mt-5">
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 px-0">
                    <div id="map-container-google-3" className="z-depth-1-half map-container-3">
                      {/* <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31291.877860410674!2d88.29394871665335!3d22.480819521660873!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x4634dd638039ecc7!2sDhwani%20Academy%20of%20Percussion%20Music!5e0!3m2!1sen!2sin!4v1617602998857!5m2!1sen!2sin" allowFullScreen="" loading="lazy"></iframe> */}
                      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.825066164147!2d-117.59705618513037!3d33.868398934843974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcc862c6578315%3A0xc9a63de449c51c1b!2s1336%20Via%20Del%20Rio%2C%20Corona%2C%20CA%2092882%2C%20USA!5e0!3m2!1sen!2sin!4v1628494872314!5m2!1sen!2sin" allowfullscreen="" loading="lazy"></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}