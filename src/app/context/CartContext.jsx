'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage once on client mount
  useEffect(() => {
    const stored = localStorage.getItem('kdh-cart');
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing cart from localStorage', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes, but only after initialization
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('kdh-cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (product, selectedMarble) => {
    setCart((prev) => {
      // check if item already exists with the same marble selection
      const exists = prev.some(
        (item) => item.id === product._id.$oid && item.selectedMarble === selectedMarble
      );
      if (exists) return prev;
      return [
        ...prev,
        {
          id: product._id.$oid,
          title: product.title,
          image: product.images?.[0]?.filePath || '/placeholder.png',
          selectedMarble: selectedMarble || null,
          material: product.material,
        },
      ];
    });
  };

  const removeFromCart = (id, selectedMarble) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === id && item.selectedMarble === selectedMarble))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (id, selectedMarble) => {
    return cart.some((item) => item.id === id && item.selectedMarble === selectedMarble);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isInitialized,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        cartCount: cart.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
