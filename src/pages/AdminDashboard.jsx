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
  const [codeOk, setCodeOk] = useState(false);

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      const code = prompt("Insere o código de acesso:");

      if (code === ADMIN_CODE) {
        setCodeOk(true);
      } else {
        alert("Código errado.");
      }
    }
  }, [user]);

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

    const year = orders.filter(
      (o) => o.date.getFullYear() === now.getFullYear()
    );

    const sum = (arr) =>
      arr.reduce((total, order) => total + Number(order.total || 0), 0);

    return {
      today: sum(today),
      month: sum(month),
      year: sum(year),
      total: sum(orders),
      count: orders.length,
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
      <div style={styles.page}>
        <main style={styles.container}>
          <h1 style={styles.title}>Acesso restrito</h1>
          <p>Código de acesso necessário.</p>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <h1 style={styles.title}>Dashboard Admin</h1>

        <button
          onClick={toggleDelivery}
          style={{
            ...styles.deliveryToggle,
            background: deliveryEnabled ? "#ff3b3b" : "#25D366",
          }}
        >
          {deliveryEnabled ? "Desligar entregas 🚫" : "Ligar entregas ✅"}
        </button>

        <p style={styles.deliveryStatus}>
          Estado atual:{" "}
          <strong style={{ color: deliveryEnabled ? "#25D366" : "#ff6b6b" }}>
            {deliveryEnabled
              ? "Entregas ligadas"
              : "Hoje não temos motorista de entrega"}
          </strong>
        </p>

        <div style={styles.grid}>
          <Card title="Hoje" value={`€${stats.today.toFixed(2)}`} />
          <Card title="Este mês" value={`€${stats.month.toFixed(2)}`} />
          <Card title="Este ano" value={`€${stats.year.toFixed(2)}`} />
          <Card title="Total" value={`€${stats.total.toFixed(2)}`} />
          <Card title="Pedidos" value={stats.count} />
        </div>

        <section style={styles.card}>
          <h2>Pedidos</h2>

          {loading && <p>A carregar pedidos...</p>}

          {!loading && orders.length === 0 && <p>Ainda não existem pedidos.</p>}

          {orders.map((order) => (
            <div key={order.id} style={styles.order}>
              <div>
                <strong>{order.customerName}</strong>
                <p>{order.date.toLocaleString("pt-PT")}</p>
                <p>📞 {order.phone}</p>
                <p>🚚 {order.method}</p>
                {order.address && <p>📍 {order.address}</p>}

                <div style={styles.items}>
                  {order.items?.map((item, i) => (
                    <p key={i}>
                      {i + 1}. {item.name} — €{Number(item.price).toFixed(2)}
                      {item.drink ? ` | Bebida: ${item.drink}` : ""}
                    </p>
                  ))}
                </div>

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
              </div>

              <strong style={styles.price}>
                €{Number(order.total || 0).toFixed(2)}
              </strong>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <p style={styles.label}>{title}</p>
      <h2 style={styles.value}>{value}</h2>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f0b08",
    color: "#fff7e8",
    padding: "30px 14px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    color: "#ffb703",
    fontSize: "42px",
  },
  deliveryToggle: {
    padding: "14px 20px",
    borderRadius: "14px",
    border: "none",
    fontWeight: "900",
    color: "white",
    marginBottom: "10px",
    cursor: "pointer",
  },
  deliveryStatus: {
    marginTop: 0,
    marginBottom: "24px",
    color: "#d7c2a8",
    fontWeight: "800",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  card: {
    background: "linear-gradient(180deg, #24150e, #130d09)",
    border: "1px solid rgba(255,183,3,.25)",
    borderRadius: "22px",
    padding: "20px",
    boxShadow: "0 18px 45px rgba(0,0,0,.35)",
  },
  label: {
    color: "#cdb89d",
    fontWeight: "900",
    margin: 0,
  },
  value: {
    color: "#ffb703",
    fontSize: "32px",
    margin: "8px 0 0",
  },
  order: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    borderBottom: "1px solid rgba(255,255,255,.12)",
    padding: "18px 0",
  },
  price: {
    color: "#ffb703",
    fontSize: "22px",
    whiteSpace: "nowrap",
  },
  items: {
    marginTop: "10px",
    color: "#d7c2a8",
    fontSize: "14px",
  },
  select: {
    marginTop: "10px",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    fontWeight: "900",
  },
};

export default AdminDashboard;