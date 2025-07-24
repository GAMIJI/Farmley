import React, { useEffect, useState } from "react";
import API from "../Axios/axiosInstance";

const ContactUs = () => {

 
 
  return (
    <div
      className="modal fade"
      id="contactusmodule"
      tabIndex="-1"
    >
      <div className="modal-dialog">
        <div className="modal-content p-4 shadow-lg rounded" style={{ width: "500px" }}>
          <div className="d-flex justify-content-end">
            {/* Proper close button */}
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <h3 className="fw-bold text-center mb-4">Contact Us</h3>

          <form>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" placeholder="Enter your full name" />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="Enter your email" />
            </div>

            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea className="form-control" placeholder="Type your message" rows="3"></textarea>
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
