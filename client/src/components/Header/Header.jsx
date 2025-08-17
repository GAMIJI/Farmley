import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBars, 
  faShoppingCart, 
  faXmark, 
  faUser, 
  faEnvelope, 
  faChevronDown,
  faSignInAlt,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { CartContext } from "../../Action/CartContext";
import { useContext } from "react";
import axios from "axios";
import styled, { keyframes, css } from "styled-components";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      setUser(null);
      setIsDropdownOpen(false);
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, [token]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && 
          !e.target.closest('[aria-label="Menu"]')) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fallbackImage = "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp";

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert("Message sent!");
    setShowContactModal(false);
  };

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  return (
    <HeaderContainer scrolled={scrolled}>
      <NavContainer>
        <MobileMenuButton onClick={toggleMobileMenu} aria-label="Menu">
          <HamburgerIcon icon={isOpen ? faXmark : faBars} isOpen={isOpen} />
        </MobileMenuButton>

        <LogoLink to="/">
          <LogoImage src={logo} alt="Company Logo" />
        </LogoLink>

        <DesktopNav>
          <NavList>
            <NavItem>
              <NavLink to="/">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/ProductsPage">Products</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/OfferPage">Discount</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/Ingredients">Ingredients</NavLink>
            </NavItem>
            <NavItem>
              <ContactButton onClick={() => setShowContactModal(true)}>
                Contact Us
              </ContactButton>
            </NavItem>
          </NavList>
        </DesktopNav>

        <IconsContainer>
          <CartLink to="/cart" aria-label="Cart">
            <CartIcon icon={faShoppingCart} />
            {cartItems.length > 0 && <CartBadge>{cartItems.length}</CartBadge>}
          </CartLink>

          {user ? (
            <UserDropdown ref={dropdownRef}>
              <UserProfile 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                aria-label="User menu"
              >
                <UserImage
                  src={user?.profileImage ? `${API_URL.replace('/api/', '')}${user.profileImage}` : fallbackImage}
                  alt={user?.name || "User"}
                />
                <UserName>{user?.name?.split(" ")[0] || "User"}</UserName>
                <ChevronIcon icon={faChevronDown} isOpen={isDropdownOpen} />
              </UserProfile>
              {isDropdownOpen && (
                <DropdownMenu>
                  <DropdownItem>
                    <DropdownLink to="/profile" onClick={() => setIsDropdownOpen(false)}>
                      <FontAwesomeIcon icon={faUser} />
                      My Profile
                    </DropdownLink>
                  </DropdownItem>
                  <DropdownItem>
                    <DropdownButton onClick={handleLogout}>
                      <FontAwesomeIcon icon={faXmark} />
                      Logout
                    </DropdownButton>
                  </DropdownItem>
                </DropdownMenu>
              )}
            </UserDropdown>
          ) : (
            <AuthButtons>
              <LoginLink to="/login">
                <FontAwesomeIcon icon={faSignInAlt} />
                Login
              </LoginLink>
              <SignupLink to="/SignUp">
                <FontAwesomeIcon icon={faUserPlus} />
                Sign Up
              </SignupLink>
            </AuthButtons>
          )}
        </IconsContainer>
      </NavContainer>

      <MobileNav isOpen={isOpen} ref={mobileMenuRef}>
        <MobileNavList>
          <MobileNavItem>
            <MobileNavLink to="/" onClick={toggleMobileMenu}>
              Home
            </MobileNavLink>
          </MobileNavItem>
          <MobileNavItem>
            <MobileNavLink to="/ProductsPage" onClick={toggleMobileMenu}>
              Products
            </MobileNavLink>
          </MobileNavItem>
          <MobileNavItem>
            <MobileNavLink to="/OfferPage" onClick={toggleMobileMenu}>
              Discount
            </MobileNavLink>
          </MobileNavItem>
          <MobileNavItem>
            <MobileNavLink to="/Ingredients" onClick={toggleMobileMenu}>
              Ingredients
            </MobileNavLink>
          </MobileNavItem>
          <MobileNavItem>
            <MobileContactButton
              onClick={() => {
                setShowContactModal(true);
                toggleMobileMenu();
              }}
            >
              Contact Us
            </MobileContactButton>
          </MobileNavItem>
          
          {/* {user ? (
            <MobileUserSection>
              <MobileUserProfile>
                <MobileUserImage
                  src={user?.profileImage ? `${API_URL.replace('/api/', '')}${user.profileImage}` : fallbackImage}
                  alt={user?.name || "User"}
                />
                <MobileUserName>{user?.name || "User"}</MobileUserName>
              </MobileUserProfile>
              <MobileUserActions>
                <MobileUserLink to="/profile" onClick={toggleMobileMenu}>
                  <FontAwesomeIcon icon={faUser} />
                  My Profile
                </MobileUserLink>
                <MobileUserButton onClick={handleLogout}>
                  <FontAwesomeIcon icon={faXmark} />
                  Logout
                </MobileUserButton>
              </MobileUserActions>
            </MobileUserSection>
          ) : (
            <MobileAuthButtons>
              <MobileLoginLink to="/login" onClick={toggleMobileMenu}>
                <FontAwesomeIcon icon={faSignInAlt} />
                Login
              </MobileLoginLink>
              <MobileSignupLink to="/register" onClick={toggleMobileMenu}>
                <FontAwesomeIcon icon={faUserPlus} />
                Sign Up
              </MobileSignupLink>
            </MobileAuthButtons>
          )} */}
        </MobileNavList>
      </MobileNav>

      {showContactModal && (
        <ModalOverlay onClick={() => setShowContactModal(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Get in Touch</ModalTitle>
              <CloseButton 
                onClick={() => setShowContactModal(false)}
                aria-label="Close contact form"
              >
                <FontAwesomeIcon icon={faXmark} />
              </CloseButton>
            </ModalHeader>

            <ContactForm onSubmit={handleContactSubmit}>
              <FormGroup>
                <Label htmlFor="contact-name">Name</Label>
                <Input 
                  id="contact-name"
                  type="text" 
                  defaultValue={user?.name || ""} 
                  placeholder="Your name" 
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="contact-email">Email</Label>
                <Input 
                  id="contact-email"
                  type="email" 
                  defaultValue={user?.email || ""} 
                  placeholder="Your email" 
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="contact-message">Message</Label>
                <TextArea 
                  id="contact-message"
                  placeholder="How can we help you?" 
                  required
                />
              </FormGroup>

              <SubmitButton type="submit">
                <FontAwesomeIcon icon={faEnvelope} />
                Send Message
              </SubmitButton>
            </ContactForm>
          </ModalContainer>
        </ModalOverlay>
      )}
    </HeaderContainer>
  );
};

// Animations
const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

// Styled Components
const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: ${({ scrolled }) => scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(10px);
  box-shadow: ${({ scrolled }) => scrolled ? '0 4px 20px rgba(0, 0, 0, 0.08)' : 'none'};
  transition: all 0.3s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  border-bottom: ${({ scrolled }) => scrolled ? '1px solid rgba(0, 0, 0, 0.05)' : 'none'};
`;

const NavContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;

  @media (max-width: 768px) {
    height: 70px;
    padding: 0 20px;
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: none;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  z-index: 1001;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const HamburgerIcon = styled(FontAwesomeIcon)`
  font-size: 1.6rem;
  color: ${({ isOpen }) => isOpen ? '#4CAF50' : '#333'};
  transition: all 0.3s ease;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  z-index: 1001;
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    height: 36px;
  }
`;

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2px;
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;

  &:hover {
    color: #4CAF50;
    background: rgba(76, 175, 80, 0.08);
  }

  &::before {
    content: '';
    position: absolute;
    bottom: 6px;
    left: 16px;
    width: calc(100% - 32px);
    height: 2px;
    background-color: #4CAF50;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: scaleX(1);
    transform-origin: left;
  }
`;

const ContactButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-family: inherit;
  position: relative;

  &:hover {
    color: #4CAF50;
    background: rgba(76, 175, 80, 0.08);
  }

  &::before {
    content: '';
    position: absolute;
    bottom: 6px;
    left: 16px;
    width: calc(100% - 32px);
    height: 2px;
    background-color: #4CAF50;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: scaleX(1);
    transform-origin: left;
  }
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 15px;
  }
`;

const CartLink = styled(Link)`
  position: relative;
  color: #333;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #4CAF50;
    background: rgba(76, 175, 80, 0.08);
  }
`;

const CartIcon = styled(FontAwesomeIcon)`
  font-size: 1.3rem;
`;

const CartBadge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: #ff4757;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: bold;
`;

const UserDropdown = styled.div`
  position: relative;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ isOpen }) => isOpen ? 'rgba(0, 0, 0, 0.05)' : 'transparent'};

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const UserImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f5f5f5;
`;

const UserName = styled.span`
  font-weight: 500;
  font-size: 0.9rem;
  color: #333;
`;

const ChevronIcon = styled(FontAwesomeIcon)`
  font-size: 0.8rem;
  color: #666;
  transition: all 0.3s ease;
  transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0)'};
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: 52px;
  background-color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  padding: 8px;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 1001;
  animation: ${slideDown} 0.3s ease forwards;
  border: 1px solid rgba(0, 0, 0, 0.08);

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid white;
  }
`;

const DropdownItem = styled.div`
  &:hover {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 8px;
  }
`;

const DropdownLink = styled(Link)`
  text-decoration: none;
  color: #555;
  padding: 10px 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  border-radius: 8px;
  gap: 10px;

  &:hover {
    color: #4CAF50;
    background: rgba(76, 175, 80, 0.08);
  }
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: #555;
  padding: 10px 14px;
  transition: all 0.3s ease;
  font-family: inherit;
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 0.9rem;
  border-radius: 8px;
  gap: 10px;

  &:hover {
    color: #ff4757;
    background: rgba(255, 71, 87, 0.08);
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const LoginLink = styled(Link)`
  padding: 8px 16px;
  color: #4CAF50;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #4CAF50;

  &:hover {
    background: rgba(76, 175, 80, 0.1);
  }
`;

const SignupLink = styled(Link)`
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #45a049;
    transform: translateY(-1px);
  }
`;

const MobileNav = styled.div`
  position: fixed;

  left: 0;
  right: 0;

  background-color: white;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s ease;
  padding: 50px 20px 40px;
  overflow-y: auto;
`;

const MobileNavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MobileNavItem = styled.li`
  width: 100%;
`;

const MobileNavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 1.1rem;
  padding: 14px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: block;
  width: 100%;

  &:hover {
    color: #4CAF50;
    background: rgba(76, 175, 80, 0.08);
  }
`;

const MobileContactButton = styled.button`
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: #333;
  font-weight: 500;
  font-size: 1.1rem;
  padding: 14px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-family: inherit;
  display: block;
  width: 100%;

  &:hover {
    color: #4CAF50;
    background: rgba(76, 175, 80, 0.08);
  }
`;

const MobileAuthButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
  width: 100%;
`;

const MobileLoginLink = styled(Link)`
  padding: 14px 20px;
  color: #4CAF50;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 1rem;
  text-align: center;
  border: 1px solid #4CAF50;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: rgba(76, 175, 80, 0.1);
  }
`;

const MobileSignupLink = styled(Link)`
  padding: 14px 20px;
  background: #4CAF50;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #45a049;
  }
`;

const MobileUserSection = styled.div`
  margin-top: 30px;
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 20px;
`;

const MobileUserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const MobileUserImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f5f5f5;
`;

const MobileUserName = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
`;

const MobileUserActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MobileUserLink = styled(Link)`
  text-decoration: none;
  color: #555;
  padding: 12px 20px;
  transition: all 0.3s ease;
  font-size: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.03);

  &:hover {
    color: #4CAF50;
    background: rgba(76, 175, 80, 0.08);
  }
`;

const MobileUserButton = styled.button`
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: #555;
  padding: 12px 20px;
  transition: all 0.3s ease;
  font-family: inherit;
  font-size: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.03);

  &:hover {
    color: #ff4757;
    background: rgba(255, 71, 87, 0.08);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
 
  left: 0;
  right: 0;

  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: ${fadeIn} 0.3s ease;
`;

const ModalContainer = styled.div`
  background-color: white;
  margin-top: 10px;
  border-radius: 20px;
  padding: 32px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: ${slideDown} 0.3s ease forwards;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: linear-gradient(90deg, #4CAF50, #6e8efb);
    border-radius: 20px 20px 0 0;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #1a1a1a;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const CloseButton = styled.button`
  background: rgba(0, 0, 0, 0.05);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #555;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    color: #ff4757;
    background: rgba(0, 0, 0, 0.08);
    transform: rotate(90deg);
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 12px;
  font-weight: 600;
  color: #333;
  font-size: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9f9f9;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);

  &:focus {
    border-color: #6e8efb;
    box-shadow: 0 0 0 3px rgba(110, 142, 251, 0.15);
    outline: none;
    background: white;
  }

  &::placeholder {
    color: #999;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 16px 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  min-height: 130px;
  resize: vertical;
  transition: all 0.3s ease;
  background: #f9f9f9;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  line-height: 1.5;

  &:focus {
    border-color: #6e8efb;
    box-shadow: 0 0 0 3px rgba(110, 142, 251, 0.15);
    outline: none;
    background: white;
  }

  &::placeholder {
    color: #999;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #6e8efb, #4CAF50);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin-top: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;

  &:hover {
    background: linear-gradient(135deg, #5a7df4, #45a049);
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -60%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(30deg);
    transition: all 0.5s ease;
  }

  &:hover::after {
    left: 100%;
  }
`;

export default Header;