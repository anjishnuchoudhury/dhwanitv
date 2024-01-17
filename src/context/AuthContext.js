import React, { useContext, useState, useEffect } from "react";
import firebaseAppConfig from "../config/firebaseConfig";
import axios from 'axios';

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [authenticatedCustomer, setAuthenticatedCustomer] = useState();
  const [loading, setLoading] = useState(true);

  async function signup(email, password, name, contact) {
    await firebaseAppConfig.auth().createUserWithEmailAndPassword(email, password).then((user) => {
      createUser(user.user, name, email, contact);
    })
  }

  async function createUser(user, name, email, contact){
    let wishlist = [];
    if(user){
      console.log("Inside create user.");
      if(user.displayName === null || user.displayName === undefined){
        user.updateProfile({
          displayName: name
        })
        console.log("User profile name updated")
      }
      const userRef = firebaseAppConfig.firestore().doc(`users/${user.uid}`)
      const userDetails = await userRef.get();
      if(!userDetails.exists){ 
        console.log("User details does not exist")
        try{
          userRef.set({
            name,
            email,
            contact,
            wishlist,
            createdAt: new Date()
          }).then(() => {
            console.log("Added user details")
            sendWelcomeMail(name, email).then(() => {
              console.log("Welcome email sent successfully.")
            })
          })
        }catch(error){
          console.log("User details could not be added")
          console.log(error)
        }
      }
    }
  }
  async function getUser(user){
    if(user){
      const userRef = firebaseAppConfig.firestore().doc(`users/${user.uid}`)
      const userDetails = await userRef.get();
      if(userDetails.exists){
        return userDetails.data();
      }
    }
  }
  async function addTickets(user, event, paymentID, date, time){
    if(user){
      const userRef = firebaseAppConfig.firestore().doc(`users/${user.uid}`)
      const userDetails = await userRef.get();
      if(userDetails.exists){
        const prevRegistration = userDetails.data().registeredFor;
        var eventAlreadyRegistered = false;
        if(prevRegistration !== undefined && prevRegistration !== null){
          prevRegistration.forEach((eventRegistered => {
            if(eventRegistered.eventID === event.id){
              eventAlreadyRegistered = true;
            }
          }))
          if(!eventAlreadyRegistered){
            prevRegistration.push({eventID: event.ID, eventName: event.title, registrationID: paymentID, registrationDate: new Date()})
            try{
              userRef.set({
                registeredFor: prevRegistration,
                modifiedAt: new Date()
              },{ merge: true }).then(() => {
                sendEmailTickets(user.displayName, user.email, event, date, time);
              })
            }catch(error){
              console.log(error)
            }
          }else{
            console.log("You have already registered for the event")
          }
        }else{
          try{
            userRef.set({
              registeredFor: [{eventID: event.ID, eventName: event.title, registrationID: paymentID, registrationDate: new Date()}],
              modifiedAt: new Date()
            },{ merge: true })
          }catch(error){
            console.log(error)
          }
        }
      }
    }
  }
  async function addToWishList(user, event){
    if(user){
      const userRef = firebaseAppConfig.firestore().doc(`users/${user.uid}`)
      const userDetails = await userRef.get();
      let wishAlreadyAdded = false;
      if(userDetails.exists){
        const wishlist = userDetails.data().wishlist;
        if(wishlist !== undefined && wishlist !== null){
          wishlist.forEach((wish) => {
            if(wish.eventId === event.ID){
              wishAlreadyAdded = true
            }
          })
          if(!wishAlreadyAdded){
            wishlist.push({eventID: event.ID, eventName: event.title})
            try{
              userRef.set({
                wishlist: wishlist,
                modifiedAt: new Date()
              },{ merge: true }).then(() => {
                console.log("Event has been added to wishlist")
              })
            }catch(error){
              console.log(error)
            }
          } 
        }else{
          try{
            userRef.set({
              wishlist: [{eventID: event.ID, eventName: event.title}],
              modifiedAt: new Date()
            },{ merge: true }).then(() => {
              console.log("Wishlist created and event has been added")
            })
          }catch(error){
            console.log(error)
          }
        }
      }
    }
  }
  async function updateContact(user, contact){
    if(user){
      const userRef = firebaseAppConfig.firestore().doc(`users/${user.uid}`)
      const userDetails = await userRef.get();
      if(userDetails.exists){
        try{
          userRef.set({
            contact,
            modifiedAt: new Date()
          },{ merge: true })
        }catch(error){
          console.log(error)
        }
      }
    }
  }
  function removeUserDetailsOnLogout(){
    setAuthenticatedCustomer(null);
  }
  async function signin(email, password) {
    return await firebaseAppConfig.auth().signInWithEmailAndPassword(email, password);
  }
  async function signinwithgooglefacebook(provider) {
    await firebaseAppConfig.auth().signInWithPopup(provider).then((result) => {
      createUser(result.user, result.user.displayName, result.user.email, result.user.phoneNumber);
    })
  }

  async function sendWelcomeMail(name, email){
    axios({
      method: 'POST',
      url: 'https://dhwanitv-app-api.herokuapp.com/api/email/send-welcome-email',
      // url: 'http://localhost:5000/api/email/send-welcome-email',
      data: {
          sender: '"Dhwani TV" <cloud.dhwaniacademy2021@gmail.com>',
          recipient: email,
          subject: 'Welcome to TV Dhwani',
          details: {
              name: name,
              email: email
          }
      },
      headers: {
      Accept: "application/json",
      'Content-Type': 'application/json'
      }
    }).then(() => {
      console.log("Welcome email triggered.")
    }).catch((error) => {
      console.log(error);
    })
  }

  async function sendEmailTickets(name, email, event, date, time){
    // Details to be added.
    axios({
      method: 'POST',
      url: 'https://dhwanitv-app-api.herokuapp.com/api/email/send-ticket-email',
      // url: 'http://localhost:5000/api/email/send-ticket-email',
      data: {
          sender: '"Dhwani TV" <cloud.dhwaniacademy2021@gmail.com>',
          recipient: email,
          subject: 'Congratulations! We\'ve reserved your seat.',
          details: {
              name: name,
              event: event,
              date: date,
              time: time
          }
      },
      headers: {
      Accept: "application/json",
      'Content-Type': 'application/json'
      }
    }).then(() => {
      console.log("Event email triggered.")
    }).catch((error) => {
      console.log(error);
    })
  }

  function logout() {
    return firebaseAppConfig.auth().signOut()
  }

  function resetPassword(email) {
    return firebaseAppConfig.auth().sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  useEffect(() => {
    const unsubscribe = firebaseAppConfig.auth().onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
      getUser(user).then((result) => {
        setAuthenticatedCustomer(result)
      })
    })
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    authenticatedCustomer,
    signin,
    signinwithgooglefacebook,
    createUser,
    getUser,
    addTickets,
    addToWishList,
    signup,
    logout,
    removeUserDetailsOnLogout,
    resetPassword,
    sendWelcomeMail,
    updateEmail,
    updatePassword,
    updateContact
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
