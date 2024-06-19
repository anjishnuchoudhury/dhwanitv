import React from "react";

const Footer = () => {
  return (
    <div>
      <div className="mt-5 w-full">
        <footer className="footer-20192">
          <div className="site-section ">
            <div className="container">
              {/* <div className="cta d-block d-md-flex align-items-center px-5">
                <div>
                  <h2 className="mb-0">Ready for a next project?</h2>
                  <h3 className="text-dark">Let's get started!</h3>
                </div>
                <div className="ml-auto">
                  <a href="#" className="btn btn-dark rounded-0 py-3 px-5">
                    Contact us
                  </a>
                </div>
              </div> */}
              <div className="row">
                {/* <div className="col-sm">
                  <a href="#" className="footer-logo">
                    Colorlib
                  </a>
                  <p className="copyright">
                    <small>&copy; 2019</small>
                  </p>
                </div> */}
                <div className="col-sm">
                  <h3>Categories</h3>
                  <ul className="list-unstyled links">
                    <li>
                      <a href="#">Hello</a>
                    </li>
                    <li>
                      <a href="#">Drama</a>
                    </li>
                    <li>
                      <a href="#">Dance</a>
                    </li>
                  </ul>
                </div>
                <div className="col-sm">
                  <h3>ICM Series</h3>
                  <ul className="list-unstyled links">
                    <li>
                      <a href="#">Saaz Aur Awaz</a>
                    </li>
                    <li>
                      <a href="#">Pratidhwani</a>
                    </li>
                    <li>
                      <a href="#">Raaga and Rhythm</a>
                    </li>
                    <li>
                      <a href="#">Baisakhi</a>
                    </li>
                    <li>
                      <a href="#">Event</a>
                    </li>
                  </ul>
                </div>
                <div className="col-sm">
                  <h3>Useful Links</h3>
                  <ul className="list-unstyled links">
                    <li>
                      <a href="#">Home</a>
                    </li>
                    <li>
                      <a href="#">About Us</a>
                    </li>
                    <li>
                      <a href="#">Privacy Policy</a>
                    </li>
                    <li>
                      <a href="#">Terms and Conditions</a>
                    </li>
                  </ul>
                </div>
                <div className="col-md-3">
                  <h3>Follow us</h3>
                  <ul className="list-unstyled social">
                    <li>
                      <a href="https://www.facebook.com/tvdhwani" className="m-1">
                        <span className="icon-facebook"></span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="m-1">
                        <span className="icon-youtube"></span>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com/tvdhwani" className="m-1">
                        <span className="icon-instagram"></span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-center mt-5">
                &copy; 2024 TV Dhwani | Managed by SIDA Technologies
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
