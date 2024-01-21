import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.js'
import $ from 'jquery'
import { useHistory } from 'react-router-dom'
import dhwaniLogo from '../images/dhwani-logo.png'

const Header = () => {
  const [error, setError] = useState('')
  const { currentUser, logout, removeUserDetailsOnLogout, getUser } = useAuth()
  const history = useHistory()
  const [initials, setInitials] = useState('DT')
  const [fullName, setFullName] = useState('DhwaniTV Viewer')
  var abv = ''

  const createInitials = () => {
    if (currentUser) {
      if (currentUser.displayName) {
        setAbbr(currentUser.displayName)
      } else {
        getUser(currentUser).then(user => {
          user && user.name !== '' && user.name !== undefined ? (
            setAbbr(user.name)
          ) : (
            <></>
          )
        })
      }
    }
  }
  const setAbbr = name => {
    var parts = name.split(' ')
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].length > 0 && parts[i] !== '') {
        abv += parts[i][0].toUpperCase()
      }
    }
    setInitials(abv.substr(0, 2))
    setFullName(name)
  }
  async function handleLogout () {
    setError('')
    try {
      await logout()
      removeUserDetailsOnLogout()
      history.push('/signOut')
    } catch {
      setError('Failed to log out')
    }
  }
  useEffect(() => {
    createInitials()
    var windowSize = window.matchMedia('(max-width: 1024px)')
    removeMobileHeader(windowSize)
    windowSize.addListener(removeMobileHeader)
    $('.mobile-dropdown-header').hide()
    $('.show-header-dropdown').on('click', function () {
      $('.mobile-dropdown-header').slideToggle('fast')
      $('.mobile-navbar').removeClass('navbar-box-shadow')
    })
    $('.mob-nav-link').on('click', function () {
      $('.mobile-dropdown-header').hide()
    })
  }, [])
  function removeMobileHeader (windowSize) {
    if (!windowSize.matches) {
      $('.mobile-dropdown-header').hide()
    }
  }
  return (
    <div className='header-background'>
      <div className='container'>
        {/* desktop menu */}
        <div className='row align-items-center d-lg-flex d-none'>
          <div className='col-xl-2 col-lg-2 col-md-2'>
            <a href='/home'>
              <img
                src={dhwaniLogo}
                alt='Dhwani_Logo'
                className='w-100 pt-2 pb-4'
              />
            </a>
          </div>
          <div className='col-xl-7 col-lg-8 col-md-8 pt-1'>
            <div className='row justify-content-end'>
              <div className='col-md-1 px-0 text-center'>
                <a href='/home' className='header-nav-link'>
                  Home
                </a>
              </div>
              {/* <div className="col-xl-2 col-lg-2 col-md-2 px-0 text-center">
                <a href="/about" className="header-nav-link">About us</a>
              </div> */}
              {/* <div className="col-md-3 px-0 text-center">
                <a href="/events" className="header-nav-link">Upcoming Events</a>
              </div> */}
              <div className='col-md-2 px-0 text-center'>
                <a href='/past-events' className='header-nav-link'>
                  Events
                </a>
              </div>
              {/* <div className="col-md-2 px-0 text-center">
                <a href="/tv" className="header-nav-link">Live TV</a>
              </div> */}
              {/* <div className="col-xl-2 col-lg-2 col-md-2 px-0 text-center">
                <a href="/gallery" className="header-nav-link">Gallery</a>
              </div> */}
              {/* <div className="col-xl-2 col-lg-2 col-md-2 px-0 text-center">
                <a href="/contact-us" className="header-nav-link">Contact Us</a>
              </div> */}
            </div>
          </div>
          <div className='col-xl-3 col-lg-2 col-md-2'>
            {currentUser ? (
              <div className='d-flex align-items-center justify-content-start'>
                <div className='dropdown'>
                  <button
                    className='btn mb-0 dropdown-toggle profile-btn'
                    type='button'
                    data-toggle='dropdown'
                    aria-haspopup='true'
                    aria-expanded='false'
                  >
                    {initials}
                  </button>
                  <div
                    class='dropdown-menu'
                    aria-labelledby='dropdownMenuButton'
                  >
                    {/* <span class='profile-name-dropdown d-xl-none'>
                      <small>
                        Logged in as:
                        <br />
                      </small>
                      {fullName}
                    </span> */}
                    {/* <a class="dropdown-item" href="#">Another action</a> */}
                    <div class='dropdown-divider d-xl-none'></div>
                    <a class='dropdown-item dropdown-hover cursor-pointer' href='/my-events'>
                      My events
                    </a>
                    <a
                      class='dropdown-item dropdown-hover cursor-pointer'
                      href='/my-watchlist'
                    >
                      My Watchlist
                    </a>
                    <a
                      class='dropdown-item dropdown-hover cursor-pointer'
                      onClick={handleLogout}
                    >
                      Logout
                    </a>
                  </div>
                </div>
                {/* <div className='d-xl-block d-none text-white'>
                  <span className=''>
                    <small>
                      Logged in as:
                      <br />
                    </small>
                    {fullName}
                  </span>
                </div> */}
              </div>
            ) : (
              <a href='/signin' className='btn text-white btn-signin'>
                Sign In
              </a>
            )}
          </div>
        </div>

        {/* mobile view  */}
        <div className='align-items-center justify-content-between d-lg-none d-flex'>
          <a href='/home'>
            <img
              src={dhwaniLogo}
              alt='Dhwani_Logo'
              className='header-mob-logo pt-3'
            />
          </a>
          <i className='fa fa-bars show-header-dropdown text-white' />
        </div>
        <div className='row col-12 mobile-dropdown-header ml-0'>
          <ul className='navbar-nav col-12 px-0'>
            <li className='nav-item mx-1'>
              <a className='nav-link mob-nav-link text-white' href='/home'>
                Home
              </a>
            </li>
            {currentUser ? (
              <li className='nav-item mx-1'>
                <a
                  className='nav-link mob-nav-link text-white'
                  href='/my-events'
                >
                  My Events
                </a>
                <a
                  className='nav-link mob-nav-link text-white'
                  href='/my-watchlist'
                >
                  My Watchlist
                </a>
              </li>
            ) : (
              <></>
            )}
            {/* <li className="nav-item mx-1"><a className="nav-link mob-nav-link text-white" href="/about">About us</a></li> */}
            {/* <li className="nav-item mx-1"><a className="nav-link mob-nav-link text-white" href="/events">Upcoming Events</a></li> */}
            <li className='nav-item mx-1'>
              <a
                className='nav-link mob-nav-link text-white'
                href='/past-events'
              >
                Events
              </a>
            </li>
            {/* <li className="nav-item mx-1"><a className="nav-link mob-nav-link text-white" href="/tv">Live TV</a></li> */}
            {/* <li className="nav-item mx-1"><a className="nav-link mob-nav-link text-white" href="/gallery">Gallery</a></li> */}
            {/* <li className="nav-item mx-1"><a className="nav-link mob-nav-link text-white" href="/contact-us">Contact us</a></li> */}
            {/* {currentUser ? (
              <li className='nav-item mx-1 text-white text-center'>
                <span className=''>
                  <small>Logged in as: {fullName}</small>
                </span>
              </li>
            ) : (
              <></>
            )} */}
            <li className='nav-item mx-1 text-center mt-1 mb-3'>
              {currentUser ? (
                <p
                  className='btn text-white btn-signin col-12 mb-0'
                  onClick={handleLogout}
                >
                  Logout
                </p>
              ) : (
                <a href='/signin' className='btn text-white btn-signin col-12'>
                  Sign In
                </a>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
export default Header
