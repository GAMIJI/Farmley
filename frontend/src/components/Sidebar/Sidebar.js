import React from "react";
import "./Sidebar.css";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggle }) => {
  // Dynamically set classes based on the sidebar's open state
  const sidebarClass = isOpen
    ? "sidebar-container opacity-on"
    : "sidebar-container opacity-off";

  return (
    <div className={sidebarClass} onClick={toggle}>
      <div className="icon">
        {/* Close icon triggers the toggle function */}
        <FaTimes className="close-icon" onClick={toggle} />
      </div>
      <div className="sidebar-wrapper">
        <div className="sidebar-menu">
          <Link to="/" className="sidebar-links">
            Home
          </Link>
          <Link to="/ProductsPage" className="sidebar-links">
            Products
          </Link>
          <Link to="/OfferPage" className="sidebar-links">
            Discount
          </Link>
          <Link to="/Ingredients" className="sidebar-links">
            Ingredients
          </Link>
          <Link to="/ProductionPage" className="sidebar-links">
            Products Page
          </Link>
          <Link
            className="menu-links"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Contact Us
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Sidebar;
