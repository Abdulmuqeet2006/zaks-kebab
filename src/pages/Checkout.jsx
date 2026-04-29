import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const WHATSAPP = "351967292950";
const STORE_MAPS_LINK =
  "https://www.google.com/maps/search/?api=1&query=Zaks%20Kebab%20Alverca";

function Checkout() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.displayName || "",
    phone: user?.phone || "",
    address: user?.address || "",
    postalCode: "",
    nif: user?.nif || "",
    method: "Entrega",
    payment: "Dinheiro",
    notes: "",
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryMinimum = 7;

  function getDeliveryFee() {
    if (form.method === "Levantamento" || cart.length === 0) return 0;

    const postal = form.postalCode.replace(/\D/g, "");

    if (postal.startsWith("261")) return 1.5;
    if (postal.startsWith("2625")) return 2.0;
    if (postal.startsWith("2620")) return 2.5;

    return 2.5;
  }

  const deliveryFee = getDeliveryFee();
  const total = cart.length > 0 ? subtotal + deliveryFee : 0;

  const canOrder =
    cart.length > 0 &&
    form.name.trim() &&
    form.phone.trim() &&
    (form.method === "Levantamento" || subtotal >= deliveryMinimum) &&
    (form.method === "Levantamento" || form.address.trim()) &&
    (form.method === "Levantamento" || form.postalCode.trim());

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "method" && value === "Levantamento") {
      setForm({ ...form, method: value, address: "", postalCode: "" });
      return;
    }

    setForm({ ...form, [name]: value });
  }

  function buildOrderMessage() {
    const mapsLink =
      form.method === "Entrega"
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            form.address + " " + form.postalCode
          )}`
        : STORE_MAPS_LINK;

    const itemsText = cart
      .map(
        (item, i) =>
          `🍴 ${i + 1}. ${item.name} — €${item.price.toFixed(2)}`
      )
      .join("\n\n");

    return `
🟢 NOVO PEDIDO — ZAKS KEBAB ALVERCA

👤 Nome: ${form.name}
📞 Telefone: ${form.phone}
📍 Morada: ${form.address}
📮 Código Postal: ${form.postalCode}

🚚 Método: ${form.method}

🥙 Pedido:
${itemsText}

💰 Total: €${total.toFixed(2)}
`;
  }

  function sendWhatsAppOrder() {
    if (!canOrder) {
      alert("Preenche todos os dados");
      return;
    }

    const message = buildOrderMessage();
    clearCart();

    window.location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
      message
    )}`;
  }

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <h1 style={styles.title}>Checkout</h1>

        <div style={styles.layout}>
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Dados</h2>

            <input style={styles.input} name="name" placeholder="Nome" value={form.name} onChange={handleChange} />
            <input style={styles.input} name="phone" placeholder="Telefone" value={form.phone} onChange={handleChange} />

            <select style={styles.input} name="method" value={form.method} onChange={handleChange}>
              <option value="Entrega">Entrega</option>
              <option value="Levantamento">Levantamento</option>
            </select>

            {form.method === "Entrega" && (
              <>
                <input style={styles.input} name="address" placeholder="Morada" value={form.address} onChange={handleChange} />
                <input style={styles.input} name="postalCode" placeholder="Código Postal (ex: 2615-123)" value={form.postalCode} onChange={handleChange} />
              </>
            )}
          </section>

          <aside style={styles.card}>
            <h2 style={styles.cardTitle}>Resumo</h2>

            <p>Subtotal: €{subtotal.toFixed(2)}</p>

            {form.method === "Entrega" && (
              <>
                <p>Entrega: €{deliveryFee.toFixed(2)}</p>
                {subtotal < deliveryMinimum && (
                  <p style={{ color: "red" }}>
                    Mínimo €7 (atual: €{subtotal.toFixed(2)})
                  </p>
                )}
              </>
            )}

            <h2>Total: €{total.toFixed(2)}</h2>

            <button style={styles.button} onClick={sendWhatsAppOrder}>
              Enviar Pedido
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: { background: "#0f0b08", minHeight: "100vh", color: "#fff" },
  container: { maxWidth: "1100px", margin: "auto", padding: "20px" },
  title: { color: "#ffb703", fontSize: "40px" },
  layout: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  card: { background: "#1a120d", padding: "20px", borderRadius: "20px" },
  input: { width: "100%", padding: "12px", margin: "10px 0" },
  button: { padding: "15px", background: "#ffb703", border: "none", width: "100%" },
};

export default Checkout;