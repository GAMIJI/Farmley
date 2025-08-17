import React from "react";
import {  Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProductsPage from "./pages/Productspage";
import OfferPage from "./pages/OfferPage";
import Ingredients from "./pages/Ingredients";
import Login from "./components/Login/Login";
import SingUp from "./components/SignUp/SignUp";
import Cart from "./components/Cart/Cart";
import PrivateRoute from "./util/PrivateRoute";
import Profile from "./components/Profile/profile";
import ContactUs from "./pages/ContactUs";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ProductForm from "./pages/ProductForm";
import ProductList from "./components/ProductList/ProductList";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import CheckoutPage from "./components/Checkout/CheckoutPage";

import 'react-toastify/dist/ReactToastify.css';



const App = () => {
  return (
    <div>
      <Header/>
      {/* <Navbar/> */}
   <Routes>
        {/* Public Routes */}
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SingUp />} />

        {/* Private Routes */}
          <Route path="/profile" element={<PrivateRoute Component={Profile} />} />
          <Route path="/cart" element={<PrivateRoute Component={Cart} />} />
          
          <Route path="/" element={<Home />} />
          <Route path="/ProductsPage" element={<ProductsPage />} />
          <Route path="/ProductList" element={<ProductList />} />
          <Route path="/OfferPage" element={<OfferPage />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/productform" element={<ProductForm/>}/>
          <Route path="productdetail" element={<ProductDetail/>}/> 
          <Route path="/CheckoutPage" element={<CheckoutPage/>}/> 
      </Routes>
      <Footer/> 
  </div>
  );
};

export default App;