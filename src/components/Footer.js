import React from 'react';

export default class Footer extends React.Component{
  render(){
    return(
      <>
        <footer className="footer-bg-blue text-center text-white" id={this.props.footer}>
          <div className="container p-4 pb-0">
            <section>
              <a className="btn btn-outline-light btn-floating m-1" href="https://www.facebook.com/tvdhwani" role="button"
                ><i className="fa fa-facebook-f"></i
              ></a>
              <a className="btn btn-outline-light btn-floating m-1" href="https://www.google.com/search?q=tv+dhwani&sxsrf=ALiCzsYITAxDKpwhuirKkyCwkT6dPYZ_8w%3A1656563473517&ei=ESe9YsecH9antAbi_rGICA&oq=tv+d&gs_lcp=Cgdnd3Mtd2l6EAMYADIECCMQJzIKCAAQsQMQgwEQQzIECAAQQzIFCAAQgAQyCwguEIAEELEDEIMBMggILhCABBCxAzIICAAQgAQQsQMyBQgAEIAEMgUIABCABDIFCAAQgAQ6CAgAEIAEELADOgUIABCRAjoQCC4QsQMQgwEQxwEQ0QMQQzoLCAAQgAQQsQMQgwE6BAguEEM6DQgAELEDEIMBEMkDEEM6BQgAEJIDSgUIPBIBMUoECEEYAUoECEYYAFDdCljFEWDfHGgBcAB4AIABngGIAYwEkgEDMC40mAEAoAEByAEBwAEB&sclient=gws-wiz" role="button"
                ><i className="fa fa-google"></i
              ></a>
              <a className="btn btn-outline-light btn-floating m-1" href="https://www.instagram.com/tvdhwani" role="button"
                ><i className="fa fa-instagram"></i
              ></a>
              <a className="btn btn-outline-light btn-floating m-1" href="https://www.instagram.com/dhwaniacademy/?hl=en" role="button"
                ><i className="fa fa-youtube"></i
              ></a>
            </section>
          </div>
          <div className="text-center p-3 footer-copyright-background">
            <label>© 2021 Copyright&nbsp;:&nbsp;</label>
            <a className="text-white footer-copyright-content" href="https://www.dhwaniacademy.in/">TV Dhwani</a>
          </div>
        </footer>
      </>
    )
  }
}