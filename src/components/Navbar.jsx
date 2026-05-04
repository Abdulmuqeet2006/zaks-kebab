import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { labels, getLang } from "../data/categories";

const ADMIN_EMAIL = "alvercazakskebab@gmail.com";
const ADMIN_CODE = "Aanm1234";

function Navbar({ setCartOpen }) {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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

  const userName = user?.displayName || user?.email?.split("@")[0] || "Cliente";
  const isAdmin = user?.email === ADMIN_EMAIL;

  function handleAdminAccess() {
  setMenuOpen(false);
  navigate("/zaks-admin");
}

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
            <Link key={path} to={path}>{label}</Link>
          ))}
        </nav>

        <div className="premium-actions">
          <button className="menu-button" onClick={() => setMenuOpen(true)}>☰</button>

          {isAdmin && (
            <button className="admin-button" onClick={handleAdminAccess}>
              Admin 🔐
            </button>
          )}

          <button className="cart-button" onClick={() => setCartOpen(true)}>
            🛒 {cart.length}
          </button>

          {user ? (
            <div className="user-pill">
              <span>👤 {userName}</span>
              <button onClick={logout}>Sair</button>
            </div>
          ) : (
            <Link to="/login" className="login-button">Login</Link>
          )}
        </div>
      </header>

      {menuOpen && <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />}

      <aside className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <button className="drawer-close" onClick={() => setMenuOpen(false)}>×</button>

        <div className="drawer-brand">
          <img src="/images/logo.png" alt="Zaks Kebab" />
          <div>
            <h2>Zaks Kebab</h2>
            <p>Alverca</p>
          </div>
        </div>

        {links.map(([label, path]) => (
          <Link key={path} to={path} onClick={() => setMenuOpen(false)}>
            {label}
          </Link>
        ))}

        {isAdmin && (
          <button className="drawer-admin-button" onClick={handleAdminAccess}>
            Admin 🔐
          </button>
        )}

        <div className="drawer-user">
          {user ? (
            <>
              <p>👤 {userName}</p>
              <button onClick={logout}>Sair</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
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
  line-height: .95;
  font-weight: 1000;
}

.premium-brand p {
  margin: 6px 0 0;
  color: #ffb703;
  font-weight: 1000;
  letter-spacing: 1.5px;
}

.premium-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.premium-links a {
  color: #ead8bd;
  text-decoration: none;
  font-size: 14px;
  font-weight: 1000;
  position: relative;
}

.premium-links a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 0;
  height: 3px;
  background: linear-gradient(135deg, #ffb703, #fb8500);
  border-radius: 99px;
  transition: .25s;
}

.premium-links a:hover::after {
  width: 100%;
}

.premium-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-button {
  display: none;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,.16);
  background: rgba(255,255,255,.08);
  color: white;
  font-size: 23px;
  cursor: pointer;
}

.cart-button,
.login-button,
.admin-button,
.user-pill button,
.drawer-user button,
.drawer-admin-button {
  border: none;
  background: linear-gradient(135deg, #ffb703, #fb8500);
  color: #160f0b;
  padding: 12px 17px;
  border-radius: 999px;
  font-weight: 1000;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 12px 30px rgba(251,133,0,.35);
}

.admin-button {
  background: linear-gradient(135deg, #25D366, #12a150);
  color: white;
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff7e8;
  font-weight: 900;
  font-size: 14px;
}

.menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 101;
  background: rgba(0,0,0,.68);
}

.mobile-drawer {
  position: fixed;
  top: 0;
  right: -100%;
  z-index: 102;
  width: 310px;
  max-width: 86vw;
  height: 100vh;
  padding: 24px;
  background:
    radial-gradient(circle at top, rgba(255,183,3,.16), transparent 35%),
    linear-gradient(180deg, #24140d, #0f0b08);
  border-left: 1px solid rgba(255,183,3,.28);
  box-shadow: -25px 0 70px rgba(0,0,0,.6);
  transition: .32s ease;
}

.mobile-drawer.open {
  right: 0;
}

.drawer-close {
  float: right;
  background: transparent;
  border: none;
  color: white;
  font-size: 36px;
  cursor: pointer;
}

.drawer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 52px 0 22px;
}

.drawer-brand img {
  width: 58px;
  height: 58px;
  border-radius: 16px;
}

.drawer-brand h2 {
  color: #fff7e8;
  margin: 0;
}

.drawer-brand p {
  margin: 4px 0 0;
  color: #ffb703;
  font-weight: 900;
}

.mobile-drawer a {
  display: block;
  padding: 15px;
  margin: 10px 0;
  border-radius: 16px;
  color: #fff7e8;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,183,3,.18);
  font-weight: 1000;
  text-decoration: none;
}

.drawer-admin-button {
  width: 100%;
  margin: 10px 0;
  border-radius: 16px;
  background: linear-gradient(135deg, #25D366, #12a150);
  color: white;
}

.drawer-user {
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid rgba(255,255,255,.12);
  color: #fff7e8;
}

@media (max-width: 900px) {
  .premium-navbar {
    height: 78px;
    padding: 0 12px;
  }

  .premium-links {
    display: none;
  }

  .menu-button {
    display: block;
  }

  .premium-brand img {
    width: 48px;
    height: 48px;
  }

  .premium-brand h2 {
    font-size: 20px;
  }

  .premium-brand p {
    font-size: 13px;
  }

  .user-pill,
  .login-button,
  .admin-button {
    display: none;
  }

  .cart-button {
    padding: 10px 14px;
  }
}
`;

export default Navbar;