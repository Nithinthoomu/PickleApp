"use client";

import React, { useEffect, useState, useContext } from "react";
import "../styles/HomePage.css";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  type: string;
  quantities: { size: string; price: number }[];
  currency: string;
  image: string;
}

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: number]: string }>({});
  const [filterType, setFilterType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { user } = useContext(AuthContext);
  const { cart,addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId: number, size: string) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const handleAddToCart = (product:Product) => {
    if (!user) {
      toast.error("Please sign in to add items to the cart.",)
      return;
    }

    const selectedSize = selectedQuantities[product.id] || product.quantities[0].size;
    const selectedPrice = product.quantities.find((q) => q.size === selectedSize)?.price || 0;

    const itemExists=cart.some((cartItem:any)=>cartItem.id===product.id && cartItem.selectedSize===selectedSize);
    if(itemExists){
      toast.error("Item already exists in the cart");
      return;
    }
    addToCart({ ...product, selectedSize, selectedPrice, quantity: 1 });
    toast.success("Item successfully added to cart!")
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "All" || product.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <h1>Welcome to Pickles App</h1>
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search pickles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <select
          id="filter-type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-dropdown"
        >
          <option value="All">All</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Non-Vegetarian">Non-Vegetarian</option>
        </select>
      </div>
      <div className="pickle-cards">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const selectedSize = selectedQuantities[product.id] || product.quantities[0].size;
            const selectedPrice = product.quantities.find((q) => q.size === selectedSize)?.price || 0;

            return (
              <div key={product.id} className="pickle-card">
                <img src={product.image} alt={product.name} className="pickle-image" />
                <h2>{product.name}</h2>
                <p>Type: {product.type}</p>
                <div className="quantity-row">
                  <label htmlFor={`quantity-${product.id}`}>Select Quantity:</label>
                  <select
                    id={`quantity-${product.id}`}
                    value={selectedSize}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    className="quantity-dropdown"
                  >
                    {product.quantities.map((quantity, index) => (
                      <option key={index} value={quantity.size}>
                        {quantity.size}
                      </option>
                    ))}
                  </select>
                </div>
                <p>
                  Price: {product.currency} {selectedPrice}
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="add-to-cart-button"
                  disabled={!user}
                >
                  {user ? "Add to Cart" : "Sign in to add"}
                </button>
              </div>
            );
          })
        ) : (
          <p className="no-products-message">There are no products matching your search and filter criteria.</p>
        )}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default HomePage;
