import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();
const CART_KEY = "zaksCart_v2";

function cleanCart(items) {
  if (!Array.isArray(items)) return [];

  return items.filter(
    (item) =>
      item &&
      typeof item.name === "string" &&
      item.name.trim() &&
      Number(item.price) > 0
  );
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return cleanCart(saved ? JSON.parse(saved) : []);
    } catch {
      return [];
    }
  });

  const cleanItems = useMemo(() => cleanCart(cart), [cart]);
  const cartCount = cleanItems.length;
  const cartTotal = cleanItems.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cleanItems));
  }, [cleanItems]);

  function addToCart(item) {
    if (!item || !item.name || Number(item.price) <= 0) return;

    setCart((prev) =>
      cleanCart([
        ...prev,
        {
          ...item,
          price: Number(item.price),
        },
      ])
    );
  }

  function removeFromCart(index) {
    setCart((prev) => cleanCart(prev.filter((_, i) => i !== index)));
  }

  function clearCart() {
    setCart([]);
    localStorage.removeItem(CART_KEY);

    // remove old broken carts too
    localStorage.removeItem("zaksCart");
    localStorage.removeItem("cart");
  }

  return (
    <CartContext.Provider
      value={{
        cart: cleanItems,
        cartCount,
        cartTotal,
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