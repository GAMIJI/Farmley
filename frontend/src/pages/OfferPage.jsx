import React from 'react'
import Image from '../assets/offer.png'
import "../style/OfferPage.css"
export const OfferPage = () => {
    return (
 
        <div className="offer-container">
          <img src={Image} className="offer-image" alt="OfferPage" />
          <button className="shop">Shop Now</button>
        </div>
    
      );
}

export default OfferPage; 