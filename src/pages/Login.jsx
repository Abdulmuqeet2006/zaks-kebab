import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

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

  function isStrongPassword(password) {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (mode === "login") {
      if (!form.email || !form.password) {
        alert("Preenche email e password.");
        return;
      }

      const result = await login(form.email, form.password);

      if (!result.success) {
        alert(result.message);
        return;
      }

      navigate("/");
      return;
    }

    if (mode === "register") {
      if (!form.name || !form.email || !form.password) {
        alert("Preenche nome, email e password.");
        return;
      }

      if (!isStrongPassword(form.password)) {
        alert(
          "A password deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número."
        );
        return;
      }

      const result = await register(form.name, form.email, form.password);

      if (!result.success) {
        alert(result.message);
        return;
      }

      setMessage("Conta criada! Verifica o teu email e depois faz login.");
      setMode("login");
      setForm({
        name: "",
        email: form.email,
        password: "",
      });
    }
  }

  async function handleForgotPassword() {
    if (!form.email) {
      alert("Escreve o teu email primeiro.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, form.email);
      setMessage("Email para recuperar password enviado. Verifica a tua caixa de entrada ou spam.");
    } catch (error) {
      alert("Não foi possível enviar o email. Confirma se o email está correto.");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoBox}>
          <img src="/images/logo.png" alt="Zaks Kebab" style={styles.logo} />
          <h1>Zaks Kebab</h1>
          <p>Alverca</p>
        </div>

        <div style={styles.tabs}>
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setMessage("");
            }}
            style={{
              ...styles.tab,
              background: mode === "login" ? "#3b2720" : "#fff8ea",
              color: mode === "login" ? "white" : "#3b2720",
            }}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("register");
              setMessage("");
            }}
            style={{
              ...styles.tab,
              background: mode === "register" ? "#3b2720" : "#fff8ea",
              color: mode === "register" ? "white" : "#3b2720",
            }}
          >
            Registar
          </button>
        </div>

        {message && <p style={styles.success}>{message}</p>}

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <input
              style={styles.input}
              name="name"
              placeholder="Nome completo"
              value={form.name}
              onChange={handleChange}
            />
          )}

          <input
            style={styles.input}
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <div style={styles.passwordBox}>
            <input
              style={styles.passwordInput}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            <button
              type="button"
              style={styles.showButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {mode === "register" && (
            <p style={styles.passwordHelp}>
              Password forte: mínimo 8 caracteres, 1 maiúscula, 1 minúscula e 1 número.
            </p>
          )}

          {mode === "login" && (
            <button
              type="button"
              onClick={handleForgotPassword}
              style={styles.forgotButton}
            >
              Esqueceste a password?
            </button>
          )}

          <button style={styles.mainButton}>
            {mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <p style={styles.note}>
          {mode === "login"
            ? "Ainda não tens conta? Clica em Registar."
            : "Já tens conta? Clica em Login."}
        </p>
      </div>
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