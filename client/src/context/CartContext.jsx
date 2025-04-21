"use client";

import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
        const existingproduct=prevCart.find((item)=>item.id===product.id && item.selectedSize===product.selectedSize);
        if(existingproduct){
            return prevCart.map((item)=>
                item.id===product.id && item.selectedSize===product.selectedSize
                ? {...item, quantity:item.quantity+1}
                : item
            );
        }else{
            // return [...prevCart,product];
            return [...prevCart, {...product, quantity:1}];
        }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart=()=>{
    setCart([]);
  }

  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity,clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
