import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import CartSidebar from "./components/CartSidebar";

import Home from "./pages/Home";
import Dishes from "./pages/Dishes";
import Menus from "./pages/Menus";
import Pratos from "./pages/Pratos";
import Bebidas from "./pages/Bebidas";
import Extras from "./pages/Extras";
import Delivery from "./pages/Delivery";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import WithoutMenu from "./pages/WithoutMenu";

function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <Router>
      <Navbar setCartOpen={setCartOpen} />
      <CartSidebar open={cartOpen} setOpen={setCartOpen} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dishes" element={<Dishes />} />
        <Route path="/menus" element={<Menus />} />
        <Route path="/pratos" element={<Pratos />} />
        <Route path="/bebidas" element={<Bebidas />} />
        <Route path="/extras" element={<Extras />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/without-menu" element={<WithoutMenu />} />
      </Routes>
    </Router>
  );
}

export default App;