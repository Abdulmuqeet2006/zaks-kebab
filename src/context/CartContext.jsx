import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("zaksCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("zaksCart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item) {
    setCart((prevCart) => [...prevCart, item]);
  }

  function removeFromCart(index) {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  }

  function clearCart() {
    setCart([]);
    localStorage.removeItem("zaksCart");
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}