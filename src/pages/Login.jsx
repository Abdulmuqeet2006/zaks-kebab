import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (mode === "login") {
      const result = await login(form.email, form.password);

      if (!result.success) {
        alert(result.message);
        return;
      }

      // 🔥 AQUI É A MÁGICA
      navigate(from, { replace: true });
      return;
    }

    if (mode === "register") {
      const result = await register(form.name, form.email, form.password);

      if (!result.success) {
        alert(result.message);
        return;
      }

      setMessage("Conta criada! Agora faz login.");
      setMode("login");
    }
  }

  async function handleForgotPassword() {
    if (!form.email) {
      alert("Escreve o teu email primeiro.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, form.email);
      setMessage("Email enviado.");
    } catch {
      alert("Erro ao enviar email.");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>{mode === "login" ? "Login" : "Registar"}</h1>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <input
            name="name"
            placeholder="Nome"
            value={form.name}
            onChange={handleChange}
          />
        )}

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">
          {mode === "login" ? "Entrar" : "Criar conta"}
        </button>
      </form>

      {mode === "login" && (
        <button onClick={handleForgotPassword}>
          Esqueci-me da password
        </button>
      )}

      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        Trocar modo
      </button>
    </div>
  );
}


const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #3b2720, #f4e6c8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "430px",
    background: "#fff8ea",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
  },
  logoBox: {
    textAlign: "center",
    marginBottom: "20px",
  },
  logo: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "18px",
    marginBottom: "10px",
  },
  tabs: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "18px",
  },
  tab: {
    padding: "13px",
    borderRadius: "999px",
    border: "1px solid #3b2720",
    fontWeight: "900",
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: "14px",
    margin: "8px 0",
    borderRadius: "12px",
    border: "1px solid rgba(0,0,0,0.18)",
    background: "#fffdf7",
    boxSizing: "border-box",
    fontSize: "15px",
  },
  passwordBox: {
    display: "flex",
    alignItems: "center",
    background: "#fffdf7",
    border: "1px solid rgba(0,0,0,0.18)",
    borderRadius: "12px",
    margin: "8px 0",
    overflow: "hidden",
  },
  passwordInput: {
    flex: 1,
    padding: "14px",
    border: "none",
    background: "transparent",
    fontSize: "15px",
    outline: "none",
  },
  showButton: {
    padding: "14px",
    border: "none",
    background: "#3b2720",
    color: "white",
    fontWeight: "900",
    cursor: "pointer",
  },
  passwordHelp: {
    fontSize: "13px",
    color: "#6b4d42",
    fontWeight: "700",
    margin: "6px 0",
  },
  forgotButton: {
    background: "transparent",
    border: "none",
    color: "#3b2720",
    fontWeight: "900",
    cursor: "pointer",
    margin: "6px 0 10px",
    padding: 0,
  },
  success: {
    background: "#e9f8df",
    padding: "12px",
    borderRadius: "12px",
    fontWeight: "800",
    color: "#2e7d32",
  },
  mainButton: {
    width: "100%",
    padding: "15px",
    marginTop: "12px",
    background: "#3b2720",
    color: "white",
    border: "none",
    borderRadius: "14px",
    fontWeight: "900",
    fontSize: "16px",
    cursor: "pointer",
  },
  note: {
    textAlign: "center",
    marginTop: "16px",
    color: "#6b4d42",
    fontWeight: "700",
  },
};

export default Login;