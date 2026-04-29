import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { labels, getLang } from "../data/categories";

function Navbar({ setCartOpen }) {
  const { cartCount } = useCart(); // ✅ correto
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const lang = getLang();
  const t = labels[lang];

  const links = [
    [t.home, "/"],
    [t.menus, "/menus"],
    [t.withoutMenu, "/without-menu"],
    [t.dishes, "/dishes"],
    [t.drinks, "/bebidas"],
    [t.extras, "/extras"],
    [t.delivery, "/delivery"],
  ];

  const userName =
    user?.displayName || user?.email?.split("@")[0] || "Cliente";

  return (
    <>
      <style>{css}</style>

      <header className="premium-navbar">
        <Link to="/" className="premium-brand">
          <img src="/images/logo.png" alt="Zaks Kebab" />
          <div>
            <h2>Zaks Kebab</h2>
            <p>Alverca</p>
          </div>
        </Link>

        <nav className="premium-links">
          {links.map(([label, path]) => (
            <Link key={path} to={path}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="premium-actions">
          <button
            className="menu-button"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>

          {/* ✅ CART FIX */}
          <button
            className="cart-button"
            onClick={() => setCartOpen(true)}
          >
            🛒 {cartCount}
          </button>

          {user ? (
            <div className="user-pill">
              <span>👤 {userName}</span>
              <button onClick={logout}>Sair</button>
            </div>
          ) : (
            <Link to="/login" className="login-button">
              Login
            </Link>
          )}
        </div>
      </header>

      {menuOpen && (
        <div
          className="menu-backdrop"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <button
          className="drawer-close"
          onClick={() => setMenuOpen(false)}
        >
          ×
        </button>

        <div className="drawer-brand">
          <img src="/images/logo.png" alt="Zaks Kebab" />
          <div>
            <h2>Zaks Kebab</h2>
            <p>Alverca</p>
          </div>
        </div>

        {links.map(([label, path]) => (
          <Link
            key={path}
            to={path}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}

        <div className="drawer-user">
          {user ? (
            <>
              <p>👤 {userName}</p>
              <button onClick={logout}>Sair</button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}

const css = `
.premium-navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 88px;
  padding: 0 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background:
    linear-gradient(90deg, rgba(13,8,5,.96), rgba(30,17,10,.92)),
    radial-gradient(circle at top left, rgba(255,183,3,.20), transparent 35%);
  border-bottom: 1px solid rgba(255,183,3,.25);
  box-shadow: 0 20px 50px rgba(0,0,0,.45);
  backdrop-filter: blur(18px);
}

.premium-brand {
  display: flex;
  align-items: center;
  gap: 13px;
  text-decoration: none;
}

.premium-brand img {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 0 28px rgba(255,183,3,.42);
}

.premium-brand h2 {
  margin: 0;
  color: #fff7e8;
  font-size: 22px;
  font-weight: 1000;
}

.premium-brand p {
  margin: 6px 0 0;
  color: #ffb703;
  font-weight: 1000;
}

.premium-links {
  display: flex;
  gap: 24px;
}

.premium-links a {
  color: #ead8bd;
  text-decoration: none;
  font-weight: 1000;
}

.premium-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cart-button {
  background: linear-gradient(135deg, #ffb703, #fb8500);
  border: none;
  padding: 12px 17px;
  border-radius: 999px;
  font-weight: 1000;
  cursor: pointer;
}
`;

export default Navbar;