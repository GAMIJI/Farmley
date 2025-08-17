import { createContext, useEffect, useState } from "react";
import API from "../Axios/axiosInstance";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_BASE_URL;

export const CartContext = createContext()

export const CartProvider = ({children})=>{
    const [cartItems, setCartItems] = useState([]);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userData");
    
            const res = await API.get(`${API_URL}cart/addToCart?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCartItems(res.data.data);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
            // if (error.response?.status === 401) navigate("/login");
        }
    };
    
    useEffect(() => {
        fetchCart();
    }, []);
    return (
        <CartContext.Provider value={{ cartItems, setCartItems, fetchCart }}>
          {children}
        </CartContext.Provider>
        )
}
