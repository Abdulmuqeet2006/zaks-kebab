import { useCart } from "../context/CartContext";

function CartSidebar({ open, setOpen }) {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ ...styles.overlay, right: open ? 0 : "-100%" }}>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>🛒 Carrinho</h2>
        <button onClick={() => setOpen(false)} style={styles.close}>×</button>
      </div>

      <div style={styles.items}>
        {cart.length === 0 && <p>O carrinho está vazio.</p>}

        {cart.map((item, i) => (
          <div key={i} style={styles.item}>
            <div>
              <strong>{item.name}</strong>
              <p style={styles.price}>€{item.price.toFixed(2)}</p>
            </div>

            <button onClick={() => removeFromCart(i)} style={styles.remove}>
              ×
            </button>
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <div style={styles.total}>
          <span>Total</span>
          <strong>€{total.toFixed(2)}</strong>
        </div>

        <button style={styles.checkout}>Finalizar Pedido</button>
        <button style={styles.clear} onClick={clearCart}>
          Limpar carrinho
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    right: 0,
    width: "350px",
    height: "100%",
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(15px)",
    boxShadow: "-10px 0 40px rgba(0,0,0,0.2)",
    transition: "0.4s ease",
    display: "flex",
    flexDirection: "column",
    zIndex: 1000,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px",
    borderBottom: "1px solid #eee",
  },
  close: {
    fontSize: "22px",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  items: {
    flex: 1,
    overflowY: "auto",
    padding: "15px",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "10px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  },
  price: {
    margin: 0,
    color: "#666",
  },
  remove: {
    background: "#3b2720",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "6px 10px",
    cursor: "pointer",
  },
  footer: {
    padding: "18px",
    borderTop: "1px solid #eee",
  },
  total: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "18px",
    fontWeight: "900",
    marginBottom: "12px",
  },
  checkout: {
    width: "100%",
    padding: "14px",
    background: "#3b2720",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: "900",
    marginBottom: "8px",
    cursor: "pointer",
  },
  clear: {
    width: "100%",
    padding: "12px",
    background: "#eee",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
};

export default CartSidebar;