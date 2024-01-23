import React from 'react'

export default class Title extends React.Component {
  render () {
    return (
      <div className=''>
        <div className='text-white text-left title-padding container-fluid'>
          <label className='title-title mb-4'>Tv Dhwani</label>
          <figure class='text-end h4'>
            <blockquote class='blockquote'>
              <p className='h3'>When words leave off, music begins.</p>
            </blockquote>
            <div className=''>
              <figcaption class='blockquote-footer text-white text-xl'>
                Heinrich Heine
              </figcaption>
            </div>
          </figure>
          <a
            href='/events'
            className='btn btn-tv-home mt-5 col-xl-2 text-white col-md-4 col-6'
          >
            Upcoming events
          </a>
          {/* <a href="/tv" className="btn btn-tv-home col-xl-3 col-md-4 col-8">Watch Now</a> */}
        </div>
      </div>
    )
  }
}
