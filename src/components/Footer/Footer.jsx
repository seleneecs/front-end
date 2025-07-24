import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer bg-custom-dark">
     <div className="px-4 py-5">
        
        
        <div className=" py-3 border-top mt-4 w-100">
          <ul className=" list-unstyled custom-footer-text fs-7 fw-light">
            <li className="mx-2"><a className="custom-footer-text" href="#">Privacy Policy</a></li>
            <li className="mx-2"><a className="custom-footer-text" href="#">Terms & Conditions</a></li>

            <li className="mx-2">
              <a className="custom-footer-text position-relative" href="#" title="0720 938 209">Contact Us: 0748 98 01 78</a>              
            </li>

            <li className="mx-2">
              <a className="custom-footer-text position-relative" href="#" title="0720 938 209">Email: info@seleneecs.com</a>              
            </li>

            <li className="mx-2"><a className="custom-footer-text" href="/support">Support</a></li>            
            <li><a className="custom-footer-text" href="https://web.facebook.com/profile.php?id=61556763399546">Follow Us on Facebook</a></li>             
              
              <li><a className="custom-footer-text" href="#">Connect with Us on WhatsApp</a></li>               
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
