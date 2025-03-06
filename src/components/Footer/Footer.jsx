import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer bg-custom-dark">
     <div className="px-4 py-5">
        <div className="row justify-content-between">
          {/* Column 1 */}
          <div className="col-12 col-md-2 mb-4">
            <a className="footer-link-bold text-light mb-3" href="#">TEACHERS</a>
            <ul className="list-unstyled custom-footer-text py-2">
              <li><a className="custom-footer-text" href="#">Teaching Staff</a></li>
              <li><a className="custom-footer-text" href="#">Parents</a></li>
              <li><a className="custom-footer-text" href="#">Students</a></li>
              <li><a className="custom-footer-text" href="#">Schools</a></li>
              <li><a className="custom-footer-text" href="#">Teachers' Networks</a></li>
            </ul>
          </div>
          {/* Column 2 */}
          <div className="col-12 col-md-2 mb-4">
            <a className="footer-link-bold text-light mb-3" href="#">PROFESIONAL DEVELOPMENT AND SUPPORT </a>
            <ul className="list-unstyled custom-footer-text py-2">
              <li><a className="custom-footer-text" href="#">Online Courses & Training Modules</a></li>
              <li><a className="custom-footer-text" href="#">Certifications and Badges</a></li>
              <li><a className="custom-footer-text" href="#">Mentorship Programs</a></li>
              <li><a className="custom-footer-text" href="#">Virtual Workshops and Webinars</a></li>
              <li><a className="custom-footer-text" href="#">Discussion Forums and Communities</a></li>
              <li><a className="custom-footer-text" href="#">Access to External Resources (Research, Articles, Books)</a></li>
            </ul>
          </div>
        
          {/* Column 4 */}
          <div className="col-12 col-md-2 mb-4">
            <a className="footer-link-bold text-light mb-3" href="#">ABOUT</a>
            <ul className="list-unstyled custom-footer-text py-2">
              <li><a className="custom-footer-text" href="#">Meet the Team</a></li>
              <li><a className="custom-footer-text" href="#">Careers at Our Company</a></li>
              <li><a className="custom-footer-text" href="#">Customer Testimonials</a></li>
              <li><a className="custom-footer-text" href="#">Our Partners</a></li>
              <li><a className="custom-footer-text" href="#">Our Offices & Locations</a></li>
              <li><a className="custom-footer-text" href="#">Contact Us</a></li>
            </ul>
          </div>
          {/* Column 5 */}
          <div className="col-12 col-md-2 mb-4">
            <a className="footer-link-bold text-light mb-3" href="#">CONNECT WITH seleneECS</a>
            <ul className="list-unstyled custom-footer-text py-2">
              <li><a className="custom-footer-text" href="#">Follow Us on Facebook</a></li>
              <li><a className="custom-footer-text" href="#">Follow Us on Instagram</a></li>
              <li><a className="custom-footer-text" href="#">Contact Our Support Team</a></li>
              <li><a className="custom-footer-text" href="#">Connect with Us on WhatsApp</a></li>
              <li><a className="custom-footer-text" href="#">Schedule a Consultation</a></li>
              <li><a className="custom-footer-text" href="#">Connect via Phone or SMS</a></li>
            </ul>
          </div>
        </div>
        {/* Footer Bottom */}
        <div className=" py-3 border-top mt-4 w-100">
          <ul className=" list-unstyled custom-footer-text fs-7 fw-light">
            <li className="mx-2"><a className="custom-footer-text" href="#">Privacy Policy</a></li>
            <li className="mx-2"><a className="custom-footer-text" href="#">Terms & Conditions</a></li>
            <li className="mx-2">
              <a className="custom-footer-text position-relative" href="#" title="0720 938 209">Contact Us</a>
            </li>

            <li className="mx-2"><a className="custom-footer-text" href="#">Support</a></li>
          </ul>
          <ul className="list-unstyled fs-7 fw-light custom-footer-text d-flex">
            <li>&copy; 2024 seleneECS. All rights reserved.</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
