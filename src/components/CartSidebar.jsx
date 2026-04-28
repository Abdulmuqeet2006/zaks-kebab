import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartSidebar({ open, setOpen }) {
  const { cart, removeFromCart } = useCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      {open && <div className="cart-backdrop" onClick={() => setOpen(false)} />}

      <aside className={`cart-sidebar ${open ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setOpen(false)}>×</button>

        <h2>Your Cart</h2>

        {cart.length === 0 && <p>O carrinho está vazio.</p>}

        {cart.map((item, i) => (
          <div key={i} className="cart-item">
            <div>
              <strong>{item.name}</strong>
              {item.extras?.length > 0 && (
                <p>Extras: {item.extras.map((e) => e.name).join(", ")}</p>
              )}
              {item.notes && <p>Notas: {item.notes}</p>}
            </div>

            <strong>€{item.price.toFixed(2)}</strong>

            <button onClick={() => removeFromCart(i)}>×</button>
          </div>
        ))}

        <div className="cart-total">
          <span>Subtotal</span>
          <strong>€{subtotal.toFixed(2)}</strong>
        </div>

        <Link
          to="/checkout"
          onClick={() => setOpen(false)}
          className={`checkout-link ${cart.length === 0 ? "disabled" : ""}`}
        >
          Ir para Checkout
        </Link>
      </aside>
    </>
  );
}

export default CartSidebar;