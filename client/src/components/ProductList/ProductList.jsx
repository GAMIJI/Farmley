import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../Axios/axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductList.css";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickedItems, setClickedItems] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const sliderRefs = useRef({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products/");
        console.log("✅ Response:", response.data);

        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error("🚨 Unexpected response data:", response.data);
          setProducts([]); // prevent crash
        }
      } catch (error) {
        console.error("❌ Error fetching products:", error);
        setProducts([]); // prevent crash
      } finally {
        setLoading(false);
      }
    };



    fetchProducts();
    fetchCartItems(); // load cart from backend
  }, []);

  const fetchCartItems = async () => {
    const userId = localStorage.getItem("userData");
    const token = localStorage.getItem("token");

    console.log("dfvbyudfj", token);


    if (!userId || !token) return;

    try {
      const res = await API.get(`/cart/addToCart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.data || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleCart = async (_id) => {
    const userId = localStorage.getItem("userData");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      alert("Please login to add items to cart");
      return navigate("/login");
    }

    if (!_id || cartItems.some((item) => item.productId.id === _id)) return;

    setClickedItems((prev) => ({ ...prev, [_id]: true }));

    try {
      await API.post(
        "/cart/add",
        {
          userId,
          productId: _id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Include token here
          },
        }
      );

      await fetchCartItems(); // Refresh cart items
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong while adding to cart.");
    } finally {
      setClickedItems((prev) => ({ ...prev, [_id]: false }));
    }
  };

  const handleDetails = (id) => {
    localStorage.setItem("productid", id);
    navigate("/productdetail");
  };

  const scrollSlider = (category, direction) => {
    const slider = sliderRefs.current[category];
    if (slider) {
      const scrollAmount = 300;
      slider.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedByCategory = filteredProducts.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="container mt-3">
      <div className="product-header mb-3">
        <h2 className="h4 mb-2">Popular Products</h2>

        <div className="search-bar-desktop d-none d-md-block">
          <form className="d-flex align-items-center" onSubmit={(e) => e.preventDefault()}>
            <input
              className="form-control search-input"
              type="search"
              placeholder="Search anything..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: "1px solid #ccc",
                borderRadius: "30px",
                paddingLeft: "15px",
                fontSize: "1rem",
                height: "45px",
                width: "250px",
              }}
            />
            <button className="btn btn-search ms-2" type="submit">
              Search
            </button>
          </form>
        </div>

        <div className="search-toggle-mobile d-block d-md-none w-100 mt-2">
          <form className="d-flex align-items-center" onSubmit={(e) => e.preventDefault()}>
            <input
              className="form-control"
              type="search"
              placeholder="Search anything..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: "1px solid #ccc",
                borderRadius: "30px",
                paddingLeft: "15px",
                fontSize: "1rem",
                height: "45px",
              }}
            />
            <button className="btn btn-search ms-2" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading products...</div>
      ) : (
        Object.entries(groupedByCategory).map(([categoryName, items]) => (
          <div key={categoryName} className="mb-4">
            <h3 className="mb-2 h5">{categoryName}</h3>

            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-secondary btn-sm me-1"
                onClick={() => scrollSlider(categoryName, "left")}
              >
                ←
              </button>

              <div
                className="d-flex overflow-auto gap-2 pb-2 px-1"
                ref={(el) => (sliderRefs.current[categoryName] = el)}
                style={{ scrollBehavior: "smooth", width: "100%" }}
              >
                {items.map((product) => {
                  const isInCart = cartItems.some((item) => item.productId._id === product._id);

                  return (
                    <div key={product._id} className="card product-card">
                      <div onClick={() => handleDetails(product._id)}>
                        <img
                          src={`http://farmley-backend-1.onrender.com${product.imageUrl}`}
                          className="card-img-top product-image"
                          alt={product.name}
                          style={{
                            height: "100px",
                            objectFit: "contain",
                            padding: "0.5rem",
                          }}
                        />
                        <div className="card-body p-2">
                          <h6 className="card-title mb-1" style={{ fontSize: "0.9rem" }}>
                            {product.name.length > 20
                              ? `${product.name.substring(0, 20)}...`
                              : product.name}
                          </h6>
                          <div className="d-flex flex-column">
                            <div className="mb-1">
                              <span className="h6 mb-0">₹{product.price}</span>
                              {product.oldPrice && (
                                <small className="old-price ms-1">₹{product.oldPrice}</small>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="card-footer bg-light p-1 text-center">
                        <button
                          style={{ width: "100%" }}
                          className={`cart-button ${clickedItems[product._id] ? "clicked" : ""}`}
                          onClick={() => handleCart(product._id)}
                          disabled={isInCart}
                        >
                          <span className="add-to-cart">
                            {isInCart ? "" : "Add to Cart"}
                          </span>
                          <span className="added">
                            {isInCart ? "Added" : ""}
                          </span>
                          <i className="fas fa-shopping-cart"></i>
                          <i className="fas fa-box"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                className="btn btn-outline-secondary btn-sm ms-1"
                onClick={() => scrollSlider(categoryName, "right")}
              >
                →
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;
