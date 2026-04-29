import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartSidebar({ open, setOpen }) {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <style>{css}</style>

      {open && <div className="cart-backdrop" onClick={() => setOpen(false)} />}

      <aside className={`premium-cart ${open ? "open" : ""}`}>
        <div className="cart-header">
          <div>
            <span>🔥 Zaks Kebab</span>
            <h2>O teu carrinho</h2>
          </div>

          <button onClick={() => setOpen(false)}>×</button>
        </div>

        <div className="cart-body">
          {cart.length === 0 && (
            <div className="empty-cart">
              <h3>🛒 Carrinho vazio</h3>
              <p>Adiciona um menu ou kebab para começar o pedido.</p>
              <Link to="/menus" onClick={() => setOpen(false)}>
                Ver Menus
              </Link>
            </div>
          )}

          {cart.map((item, i) => (
            <div className="cart-item" key={i}>
              <div className="item-info">
                <strong>{item.name}</strong>

                {item.drink && <p>🥤 Bebida: {item.drink}</p>}

                {item.extras?.length > 0 && (
                  <p>
                    ➕{" "}
                    {item.extras
                      .map((e) => `${e.name} (+€${e.price.toFixed(2)})`)
                      .join(", ")}
                  </p>
                )}

                {item.notes && <p>📝 {item.notes}</p>}
              </div>

              <div className="item-bottom">
                <span>€{item.price.toFixed(2)}</span>
                <button onClick={() => removeFromCart(i)}>Remover</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="total-line">
            <span>Total</span>
            <strong>€{total.toFixed(2)}</strong>
          </div>

          <Link
            to="/checkout"
            className={`checkout-btn ${cart.length === 0 ? "disabled" : ""}`}
            onClick={(e) => {
              if (cart.length === 0) e.preventDefault();
              else setOpen(false);
            }}
          >
            Finalizar Pedido →
          </Link>

          {cart.length > 0 && (
            <button className="clear-btn" onClick={clearCart}>
              Limpar carrinho
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

const css = `
.cart-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.72);
  backdrop-filter: blur(5px);
  z-index: 900;
}

.premium-cart {
  position: fixed;
  top: 0;
  right: -460px;
  width: 430px;
  max-width: 92vw;
  height: 100vh;
  z-index: 901;
  display: flex;
  flex-direction: column;
  color: #fff7e8;
  background:
    radial-gradient(circle at top right, rgba(255,183,3,.18), transparent 35%),
    linear-gradient(180deg, #24150e, #0f0b08);
  border-left: 1px solid rgba(255,183,3,.3);
  box-shadow: -30px 0 90px rgba(0,0,0,.7);
  transition: .35s ease;
}

.premium-cart.open {
  right: 0;
}

.cart-header {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(255,255,255,.12);
}

.cart-header span {
  color: #ffb703;
  font-weight: 1000;
  letter-spacing: 2px;
  font-size: 12px;
}

.cart-header h2 {
  margin: 6px 0 0;
  font-size: 28px;
}

.cart-header button {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,.1);
  color: white;
  font-size: 30px;
  cursor: pointer;
}

.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 18px;
}

.empty-cart {
  text-align: center;
  padding: 55px 18px;
  border-radius: 24px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,183,3,.18);
}

.empty-cart p {
  color: #cdb89d;
}

.empty-cart a {
  display: inline-block;
  margin-top: 14px;
  padding: 13px 20px;
  border-radius: 999px;
  background: linear-gradient(135deg, #ffb703, #fb8500);
  color: #160f0b;
  font-weight: 1000;
  text-decoration: none;
}

.cart-item {
  padding: 16px;
  margin-bottom: 14px;
  border-radius: 22px;
  background:
    radial-gradient(circle at top right, rgba(255,183,3,.12), transparent 35%),
    rgba(255,255,255,.06);
  border: 1px solid rgba(255,183,3,.18);
  box-shadow: 0 18px 45px rgba(0,0,0,.28);
}

.item-info strong {
  font-size: 17px;
}

.item-info p {
  margin: 6px 0 0;
  color: #cdb89d;
  font-size: 13px;
  line-height: 1.4;
}

.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
}

.item-bottom span {
  color: #ffb703;
  font-size: 20px;
  font-weight: 1000;
}

.item-bottom button {
  border: none;
  border-radius: 999px;
  padding: 8px 12px;
  background: rgba(255,255,255,.1);
  color: white;
  font-weight: 900;
  cursor: pointer;
}

.cart-footer {
  padding: 20px;
  border-top: 1px solid rgba(255,255,255,.12);
  background: rgba(0,0,0,.18);
}

.total-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 1000;
}

.total-line strong {
  color: #ffb703;
  font-size: 28px;
}

.checkout-btn {
  display: block;
  width: 100%;
  padding: 16px;
  border-radius: 18px;
  text-align: center;
  background: linear-gradient(135deg, #ffb703, #fb8500);
  color: #160f0b;
  font-weight: 1000;
  text-decoration: none;
  box-shadow: 0 18px 42px rgba(251,133,0,.35);
}

.checkout-btn.disabled {
  opacity: .45;
  pointer-events: none;
}

.clear-btn {
  width: 100%;
  margin-top: 10px;
  padding: 13px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.18);
  background: rgba(255,255,255,.07);
  color: #fff7e8;
  font-weight: 900;
  cursor: pointer;
}

@media (max-width: 768px) {
  .premium-cart {
    width: 100%;
    max-width: 100%;
    right: -100%;
  }

  .cart-header h2 {
    font-size: 24px;
  }
}
`;

export default CartSidebar;