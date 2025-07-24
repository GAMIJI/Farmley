import {React } from 'react'
import '../style/Home.css'
import ProductsPage from "./Productspage"; // Corrected typo
import OfferPage from "./OfferPage";
import Ingredients from "./Ingredients";
import FrontPage from './FrontPage';
import { lazy, Suspense } from 'react';
import ContactUs from './ContactUs';




export const Home = () => {

  return (
    <div>
  

    <section id="FrontPage">
      <FrontPage/>
    </section>
    
    {/* Add the components of different pages here */}
    <section id="products">
      <ProductsPage />
    </section>

    <section id="offers">
      <OfferPage />
    </section>

    <section id="ingredients">
      <Ingredients />
    </section>

    <Suspense fallback={<div>Loading...</div>}>  
          <ContactUs/>
    </Suspense>
  </div>
   
  )
}

export default Home;