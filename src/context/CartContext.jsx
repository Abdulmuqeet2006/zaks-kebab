import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("zaksCart");
      const parsed = saved ? JSON.parse(saved) : [];

      return Array.isArray(parsed)
        ? parsed.filter((item) => item && item.name && Number(item.price) > 0)
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const cleanCart = cart.filter(
      (item) => item && item.name && Number(item.price) > 0
    );

    localStorage.setItem("zaksCart", JSON.stringify(cleanCart));
  }, [cart]);

  function addToCart(item) {
    if (!item || !item.name || Number(item.price) <= 0) return;

    const cleanItem = {
      ...item,
      price: Number(item.price),
    };

    setCart((prevCart) => [...prevCart, cleanItem]);
  }

  function removeFromCart(index) {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  }

  function clearCart() {
    setCart([]);
    localStorage.removeItem("zaksCart");
    localStorage.removeItem("cart");
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