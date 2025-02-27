import React from 'react';
import './Footer.css'; 
import instagramIcon from './instagram.png'; 
import facebookIcon from './facebook.png'; 
import xIcon from './x.png'; 

export default function Footer() {
  return (
    <footer className="bg-dark-custom text-center text-lg-start text-white">
      <div className="container p-4">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">About Us</h5>
            <p>
              Lager Legends is dedicated to providing the best services to our customers. We value quality and customer satisfaction above all.
            </p>
          </div>

          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Social Media</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#!" className="text-white">
                  <img src={instagramIcon} alt="Instagram" style={{ width: '30px', height: '30px' }} />
                </a>
              </li>
              <li className="mb-2">
                <a href="#!" className="text-white">
                  <img src={facebookIcon} alt="Facebook" style={{ width: '39px', height: '25px' }} />
                </a>
              </li>
              <li className="mb-2">
                <a href="#!" className="text-white">
                  <img src={xIcon} alt="X" style={{ width: '35px', height: '35px' }} />
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Contact</h5>
            <p>
              Ireland Dublin Brewery Road 56<br />
              Email: LagerLegends@gmail.com<br />
              Phone: +353 218 295
            </p>
          </div>
        </div>
      </div>

      <div className="text-center p-3">
        &copy; 2025 Lager Legends. All rights reserved.
      </div>
    </footer>
  );
}