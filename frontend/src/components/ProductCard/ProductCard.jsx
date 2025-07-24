import React from 'react';
import "../../style/Products.css";



const ProductCard = ({ image, title, description, productPrice }) => (
 <div>
  <div className="card">
    <img src={image} alt={title} className="card-img" />
    <h3>{title}</h3>
    <p>{description}</p>
    {productPrice && <p>Price: ${productPrice}</p>}
    <button className="load-more-btn">Buy Now</button> {/* Button inside the card */}
  </div>
  </div>
);

export default ProductCard;
