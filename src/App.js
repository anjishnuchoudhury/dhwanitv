import React from 'react';
import { AuthProvider } from "./context/AuthContext.js";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import PrivateRoute from './components/PrivateRoute.js';
import Signin from "./components/Login.js";
import Signup from "./components/SignUp.js";
import Home from './components/Home.js';
import Event from './components/Event.js';
import DhwaniTvPage from './components/DhwaniTvPage.js';
import AllEvents from './components/AllEvents.js'
import AllPastEvents from './components/AllPastEvents.js'
import ViewEvent from './components/ViewEvent.js';
// import Gallery from './components/Gallery';
import MysticMonsoonWrapper from './components/events/MysticMonsoon/MysticMonsoonWrapper';
import PratidhwaniWrapper from './components/events/Pratidhwani/PratidhwaniWrapper';
import RaagaAndRhythmWrapper from './components/events/RaagaAndRhythm/RaagaAndRhythmWrapper';

import ContactUs from './components/ContactUs.js';
import Route404 from './components/Route404.js';
import ComingSoon from './components/ComingSoon.js';
import BookForArtist from './components/BookForArtist.js';
import ForgotPassword from './components/ForgotPassword.js';
import Terms from './components/Terms.js';
import MyEvents from './components/MyEvents.js';
import LoadingWrapper from './components/LoadingWrapper.js';


const App = () => {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Switch>
            <Route path="/" exact>
                <Redirect to="/home"/>
            </Route>
            <Route path="/home" component={Home}></Route>
            <Route path="/forgot-password" component={ForgotPassword}></Route>
            <Route path="/events" component={AllEvents}></Route>
            <Route path="/past-events" component={AllPastEvents}></Route>
            <Route path="/guest/view-event" component={ViewEvent} />
            {/* <Route path="/gallery" component={Gallery}></Route> */}

            <Route path="/mystic-monsoon" component={MysticMonsoonWrapper} />
            <Route path="/pratidhwani" component={PratidhwaniWrapper} />
            <Route path="/raaga-and-rhythm" component={RaagaAndRhythmWrapper} />
          
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute path="/update-profile" component="" />
            <PrivateRoute path="/view-event" component={ViewEvent} />
            <PrivateRoute path="/tv" component={DhwaniTvPage}>
              <Redirect to="/coming-soon"/>
            </PrivateRoute>
            <Route path="/signup" component={Signup} />
            <Route path="/signin" render={(props) => (
              <Signin {...props}/>
            )} />
            <Route path="/signOut" component={Signin} />
            <Route path="/show-event" render={(props) => (
              <Event {...props}/>
            )}/>
            <Route path="/my-events" component={MyEvents} />
            <Route path="/terms-and-conditions" component={Terms}/>
            <Route path="/contact-us" component={ContactUs} />
            <Route path="/coming-soon" component={ComingSoon} />
            <Route path="/event/admin/book-for-artist" component={BookForArtist}/>
            <Route path="/redirecting" component={LoadingWrapper} />
            <Route path="*" component={Route404} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  )
}
export default App;