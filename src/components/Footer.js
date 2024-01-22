import React from 'react'

export default class Footer extends React.Component {
  render () {
    return (
      <>
        <footer
          className='footer-bg text-center text-white'
          id={this.props.footer}
        >
          <div className='container footerdimensions'>
            <div className='contact-info'>
              <h1
                className='font-weight-bold text-sm-10 line-height-2 appear-animation'
                data-appear-animation='fadeInUpShorter'
                data-appear-animation-delay='200'
              >
                Contact Info
              </h1>
              <p
                className='lead px-0 mb-0 appear-animation text-sm-5 textSize text-style'
                data-appear-animation='fadeInUpShorter'
                data-appear-animation-delay='300'
              >
                Email :{' '}
                <strong className='text-dark'>info@dhwaniacademy.net</strong>
              </p>
              <p
                className='lead px-0 mb-0 appear-animation text-sm-5 textSize text-style'
                data-appear-animation='fadeInUpShorter'
                data-appear-animation-delay='300'
              >
                Phone : <strong className='text-dark'>+1 714-455-2897</strong>
              </p>
            </div>
            <div className='col-6 col-lg-2 mb-5 mb-lg-0 text-sm-4 d-flex flex-column justify-content-center align-start'>
              <ul className='list-style'>
                <li className='li-elem'>
                <i className='fa fa-angle-right'></i>
                  <a
                    href='https://www.facebook.com/tvdhwani'
                    className='link-hover-style-1 text-white ms-1'
                    target='_blank'
                  >
                    {' '}
                    Facebook
                  </a>
                </li>
                <li className='li-elem'>
                <i className='fa fa-angle-right'></i>
                  <a
                    href='https://www.instagram.com/tvdhwani'
                    className='link-hover-style-1 text-white ms-1'
                    target='_blank'
                  >
                    {' '}
                    Instagram
                  </a>
                </li>
                <li className='li-elem'>
                <i className='fa fa-angle-right'></i>
                  <a
                    href='https://www.instagram.com/dhwaniacademy/?hl=en'
                    className='link-hover-style-1 text-white ms-1'
                  >
                    {' '}
                    Youtube
                  </a>
                </li>
                <li className='li-elem'>
                <i className='fa fa-angle-right'></i>
                  <a
                    href='https://tvdhwani.com/home'
                    className='link-hover-style-1 text-white ms-1'
                  >
                    {' '}
                    Google
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='text-center p-3 footer-bg'>
            <label>© 2024 Copyright&nbsp;:&nbsp;</label>
            <a
              className='text-white footer-copyright-content'
              href='https://www.dhwaniacademy.in/'
            >
              TV Dhwani
            </a>
          </div>
        </footer>
      </>
    )
  }
}
