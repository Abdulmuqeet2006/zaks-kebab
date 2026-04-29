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
import SeoPage from "./pages/SeoPage";

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
        <Route
  path="/kebab-alverca"
  element={
    <SeoPage
      title="Kebab em Alverca"
      subtitle="Procura kebab em Alverca? No Zaks Kebab Alverca podes pedir menus, durum, kebab, pratos e acompanhamentos online."
      keywords="kebab Alverca, kebab em Alverca, Zaks Kebab Alverca"
    />
  }
/>

<Route
  path="/takeaway-alverca"
  element={
    <SeoPage
      title="Takeaway em Alverca"
      subtitle="Faz o teu pedido online e levanta na loja. Takeaway rápido, simples e saboroso em Alverca."
      keywords="takeaway Alverca, comida takeaway Alverca, kebab takeaway Alverca"
    />
  }
/>

<Route
  path="/entrega-kebab-alverca"
  element={
    <SeoPage
      title="Entrega de Kebab em Alverca"
      subtitle="Entrega de kebab em Alverca, Bom Sucesso, Arcena, Forte da Casa, Sobralinho e arredores."
      keywords="entrega kebab Alverca, kebab delivery Alverca, pedir kebab Alverca"
    />
  }
/>
      </Routes>
    </Router>
  );
}

export default App;