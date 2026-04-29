import { Link } from "react-router-dom";

function SeoPage({ title, subtitle, keywords }) {
  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <span style={styles.badge}>Zaks Kebab Alverca</span>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>{subtitle}</p>

        <div style={styles.buttons}>
          <Link to="/menus" style={styles.mainBtn}>Ver Menus</Link>
          <Link to="/delivery" style={styles.secondBtn}>Entrega</Link>
        </div>
      </section>

      <section style={styles.card}>
        <h2>Porque escolher Zaks Kebab Alverca?</h2>
        <p>
          No Zaks Kebab Alverca encontras kebabs, durum, pratos, hambúrgueres,
          bebidas e acompanhamentos preparados frescos. Faz o teu pedido online
          e envia diretamente por WhatsApp.
        </p>

        <div style={styles.grid}>
          <div>🥙 Kebab e Durum</div>
          <div>🚚 Entrega em Alverca</div>
          <div>🏬 Takeaway</div>
          <div>📲 Pedido por WhatsApp</div>
        </div>

        <p style={styles.keywords}>{keywords}</p>
      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top right, rgba(255,183,3,.12), transparent 36%), linear-gradient(180deg, #0f0b08, #1b120d)",
    color: "#fff7e8",
    padding: "40px 16px 80px",
  },
  hero: {
    maxWidth: "1000px",
    margin: "0 auto",
    textAlign: "center",
    padding: "70px 0 40px",
  },
  badge: {
    color: "#ffb703",
    fontWeight: "1000",
    letterSpacing: "2px",
  },
  title: {
    fontSize: "clamp(42px, 7vw, 78px)",
    color: "#ffb703",
    margin: "16px 0",
    fontWeight: "1000",
  },
  subtitle: {
    color: "#d7c2a8",
    fontSize: "20px",
    lineHeight: "1.6",
    maxWidth: "760px",
    margin: "0 auto",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "30px",
  },
  mainBtn: {
    background: "linear-gradient(135deg, #ffb703, #fb8500)",
    color: "#160f0b",
    padding: "14px 24px",
    borderRadius: "999px",
    fontWeight: "1000",
    textDecoration: "none",
  },
  secondBtn: {
    background: "rgba(255,255,255,.08)",
    color: "#fff7e8",
    padding: "14px 24px",
    borderRadius: "999px",
    fontWeight: "1000",
    textDecoration: "none",
    border: "1px solid rgba(255,183,3,.25)",
  },
  card: {
    maxWidth: "1000px",
    margin: "0 auto",
    background:
      "radial-gradient(circle at top right, rgba(255,183,3,.13), transparent 34%), linear-gradient(180deg, #24150e, #130d09)",
    border: "1px solid rgba(255,183,3,.25)",
    borderRadius: "28px",
    padding: "28px",
    boxShadow: "0 24px 60px rgba(0,0,0,.42)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    marginTop: "24px",
  },
  keywords: {
    marginTop: "24px",
    color: "#cdb89d",
    fontSize: "14px",
  },
};

export default SeoPage;