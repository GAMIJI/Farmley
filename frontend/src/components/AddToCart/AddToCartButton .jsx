// AddToCartButton.js
import React, { useState } from "react";
import './AddToCartButton.css'
import { FaShoppingCart, FaBox } from "react-icons/fa";

const AddToCartButton = ({ productId, cartItems, setCartItems, clickedItems, setClickedItems }) => {
  const handleCart = () => {
    if (cartItems.has(productId)) return;
    setClickedItems((prev) => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      setCartItems((prev) => new Set([...prev, productId]));
      setClickedItems((prev) => ({ ...prev, [productId]: false }));
    }, 1500);
  };

  return (
    <button
      className={`cart-button ${clickedItems[productId] ? "clicked" : ""}`}
      onClick={handleCart}
      disabled={cartItems.has(productId)}
    >
      <span className="add-to-cart">
        {cartItems.has(productId) ? "" : "Add to Cart"}
      </span>
      <span className="added">{cartItems.has(productId) ? "Added" : ""}</span>
      <FaShoppingCart />
      <FaBox />
    </button>
  );
};

export default AddToCartButton;
