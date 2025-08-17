import React from 'react';
import logo from "../../assets/logo.png"
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white text-dark pt-5 pb-4 position-relative overflow-hidden">
      {/* Gradient accent */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: 'linear-gradient(135deg, rgba(200,230,255,0.2) 0%, rgba(255,255,255,0) 50%)',
          zIndex: 0
        }}
      ></div>

      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row g-4">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center">
              <span
                className=" me-3 d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px' }}
              >
                <div className="d-flex align-items-center">
                  <Link style={{marginLeft:'50px'}} className="navbar-brand mt-2 mt-lg-0 d-flex justify-content-center" to={'/'}>
                    <img
                      className="logo-img img-fluid"
                      style={{ maxWidth: "150px", height: "auto", objectFit: "cover" }}
                      src={logo}
                      alt="Logo"
                    />
                  </Link>
                </div>
                {/* <i className="bi bi-gem text-white fs-5"></i> */}
              </span>
              {/* <span>FarmDry Premium Dry Food </span> */}
            </h5>
            <p className="text-muted mb-4">
              Innovative solutions for your digital needs. We create experiences that matter and deliver value to our customers.
            </p>
            <div className="social-icons mt-4">
              <a href="#" className="text-dark me-3 hover-primary">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="#" className="text-dark me-3 hover-primary">
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a href="#" className="text-dark me-3 hover-primary">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="#" className="text-dark me-3 hover-primary">
                <i className="bi bi-linkedin fs-5"></i>
              </a>
              <a href="#" className="text-dark hover-primary">
                <i className="bi bi-github fs-5"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="fw-bold mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              {['Home', 'About', 'Services', 'Pricing', 'Contact'].map((item) => (
                <li key={item} className="mb-2">
                  <a
                    href="#!"
                    className="text-muted text-decoration-none d-flex align-items-center hover-primary"
                  >
                    <i className="bi bi-chevron-right small me-2"></i>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="fw-bold mb-4">Products</h5>
            <ul className="list-unstyled">
              {['Web Apps', 'Mobile Apps', 'UI/UX Design', 'Cloud Solutions'].map((product) => (
                <li key={product} className="mb-2">
                  <a
                    href="#!"
                    className="text-muted text-decoration-none d-flex align-items-center hover-primary"
                  >
                    <i className="bi bi-box-seam small me-2"></i>
                    {product}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="fw-bold mb-4">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex">
                <span className="bg-light bg-gradient p-2 rounded-circle me-3 d-flex align-items-center justify-content-center">
                  <i className="bi bi-geo-alt-fill text-primary"></i>
                </span>
                <div>
                  <h6 className="mb-0 fw-semibold">Our Location</h6>
                  <p className="text-muted mb-0 small">123 Tech Street, Silicon Valley, CA 94025</p>
                </div>
              </li>
              <li className="mb-3 d-flex">
                <span className="bg-light bg-gradient p-2 rounded-circle me-3 d-flex align-items-center justify-content-center">
                  <i className="bi bi-envelope-fill text-primary"></i>
                </span>
                <div>
                  <h6 className="mb-0 fw-semibold">Email Us</h6>
                  <p className="text-muted mb-0 small">info@company.com</p>
                </div>
              </li>
              <li className="d-flex">
                <span className="bg-light bg-gradient p-2 rounded-circle me-3 d-flex align-items-center justify-content-center">
                  <i className="bi bi-telephone-fill text-primary"></i>
                </span>
                <div>
                  <h6 className="mb-0 fw-semibold">Call Us</h6>
                  <p className="text-muted mb-0 small">+1 (555) 123-4567</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider with gradient */}
        <div
          className="my-4"
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)'
          }}
        ></div>

        {/* Copyright */}
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0 text-muted small">
              &copy; {new Date().getFullYear()} Company Name. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="mb-0 text-muted small">
              Designed with <i className="bi bi-heart-fill text-danger"></i> by Our Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;