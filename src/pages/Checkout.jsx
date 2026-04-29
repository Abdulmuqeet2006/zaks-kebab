import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const WHATSAPP = "351967292950";
const SHOP_EMAIL = "alvercazakskebab@gmail.com";
const STORE_MAPS_LINK =
  "https://www.google.com/maps/search/?api=1&query=Zaks%20Kebab%20Alverca";

function Checkout() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: user?.address || "",
    nif: user?.nif || "",
    method: "Entrega",
    payment: "Dinheiro",
    notes: "",
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryMinimum = 7;

  // 🔥 DELIVERY FIX (NOW WORKS PERFECT)
  function getDeliveryFee() {
    if (form.method === "Levantamento" || cart.length === 0) return 0;

    const address = form.address
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (
      address.includes("bom sucesso") ||
      address.includes("bomsucesso") ||
      address.includes("alverca")
    ) {
      return 1.5;
    }

    if (
      address.includes("arcena") ||
      address.includes("forte da casa") ||
      address.includes("forte")
    ) {
      return 2.0;
    }

    if (
      address.includes("sobralinho") ||
      address.includes("vialonga") ||
      address.includes("povoa")
    ) {
      return 2.5;
    }

    return 2.5;
  }

  const deliveryFee = getDeliveryFee();
  const total = cart.length > 0 ? subtotal + deliveryFee : 0;

  const canOrder =
    cart.length > 0 &&
    form.name.trim() &&
    form.phone.trim() &&
    (form.method === "Levantamento" || subtotal >= deliveryMinimum) &&
    (form.method === "Levantamento" || form.address.trim());

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function buildOrderMessage() {
    const itemsText = cart
      .map(
        (item, i) =>
          `${i + 1}. ${item.name} - €${item.price.toFixed(2)}`
      )
      .join("\n");

    return `
🟢 NOVO PEDIDO — ZAKS KEBAB

Nome: ${form.name}
Telefone: ${form.phone}
Morada: ${form.address}

Pedido:
${itemsText}

Total: €${total.toFixed(2)}
    `;
  }

  function sendWhatsAppOrder() {
    if (!canOrder) return alert("Preenche os dados");

    const message = buildOrderMessage();
    clearCart();

    window.location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
      message
    )}`;
  }

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <h1>Checkout</h1>

        <input
          name="name"
          placeholder="Nome"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Telefone"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          name="address"
          placeholder="Morada"
          value={form.address}
          onChange={handleChange}
        />

        <select name="method" value={form.method} onChange={handleChange}>
          <option value="Entrega">Entrega</option>
          <option value="Levantamento">Levantamento</option>
        </select>

        <h2>Resumo</h2>

        {cart.map((item, i) => (
          <div key={i}>
            {item.name} - €{item.price.toFixed(2)}
            <button onClick={() => removeFromCart(i)}>x</button>
          </div>
        ))}

        <p>Subtotal: €{subtotal.toFixed(2)}</p>

        {form.method === "Entrega" && (
          <>
            <p>Entrega: €{deliveryFee.toFixed(2)}</p>

            {subtotal < deliveryMinimum && (
              <p style={{ color: "red" }}>
                Pedido mínimo: €{deliveryMinimum}
              </p>
            )}
          </>
        )}

        <h2>Total: €{total.toFixed(2)}</h2>

        <button onClick={sendWhatsAppOrder}>Enviar Pedido</button>
      </main>
    </div>
  );
}

const styles = {
  page: { padding: 20 },
  container: { maxWidth: 600, margin: "auto" },
};

export default Checkout;