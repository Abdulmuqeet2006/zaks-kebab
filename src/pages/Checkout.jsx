import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const WHATSAPP = "351967292950";
const STORE_MAPS_LINK =
  "https://www.google.com/maps/search/?api=1&query=Zaks%20Kebab%20Alverca";

function Checkout() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);

  const [form, setForm] = useState({
    name: user?.displayName || "",
    phone: "",
    address: "",
    nif: "",
    method: "Entrega",
    payment: "Dinheiro",
    notes: "",
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "store"), (snap) => {
      const enabled = snap.exists() ? snap.data().deliveryEnabled ?? true : true;
      setDeliveryEnabled(enabled);

      if (!enabled) {
        setForm((prev) => ({
          ...prev,
          method: "Levantamento",
          address: "",
        }));
      }
    });

    return () => unsub();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const deliveryMinimum = 7;
  const total = subtotal;

  const canOrder =
    cart.length > 0 &&
    form.name.trim() &&
    form.phone.trim() &&
    (form.method === "Levantamento" || form.address.trim()) &&
    (form.method === "Levantamento" || subtotal >= deliveryMinimum);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "method" && value === "Levantamento") {
      setForm({ ...form, method: value, address: "" });
      return;
    }

    if (name === "method" && value === "Entrega" && !deliveryEnabled) {
      setForm({ ...form, method: "Levantamento", address: "" });
      return;
    }

    setForm({ ...form, [name]: value });
  }

  async function saveOrderToFirestore() {
    const orderData = {
      customerName: form.name,
      phone: form.phone,
      address: form.address || "",
      nif: form.nif || "",
      method: form.method,
      payment: form.payment,
      notes: form.notes || "",
      items: cart.map((item) => ({
        name: item.name || "",
        price: Number(item.price || 0),
        drink: item.drink || "",
        extras: item.extras || [],
        notes: item.notes || "",
      })),
      subtotal: Number(subtotal),
      total: Number(total),
      status: "new",
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "orders"), orderData);
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
        const drink = item.drink ? `\n   🥤 Bebida: ${item.drink}` : "";

        const extras =
          item.extras?.length > 0
            ? `\n   ➕ Extras: ${item.extras
                .map((e) => `${e.name} (+€${Number(e.price || 0).toFixed(2)})`)
                .join(", ")}`
            : "";

        const notes = item.notes ? `\n   📝 Notas: ${item.notes}` : "";

        return `🍴 ${i + 1}. ${item.name} — €${Number(item.price || 0).toFixed(
          2
        )}${drink}${extras}${notes}`;
      })
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
    : `Cliente vai levantar na loja\n📍 Loja: ${mapsLink}\n⏱️ Pronto em 10–15 min`
}

💳 Pagamento: ${form.payment}

━━━━━━━━━━━━━━
🥙 PEDIDO
${itemsText}

━━━━━━━━━━━━━━
💰 RESUMO
Total produtos: €${total.toFixed(2)}
${form.method === "Entrega" ? "Taxa de entrega: A confirmar pela loja" : ""}

━━━━━━━━━━━━━━
📝 NOTAS
${form.notes || "Sem notas"}

━━━━━━━━━━━━━━
⚠️ Pedido sujeito a confirmação manual.
`;
  }

  async function sendWhatsAppOrder() {
    if (!canOrder) {
      alert("Por favor preenche os dados necessários.");
      return;
    }

    try {
      const message = buildOrderMessage();

      await saveOrderToFirestore();

      clearCart();

      window.location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
        message
      )}`;
    } catch (error) {
      console.error("Erro ao guardar pedido:", error);
      alert("Erro ao guardar o pedido: " + error.message);
    }
  }

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <h1 style={styles.title}>Checkout</h1>

        <div style={styles.layout}>
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Dados do cliente</h2>

            <input
              style={styles.input}
              name="name"
              placeholder="Nome"
              value={form.name}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="phone"
              placeholder="Telefone"
              value={form.phone}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="nif"
              placeholder="NIF opcional"
              value={form.nif}
              maxLength="9"
              onChange={handleChange}
            />

            <select
              style={styles.input}
              name="method"
              value={form.method}
              onChange={handleChange}
            >
              {deliveryEnabled && <option value="Entrega">Entrega</option>}
              <option value="Levantamento">Levantamento na loja</option>
            </select>

           {!deliveryEnabled && (
  <p style={styles.warning}>
    ⚠️ Hoje não temos motorista de entrega disponível. Estamos apenas com levantamento na loja. Obrigado pela compreensão.
  </p>
)}

            {form.method === "Entrega" && deliveryEnabled && (
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
                <p style={styles.boxText}>Pronto para levantar em 10–15 min.</p>
                <a
                  href={STORE_MAPS_LINK}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.mapButton}
                >
                  📍 Abrir loja no Google Maps
                </a>
              </div>
            )}

            <select
              style={styles.input}
              name="payment"
              value={form.payment}
              onChange={handleChange}
            >
              <option value="Dinheiro">
                Dinheiro - pagar na entrega/levantamento
              </option>
              <option value="MB Way">
                MB Way - pagar na entrega/levantamento
              </option>
            </select>

            <textarea
              style={styles.textarea}
              name="notes"
              placeholder="Notas gerais: prédio, campainha, troco, etc..."
              value={form.notes}
              onChange={handleChange}
            />

            <p style={styles.warning}>
              ⚠️ O pedido será confirmado manualmente pela loja.
            </p>
          </section>

          <aside style={styles.card}>
            <h2 style={styles.cardTitle}>Resumo do pedido</h2>

            {cart.length === 0 && <p>O carrinho está vazio.</p>}

            {cart.map((item, i) => (
              <div key={i} style={styles.item}>
                <div>
                  <strong>{item.name}</strong>

                  {item.drink && (
                    <p style={styles.small}>🥤 Bebida: {item.drink}</p>
                  )}

                  {item.extras?.length > 0 && (
                    <p style={styles.small}>
                      Extras:{" "}
                      {item.extras
                        .map(
                          (e) =>
                            `${e.name} (+€${Number(e.price || 0).toFixed(2)})`
                        )
                        .join(", ")}
                    </p>
                  )}

                  {item.notes && (
                    <p style={styles.small}>Notas: {item.notes}</p>
                  )}
                </div>

                <strong style={styles.itemPrice}>
                  €{Number(item.price || 0).toFixed(2)}
                </strong>

                <button
                  style={styles.remove}
                  onClick={() => removeFromCart(i)}
                >
                  ×
                </button>
              </div>
            ))}

            <div style={styles.row}>
              <span>Subtotal</span>
              <strong>€{subtotal.toFixed(2)}</strong>
            </div>

            {form.method === "Entrega" && deliveryEnabled && (
              <div style={styles.deliveryBox}>
                <p>🟢 Zona 1 — Bom Sucesso / Alverca</p>
                <p>🟡 Zona 2 — Arcena / Forte da Casa</p>
                <p>🔴 Zona 3 — Sobralinho</p>
                <p style={styles.deliveryImportant}>
                  🚚 Taxa de entrega: a confirmar pela loja
                </p>
              </div>
            )}

            {subtotal < deliveryMinimum && form.method === "Entrega" && (
              <p style={styles.error}>
                Pedido mínimo para entrega: €7. Valor atual: €
                {subtotal.toFixed(2)}.
              </p>
            )}

            {form.method === "Levantamento" && (
              <div style={styles.pickupSummary}>
                🏬 Sem taxa de entrega
                <br />
                ⏱️ Pronto para levantar em 10–15 min
              </div>
            )}

            <div style={styles.total}>
              <span>Total produtos</span>
              <strong>€{total.toFixed(2)}</strong>
            </div>

            <button
              style={{
                ...styles.whatsappButton,
                opacity: canOrder ? 1 : 0.5,
                cursor: canOrder ? "pointer" : "not-allowed",
              }}
              onClick={sendWhatsAppOrder}
            >
              Enviar pelo WhatsApp 📲
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    background:
      "radial-gradient(circle at top right, rgba(255,183,3,.12), transparent 36%), linear-gradient(180deg, #0f0b08, #1b120d)",
    minHeight: "100vh",
    color: "#fff7e8",
  },
  container: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "28px 14px 70px",
  },
  title: {
    fontSize: "clamp(38px, 6vw, 64px)",
    fontWeight: "1000",
    margin: "0 0 24px",
    color: "#ffb703",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "22px",
  },
  card: {
    background:
      "radial-gradient(circle at top right, rgba(255,183,3,.13), transparent 34%), linear-gradient(180deg, #24150e, #130d09)",
    padding: "22px",
    borderRadius: "26px",
    border: "1px solid rgba(255,183,3,0.25)",
    boxShadow: "0 24px 60px rgba(0,0,0,.42)",
  },
  cardTitle: {
    marginTop: 0,
    fontSize: "25px",
    color: "#fff7e8",
  },
  input: {
    width: "100%",
    padding: "14px",
    margin: "8px 0",
    borderRadius: "14px",
    border: "1px solid rgba(255,183,3,.18)",
    background: "#fff7e8",
    color: "#160f0b",
    boxSizing: "border-box",
    fontSize: "15px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    minHeight: "105px",
    padding: "14px",
    margin: "8px 0",
    borderRadius: "14px",
    border: "1px solid rgba(255,183,3,.18)",
    background: "#fff7e8",
    color: "#160f0b",
    boxSizing: "border-box",
    fontSize: "15px",
    outline: "none",
  },
  pickupBox: {
    background: "rgba(255,183,3,.12)",
    border: "1px solid rgba(255,183,3,.25)",
    padding: "14px",
    borderRadius: "16px",
    margin: "10px 0",
    lineHeight: "1.5",
    fontWeight: "700",
  },
  boxText: {
    margin: "6px 0",
    color: "#d7c2a8",
  },
  pickupSummary: {
    background: "rgba(255,183,3,.12)",
    border: "1px solid rgba(255,183,3,.25)",
    padding: "12px",
    borderRadius: "14px",
    margin: "14px 0",
    fontWeight: "800",
    lineHeight: "1.5",
  },
  mapButton: {
    display: "inline-block",
    marginTop: "8px",
    background: "linear-gradient(135deg, #ffb703, #fb8500)",
    color: "#160f0b",
    padding: "10px 14px",
    borderRadius: "999px",
    textDecoration: "none",
    fontWeight: "1000",
  },
  warning: {
    background: "rgba(255,183,3,.12)",
    border: "1px solid rgba(255,183,3,.25)",
    padding: "12px",
    borderRadius: "14px",
    fontWeight: "800",
    fontSize: "14px",
    lineHeight: "1.4",
    color: "#fff7e8",
  },
  item: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "8px",
    padding: "14px 0",
    borderBottom: "1px solid rgba(255,255,255,.12)",
  },
  itemPrice: {
    fontSize: "17px",
    color: "#ffb703",
  },
  small: {
    margin: "5px 0 0",
    fontSize: "13px",
    color: "#cdb89d",
    lineHeight: "1.4",
  },
  remove: {
    background: "rgba(255,255,255,.08)",
    color: "white",
    border: "1px solid rgba(255,255,255,.16)",
    borderRadius: "12px",
    width: "100%",
    padding: "9px",
    cursor: "pointer",
    fontWeight: "900",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "12px",
    fontWeight: "800",
  },
  deliveryBox: {
    background: "rgba(255,183,3,.12)",
    border: "1px solid rgba(255,183,3,.25)",
    padding: "12px",
    borderRadius: "14px",
    margin: "14px 0",
    fontWeight: "700",
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#d7c2a8",
  },
  deliveryImportant: {
    marginTop: "8px",
    fontWeight: "1000",
    color: "#ffb703",
  },
  total: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "26px",
    fontWeight: "1000",
    padding: "18px 0",
    borderTop: "2px solid rgba(255,183,3,.55)",
    marginTop: "15px",
    color: "#ffb703",
  },
  error: {
    color: "#ff6b6b",
    fontWeight: "900",
    lineHeight: "1.4",
  },
  whatsappButton: {
    width: "100%",
    padding: "16px",
    background: "#25D366",
    color: "white",
    border: "none",
    borderRadius: "16px",
    fontWeight: "1000",
    fontSize: "16px",
    marginTop: "10px",
  },
};

export default Checkout;