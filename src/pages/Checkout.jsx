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
    name: user?.displayName || "",
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

  // 🔥 FIX FINAL (AGORA FUNCIONA PERFEITO)
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
    ) return 1.5;

    if (
      address.includes("arcena") ||
      address.includes("forte da casa") ||
      address.includes("forte")
    ) return 2.0;

    if (
      address.includes("sobralinho") ||
      address.includes("vialonga") ||
      address.includes("povoa")
    ) return 2.5;

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

    if (name === "method" && value === "Levantamento") {
      setForm({ ...form, method: value, address: "" });
      return;
    }

    setForm({ ...form, [name]: value });
  }

  function buildOrderMessage() {
    const mapsLink =
      form.method === "Entrega"
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            form.address
          )}`
        : STORE_MAPS_LINK;

    const itemsText = cart
      .map((item, i) => {
        const basePrice =
          item.basePrice && item.basePrice !== item.price
            ? `\n   Preço base: €${item.basePrice.toFixed(2)}`
            : "";

        const drink = item.drink ? `\n   🥤 Bebida: ${item.drink}` : "";

        const extras =
          item.extras?.length > 0
            ? `\n   ➕ Extras: ${item.extras
                .map((e) => `${e.name} (+€${e.price.toFixed(2)})`)
                .join(", ")}`
            : "";

        const notes = item.notes ? `\n   📝 Notas: ${item.notes}` : "";

        return `🍴 ${i + 1}. ${item.name} — €${item.price.toFixed(
          2
        )}${basePrice}${drink}${extras}${notes}`;
      })
      .join("\n\n");

    return `
🟢 NOVO PEDIDO — ZAKS KEBAB ALVERCA

━━━━━━━━━━━━━━
👤 CLIENTE
Nome: ${form.name}
Telefone: ${form.phone}
Email: ${form.email || "Não indicado"}
NIF: ${form.nif || "Não indicado"}

━━━━━━━━━━━━━━
🚚 MÉTODO
${form.method === "Entrega" ? "Entrega ao domicílio" : "Levantamento na loja"}
${
  form.method === "Entrega"
    ? `Morada: ${form.address}\n📍 Google Maps: ${mapsLink}`
    : `Cliente vai levantar na loja\n📍 Loja no Google Maps: ${mapsLink}\n⏱️ Pronto para levantar em 10–15 min`
}

💳 Pagamento: ${form.payment}
⚠️ Pago na entrega/levantamento

━━━━━━━━━━━━━━
🥙 PEDIDO
${itemsText}

━━━━━━━━━━━━━━
💰 RESUMO
Subtotal: €${subtotal.toFixed(2)}
${form.method === "Entrega" ? `Entrega: €${deliveryFee.toFixed(2)}` : ""}
Total: €${total.toFixed(2)}

━━━━━━━━━━━━━━
📝 NOTAS GERAIS
${form.notes || "Sem notas"}

━━━━━━━━━━━━━━
⚠️ Pedido sujeito a confirmação manual.
`;
  }

  function sendWhatsAppOrder() {
    if (!canOrder) {
      alert("Por favor preenche os dados necessários.");
      return;
    }

    const message = buildOrderMessage();
    clearCart();

    window.location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
      message
    )}`;
  }

  function sendEmailOrder() {
    if (!canOrder) {
      alert("Por favor preenche os dados necessários.");
      return;
    }

    const message = buildOrderMessage();
    clearCart();

    window.location.href = `mailto:${SHOP_EMAIL}?subject=${encodeURIComponent(
      "Novo Pedido - Zaks Kebab Alverca"
    )}&body=${encodeURIComponent(message)}`;
  }

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <h1 style={styles.title}>Checkout</h1>

        <div style={styles.layout}>
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Dados do cliente</h2>

            <input style={styles.input} name="name" placeholder="Nome" value={form.name} onChange={handleChange} />
            <input style={styles.input} name="phone" placeholder="Telefone" value={form.phone} onChange={handleChange} />
            <input style={styles.input} name="email" type="email" placeholder="Email opcional" value={form.email} onChange={handleChange} />
            <input style={styles.input} name="nif" placeholder="NIF opcional" value={form.nif} maxLength="9" onChange={handleChange} />

            <select style={styles.input} name="method" value={form.method} onChange={handleChange}>
              <option value="Entrega">Entrega</option>
              <option value="Levantamento">Levantamento na loja</option>
            </select>

            {form.method === "Entrega" && (
              <input
                style={styles.input}
                name="address"
                placeholder="Morada para entrega"
                value={form.address}
                onChange={handleChange}
              />
            )}

            <select style={styles.input} name="payment" value={form.payment} onChange={handleChange}>
              <option value="Dinheiro">Dinheiro</option>
              <option value="MB Way">MB Way</option>
            </select>
          </section>

          <aside style={styles.card}>
            <h2 style={styles.cardTitle}>Resumo</h2>

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

            <button onClick={sendWhatsAppOrder}>
              Enviar WhatsApp
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: { background: "#0f0b08", minHeight: "100vh", color: "#fff7e8" },
  container: { maxWidth: "1100px", margin: "auto", padding: "20px" },
  title: { fontSize: "36px", color: "#ffb703" },
  layout: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  card: { background: "#1a120d", padding: "20px", borderRadius: "20px" },
  input: { width: "100%", margin: "10px 0", padding: "12px" },
};

export default Checkout;