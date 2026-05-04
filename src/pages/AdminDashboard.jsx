import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

const ADMIN_EMAIL = "alvercazakskebab@gmail.com";
const ADMIN_CODE = "Aanm1234";

function AdminDashboard() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [codeInput, setCodeInput] = useState("");
  const [codeOk, setCodeOk] = useState(false);

  async function loadOrders() {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      date: d.data().createdAt?.toDate?.() || new Date(),
    }));

    setOrders(data);
    setLoading(false);
  }

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL && codeOk) {
      loadOrders();

      const unsub = onSnapshot(doc(db, "settings", "store"), (snap) => {
        if (snap.exists()) {
          setDeliveryEnabled(snap.data().deliveryEnabled ?? true);
        }
      });

      return () => unsub();
    }
  }, [user, codeOk]);

  function submitCode(e) {
    e.preventDefault();

    if (codeInput === ADMIN_CODE) {
      setCodeOk(true);
    } else {
      alert("Código errado.");
      setCodeInput("");
    }
  }

  async function toggleDelivery() {
    await setDoc(
      doc(db, "settings", "store"),
      { deliveryEnabled: !deliveryEnabled },
      { merge: true }
    );
  }

  async function updateStatus(orderId, status) {
    await updateDoc(doc(db, "orders", orderId), { status });
    loadOrders();
  }

  function openWhatsApp(order) {
    const phone = String(order.phone || "").replace(/\D/g, "");
    const finalPhone = phone.startsWith("351") ? phone : `351${phone}`;

    const msg = `Olá ${order.customerName}, é da Zaks Kebab Alverca. Estamos a confirmar o seu pedido.`;
    window.open(
      `https://wa.me/${finalPhone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  }

  const stats = useMemo(() => {
    const now = new Date();

    const today = orders.filter(
      (o) => o.date.toDateString() === now.toDateString()
    );

    const month = orders.filter(
      (o) =>
        o.date.getMonth() === now.getMonth() &&
        o.date.getFullYear() === now.getFullYear()
    );

    const year = orders.filter((o) => o.date.getFullYear() === now.getFullYear());

    const sum = (arr) =>
      arr.reduce((total, order) => total + Number(order.total || 0), 0);

    return {
      today: sum(today),
      month: sum(month),
      year: sum(year),
      total: sum(orders),
      count: orders.length,
      average: orders.length ? sum(orders) / orders.length : 0,
      newOrders: orders.filter((o) => (o.status || "new") === "new").length,
    };
  }, [orders]);

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: { pathname: "/zaks-admin" } }}
        replace
      />
    );
  }

  if (user.email !== ADMIN_EMAIL) return <Navigate to="/" />;

  if (!codeOk) {
    return (
      <div style={styles.accessPage}>
        <form onSubmit={submitCode} style={styles.accessCard}>
          <div style={styles.lockIcon}>🔐</div>
          <p style={styles.kicker}>Zaks Kebab Alverca</p>
          <h1 style={styles.accessTitle}>Acesso Admin</h1>
          <p style={styles.accessText}>
            Introduz o código para abrir o painel de gestão.
          </p>

          <input
            style={styles.codeInput}
            type="password"
            placeholder="Código de acesso"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            autoFocus
          />

          <button style={styles.codeButton}>Entrar no Dashboard</button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          <img src="/images/logo.png" alt="Zaks Kebab" style={styles.logo} />
          <h2 style={styles.brand}>Zaks Kebab</h2>
          <p style={styles.brandSub}>Admin Panel</p>
        </div>

        <div style={styles.sideBox}>
          <p style={styles.sideLabel}>Estado</p>
          <strong style={{ color: deliveryEnabled ? "#25D366" : "#ff6b6b" }}>
            {deliveryEnabled ? "Entregas ON" : "Só levantamento"}
          </strong>
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <p style={styles.kicker}>Painel de controlo</p>
            <h1 style={styles.title}>Dashboard Admin</h1>
            <p style={styles.subtitle}>
              Gere pedidos, entregas e rendimento da loja.
            </p>
          </div>

          <button
            onClick={toggleDelivery}
            style={{
              ...styles.deliveryButton,
              background: deliveryEnabled
                ? "linear-gradient(135deg, #ff3b3b, #9b111e)"
                : "linear-gradient(135deg, #25D366, #0f8f45)",
            }}
          >
            {deliveryEnabled ? "Desligar entregas 🚫" : "Ligar entregas ✅"}
          </button>
        </div>

        <div style={styles.statsGrid}>
          <Stat title="Hoje" value={`€${stats.today.toFixed(2)}`} icon="📅" />
          <Stat title="Este mês" value={`€${stats.month.toFixed(2)}`} icon="💰" />
          <Stat title="Este ano" value={`€${stats.year.toFixed(2)}`} icon="📈" />
          <Stat title="Total" value={`€${stats.total.toFixed(2)}`} icon="🏦" />
          <Stat title="Pedidos" value={stats.count} icon="🧾" />
          <Stat title="Média" value={`€${stats.average.toFixed(2)}`} icon="⚡" />
        </div>

        <section style={styles.ordersPanel}>
          <div style={styles.ordersHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Pedidos recentes</h2>
              <p style={styles.sectionSub}>
                {stats.newOrders} pedidos novos por tratar
              </p>
            </div>
          </div>

          {loading && <p>A carregar pedidos...</p>}
          {!loading && orders.length === 0 && <p>Ainda não existem pedidos.</p>}

          <div style={styles.ordersList}>
            {orders.map((order) => (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderTop}>
                  <div>
                    <h3 style={styles.customer}>{order.customerName}</h3>
                    <p style={styles.orderInfo}>
                      {order.date.toLocaleString("pt-PT")}
                    </p>
                  </div>

                  <div style={styles.rightTop}>
                    <StatusBadge status={order.status || "new"} />
                    <strong style={styles.price}>
                      €{Number(order.total || 0).toFixed(2)}
                    </strong>
                  </div>
                </div>

                <div style={styles.infoGrid}>
                  <p>📞 {order.phone}</p>
                  <p>🚚 {order.method}</p>
                  {order.address && <p>📍 {order.address}</p>}
                  {order.payment && <p>💳 {order.payment}</p>}
                </div>

                <div style={styles.itemsBox}>
                  {order.items?.map((item, i) => (
                    <p key={i} style={styles.itemLine}>
                      <strong>{i + 1}. {item.name}</strong> — €
                      {Number(item.price || 0).toFixed(2)}
                      {item.drink ? ` | Bebida: ${item.drink}` : ""}
                    </p>
                  ))}
                </div>

                {order.notes && (
                  <p style={styles.notes}>📝 {order.notes}</p>
                )}

                <div style={styles.orderActions}>
                  <select
                    value={order.status || "new"}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    style={styles.select}
                  >
                    <option value="new">Novo</option>
                    <option value="preparing">Em preparação</option>
                    <option value="delivered">Entregue</option>
                    <option value="cancelled">Cancelado</option>
                  </select>

                  <button
                    style={styles.whatsappBtn}
                    onClick={() => openWhatsApp(order)}
                  >
                    WhatsApp 💬
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ title, value, icon }) {
  return (
    <div style={styles.statCard}>
      <span style={styles.statIcon}>{icon}</span>
      <p style={styles.statTitle}>{title}</p>
      <h2 style={styles.statValue}>{value}</h2>
    </div>
  );
}

function StatusBadge({ status }) {
  const data = {
    new: ["Novo", "#25D366"],
    preparing: ["Em preparação", "#ffb703"],
    delivered: ["Entregue", "#4CAF50"],
    cancelled: ["Cancelado", "#ff3b3b"],
  };

  const [label, color] = data[status] || data.new;

  return (
    <span
      style={{
        ...styles.badge,
        background: `${color}22`,
        color,
        border: `1px solid ${color}66`,
      }}
    >
      {label}
    </span>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    background:
      "radial-gradient(circle at top right, rgba(255,183,3,.18), transparent 34%), linear-gradient(180deg, #0f0b08, #1b120d)",
    color: "#fff7e8",
  },

  sidebar: {
    padding: "28px",
    background:
      "linear-gradient(180deg, rgba(36,21,14,.98), rgba(15,11,8,.98))",
    borderRight: "1px solid rgba(255,183,3,.22)",
    position: "sticky",
    top: 0,
    height: "100vh",
    boxSizing: "border-box",
  },

  logo: {
    width: "76px",
    height: "76px",
    borderRadius: "22px",
    objectFit: "cover",
    boxShadow: "0 0 36px rgba(255,183,3,.45)",
  },

  brand: {
    margin: "14px 0 0",
    fontSize: "26px",
    color: "#ffb703",
  },

  brandSub: {
    margin: "6px 0 0",
    color: "#d7c2a8",
    fontWeight: "900",
  },

  sideBox: {
    marginTop: "30px",
    padding: "16px",
    borderRadius: "20px",
    background: "rgba(255,255,255,.06)",
    border: "1px solid rgba(255,183,3,.18)",
  },

  sideLabel: {
    margin: "0 0 6px",
    color: "#cdb89d",
    fontWeight: "900",
  },

  main: {
    padding: "30px",
    maxWidth: "1300px",
    width: "100%",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "18px",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "24px",
  },

  kicker: {
    margin: 0,
    color: "#ffb703",
    fontWeight: "1000",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontSize: "12px",
  },

  title: {
    margin: "6px 0",
    fontSize: "clamp(38px, 5vw, 64px)",
    color: "#fff7e8",
    fontWeight: "1000",
  },

  subtitle: {
    margin: 0,
    color: "#d7c2a8",
    fontWeight: "800",
  },

  deliveryButton: {
    border: "none",
    borderRadius: "999px",
    color: "white",
    padding: "15px 22px",
    fontWeight: "1000",
    cursor: "pointer",
    boxShadow: "0 18px 45px rgba(0,0,0,.45)",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },

  statCard: {
    padding: "20px",
    borderRadius: "26px",
    background:
      "radial-gradient(circle at top right, rgba(255,183,3,.16), transparent 36%), linear-gradient(180deg, #24150e, #130d09)",
    border: "1px solid rgba(255,183,3,.24)",
    boxShadow: "0 20px 50px rgba(0,0,0,.35)",
  },

  statIcon: {
    fontSize: "24px",
  },

  statTitle: {
    margin: "12px 0 6px",
    color: "#cdb89d",
    fontWeight: "900",
  },

  statValue: {
    margin: 0,
    color: "#ffb703",
    fontSize: "32px",
    fontWeight: "1000",
  },

  ordersPanel: {
    padding: "22px",
    borderRadius: "30px",
    background:
      "linear-gradient(180deg, rgba(36,21,14,.96), rgba(15,11,8,.96))",
    border: "1px solid rgba(255,183,3,.22)",
    boxShadow: "0 30px 80px rgba(0,0,0,.42)",
  },

  ordersHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "28px",
  },

  sectionSub: {
    margin: "6px 0 0",
    color: "#d7c2a8",
    fontWeight: "800",
  },

  ordersList: {
    display: "grid",
    gap: "16px",
  },

  orderCard: {
    padding: "18px",
    borderRadius: "24px",
    background:
      "radial-gradient(circle at top right, rgba(255,183,3,.08), transparent 35%), rgba(255,255,255,.045)",
    border: "1px solid rgba(255,255,255,.10)",
  },

  orderTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    alignItems: "flex-start",
  },

  customer: {
    margin: 0,
    fontSize: "22px",
    color: "#fff7e8",
  },

  orderInfo: {
    margin: "6px 0 0",
    color: "#cdb89d",
    fontWeight: "800",
  },

  rightTop: {
    display: "grid",
    justifyItems: "end",
    gap: "8px",
  },

  badge: {
    padding: "7px 11px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "1000",
  },

  price: {
    color: "#ffb703",
    fontSize: "24px",
    fontWeight: "1000",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "8px",
    marginTop: "14px",
    color: "#d7c2a8",
    fontWeight: "800",
  },

  itemsBox: {
    marginTop: "12px",
    padding: "12px",
    borderRadius: "16px",
    background: "rgba(0,0,0,.22)",
    border: "1px solid rgba(255,255,255,.08)",
  },

  itemLine: {
    margin: "6px 0",
    color: "#e8d6bc",
  },

  notes: {
    marginTop: "10px",
    color: "#ffcf77",
    fontWeight: "800",
  },

  orderActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "14px",
  },

  select: {
    padding: "11px 13px",
    borderRadius: "14px",
    border: "none",
    background: "#fff7e8",
    color: "#160f0b",
    fontWeight: "900",
  },

  whatsappBtn: {
    padding: "11px 15px",
    borderRadius: "14px",
    border: "none",
    background: "#25D366",
    color: "white",
    fontWeight: "1000",
    cursor: "pointer",
  },

  accessPage: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "20px",
    background:
      "radial-gradient(circle at top right, rgba(255,183,3,.18), transparent 38%), linear-gradient(180deg, #0f0b08, #1b120d)",
  },

  accessCard: {
    width: "100%",
    maxWidth: "440px",
    padding: "34px",
    borderRadius: "32px",
    background:
      "radial-gradient(circle at top right, rgba(255,183,3,.16), transparent 36%), linear-gradient(180deg, #24150e, #130d09)",
    border: "1px solid rgba(255,183,3,.25)",
    boxShadow: "0 35px 90px rgba(0,0,0,.55)",
    textAlign: "center",
  },

  lockIcon: {
    fontSize: "44px",
    marginBottom: "12px",
  },

  accessTitle: {
    margin: "8px 0",
    fontSize: "38px",
    color: "#ffb703",
  },

  accessText: {
    color: "#d7c2a8",
    fontWeight: "800",
  },

  codeInput: {
    width: "100%",
    padding: "16px",
    borderRadius: "16px",
    border: "1px solid rgba(255,183,3,.25)",
    background: "#fff7e8",
    color: "#160f0b",
    fontSize: "16px",
    boxSizing: "border-box",
    marginTop: "14px",
  },

  codeButton: {
    width: "100%",
    marginTop: "12px",
    padding: "16px",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(135deg, #ffb703, #fb8500)",
    color: "#160f0b",
    fontWeight: "1000",
    cursor: "pointer",
  },

  "@media": {},
};

export default AdminDashboard;