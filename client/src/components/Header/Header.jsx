import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faShoppingCart, faBell } from "@fortawesome/free-solid-svg-icons"; // Import icons
import "../Header/Header.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"
import API from "../../Axios/axiosInstance";
import { useContext } from "react";
import { CartContext } from "../../Action/CartContext";


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState([])
  const [showContactModal, setShowContactModal] = useState(false);

  const { cartItems } = useContext(CartContext)

  const navigate = useNavigate();

  // ✅ Updated Logout Function

  const openContactModal = () => setShowContactModal(true);
  const closeContactModal = () => setShowContactModal(false);

  const handleLogout = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // ✅ If user is NOT logged in, redirect to login
      navigate("/login");
      return;
    }

    // ✅ If logged in, confirm logout
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token"); // Remove token
      navigate("/login"); // Redirect to login
    }
  };


  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser([]); // Clear user data if no token
        return; // Exit early
      }

      try {
        const response = await API.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data); // ✅ Set user data only if token is valid
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser([]); // Optional: clear user if token is invalid/expired
      }
    };

    fetchUser();
  }, []);




  // console.log(user);

  const fallbackImage = "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"; // Placeholder or default avatar


  // const HandleContact = () => {
  //   console.log("clicket..")
  // }

  return (
    <>

      <div className="Header">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary">
          {/* Container wrapper */}
          <div className="container-fluid">
            {/* ✅ Toggle button (Mobile Menu) */}
            <button
              className="navbar-toggler"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label="Toggle navigation"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>

            {/* ✅ Navbar Brand (LOGO) */}
            <div className="d-flex align-items-center">
              <Link className="navbar-brand mt-2 mt-lg-0 d-flex justify-content-center" to={'/'}>
                <img
                  className="logo-img img-fluid"
                  style={{ maxWidth: "150px", height: "auto", objectFit: "cover" }}
                  src={logo}
                  alt="Logo"
                />
              </Link>
            </div>

            {/* ✅ Right Elements (Mobile) */}
            <div className="d-flex align-items-center d-block d-lg-none">
              <Link className="link-secondary me-3" to={'/cart'}>
                <FontAwesomeIcon icon={faShoppingCart} />
                {cartItems.length > 0 && (
                  <span className=" top-0  translate-middle badge rounded-pill bg-danger">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* User Avatar Dropdown */}
              <div className="dropdown">
                <a className="dropdown-toggle d-flex align-items-center hidden-arrow" href="#" role="button" data-bs-toggle="dropdown">
                  <img
                    src={user?.profileImage ? `http://localhost:5001${user.profileImage}` : fallbackImage}
                    className="rounded-circle"
                    height={25}
                    alt="User Avatar"
                  />

                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <Link className="dropdown-item" to="/profile">My profile</Link>
                  <li><Link className="dropdown-item" to="login" onClick={handleLogout}>Logout</Link></li>
                </ul>
              </div>
            </div>

            {/* ✅ Collapsible Menu */}
            <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarSupportedContent">
              <div className="Menuoptions">
                <Link to="/" className="menu-links" onClick={() => setIsOpen(false)}>Home</Link>
                <Link to="/ProductsPage" className="menu-links" onClick={() => setIsOpen(false)}>Products</Link>
                <Link to="/OfferPage" className="menu-links" onClick={() => setIsOpen(false)}>Discount</Link>
                <Link to="/Ingredients" className="menu-links" onClick={() => setIsOpen(false)}>Ingredients</Link>
                {/* <Link to="/productform" className="menu-links" onClick={() => setIsOpen(false)}>product upload</Link> */}
                <Link
                  to="#"
                  className="menu-links"
                  onClick={() => {
                    openContactModal();
                  }}
                >
                  Contact Us
                </Link>

              </div>
            </div>


            {/* ✅ Right Elements (Desktop) */}
            <div className="align-items-center d-none d-lg-flex">
              <Link className="link-secondary me-3" to={"/cart"}>
                <FontAwesomeIcon icon={faShoppingCart} />
                {cartItems.length > 0 && (
                  <span className=" top-0  translate-middle badge rounded-pill bg-danger">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* User Avatar Dropdown */}
              <div className="dropdown">
                <a className="dropdown-toggle d-flex align-items-center hidden-arrow" href="#" role="button" data-bs-toggle="dropdown">
                  <img
                    src={user?.profileImage ? `http://localhost:5001${user.profileImage}` : fallbackImage}
                    className="rounded-circle"
                    height={25}
                    alt="User Avatar"
                  />

                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <Link className="dropdown-item" to="/profile">My profile</Link>
                  <li><Link className="dropdown-item" to="login" onClick={handleLogout}>Logout</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

      </div>
      {/* model */}
      {showContactModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-4 shadow-lg rounded" style={{ width: "500px" }}>
              {/* Optional top close (X) button */}
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeContactModal}
                >X</button>
              </div>

              {/* Contact Us title + inline Close button */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-center mb-0 w-100">Contact Us</h3>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger ms-3"
                  onClick={closeContactModal}
                >
                  Close
                </button>
              </div>

              {/* Form */}
              <form>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" placeholder="Enter your full name" defaultValue={user?.name || ''} />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" placeholder="Enter your email" defaultValue={user?.email || ''} />
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
      )}


    </>
  );
};

export default Header;
