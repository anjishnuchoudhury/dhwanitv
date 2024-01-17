import React, { useRef, useState } from 'react';
import { useAuth } from "../context/AuthContext.js";

export default function ForgotPassword(props){
    const emailRef = useRef();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [emailError, setEmailError] = useState('')
    const [loading, setLoading] = useState(false);

    const { resetPassword } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        if(!validateEmail()){
            try {
                setError("");
                setMessage("");
                setLoading(true);
                await resetPassword(emailRef.current.value);
                setMessage("Password reset link has been succesfully sent to your registered mailbox.")
            } catch(error) {
                switch(error.code){
                case "auth/invalid-email":
                    setError("Please enter a valid email id")
                    break;
                case "auth/user-not-found":
                    setError("We haven't found any user with the entered email. Please sign up to continue.")
                    break;
                default:
                    setError("Oops, we are not able to log you in at the moment");
                }
            }
            setLoading(false)
        }
        
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
    return(
        <div>
            <div className="container ">
                <div className="col-md-7 col-lg-5 col-12 mx-auto login-black-container py-5 mt-5">
                    <div className="container d-flex mb-md-3">
                        <div className="px-md-2">
                        <a href="/forgot-password" className="text-white">Password Reset</a>
                        <br/>
                        <hr className="mt-0 d-inline-block mx-auto full-golden-line"/>
                        </div>
                        <div className="mx-5">
                        <a href='/signin' className="text-white text-right">Sign In</a>
                        </div>
                    </div>
                    {error && <div className="container d-flex mb-md-3"><div role="alert" className="fade alert alert-danger w-100 mx-md-2 show">{error}</div></div>}
                    {message && <div className="container d-flex mb-md-3"><div role="alert" className="fade alert alert-success w-100 mx-md-2 show">{message}</div></div>}
                    <div className="row justify-centent-center">
                        <div className="col-12 px-md-3 px-5">
                            <form onSubmit={handleSubmit}>
                                <div className="row justify-content-center mb-5" id="email">
                                    <label htmlFor="email" className="text-white col-12 col-md-10 px-0">Email</label>
                                    <input name="email" type="email" className="col-12 col-md-10 px-3" ref={emailRef} onBlur={validateEmail}  onChange={e => setEmailError('')}/>
                                    {emailError && <small className="col-12 col-md-10 px-0 error-container d-flex align-items-center"><i className="fa fa-times mr-2 field-error-message"></i><p className="field-error-message mb-0">{emailError}</p></small>}
                                </div>
                                <div className="row justify-content-center mt-4 ">
                                    <button disabled={loading} className="btn btn btn-golden col-md-6 col-12" type="submit">Reset Password</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <p className="w-100 text-center mt-4">Need an account? <a href="/signup">Sign Up</a></p>
            </div>
        </div>
    )
}