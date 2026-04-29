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
    nif: user?.nif || "",
    method: "Entrega",
    payment: "Dinheiro",
    notes: "",
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryMinimum = 7;

  // ❌ SEM DELIVERY AUTOMÁTICO
  const total = cart.length > 0 ? subtotal : 0;

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
      .map(
        (item, i) =>
          `🍴 ${i + 1}. ${item.name} — €${item.price.toFixed(2)}`
      )
      .join("\n\n");

    return `
🟢 NOVO PEDIDO — ZAKS KEBAB ALVERCA

━━━━━━━━━━━━━━
👤 CLIENTE
Nome: ${form.name}
Telefone: ${form.phone}
NIF: ${form.nif || "Não indicado"}

━━━━━━━━━━━━━━
🚚 MÉTODO
${form.method === "Entrega" ? "Entrega ao domicílio" : "Levantamento na loja"}
${
  form.method === "Entrega"
    ? `Morada: ${form.address}\n📍 Google Maps: ${mapsLink}\n🚚 Taxa de entrega: A confirmar conforme zona`
    : `Cliente vai levantar na loja\n📍 Loja: ${mapsLink}\n⏱️ 10–15 min`
}

💳 Pagamento: ${form.payment}

━━━━━━━━━━━━━━
🥙 PEDIDO
${itemsText}

━━━━━━━━━━━━━━
💰 RESUMO
Total produtos: €${total.toFixed(2)}

━━━━━━━━━━━━━━
📝 NOTAS
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

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <h1 style={styles.title}>Checkout</h1>

        <div style={styles.layout}>
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Dados do cliente</h2>

            <input style={styles.input} name="name" placeholder="Nome" value={form.name} onChange={handleChange} />
            <input style={styles.input} name="phone" placeholder="Telefone" value={form.phone} onChange={handleChange} />
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

            {form.method === "Levantamento" && (
              <div style={styles.pickupBox}>
                <strong>🏬 Levantamento na loja</strong>
                <p style={styles.boxText}>Pronto em 10–15 min</p>
                <a href={STORE_MAPS_LINK} target="_blank" rel="noreferrer" style={styles.mapButton}>
                  📍 Ver no Google Maps
                </a>
              </div>
            )}

            <textarea
              style={styles.textarea}
              name="notes"
              placeholder="Notas: campainha, troco..."
              value={form.notes}
              onChange={handleChange}
            />
          </section>

          <aside style={styles.card}>
            <h2 style={styles.cardTitle}>Resumo do pedido</h2>

            {cart.map((item, i) => (
              <div key={i} style={styles.item}>
                <strong>{item.name}</strong>
                <strong style={styles.itemPrice}>€{item.price.toFixed(2)}</strong>
                <button style={styles.remove} onClick={() => removeFromCart(i)}>×</button>
              </div>
            ))}

            <div style={styles.row}>
              <span>Subtotal</span>
              <strong>€{subtotal.toFixed(2)}</strong>
            </div>

            {/* 🔥 SÓ INFORMAÇÃO DE ZONAS */}
            {form.method === "Entrega" && (
              <div style={styles.deliveryBox}>
                <p>🟢 Zona 1 — Bom Sucesso / Alverca</p>
                <p>🟡 Zona 2 — Arcena / Forte da Casa</p>
                <p>🔴 Zona 3 — Sobralinho / arredores</p>
                <p style={{ marginTop: "8px", fontWeight: "900" }}>
                  💬 Taxa de entrega será confirmada pela loja
                </p>
              </div>
            )}

            {subtotal < deliveryMinimum && form.method === "Entrega" && (
              <p style={styles.error}>
                Pedido mínimo: €7 (atual: €{subtotal.toFixed(2)})
              </p>
            )}

            <div style={styles.total}>
              <span>Total</span>
              <strong>€{total.toFixed(2)}</strong>
            </div>

            <button style={styles.whatsappButton} onClick={sendWhatsAppOrder}>
              Enviar Pedido 📲
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}