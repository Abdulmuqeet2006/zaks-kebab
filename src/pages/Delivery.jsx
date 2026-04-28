import { useState } from "react";

const STORE_MAPS_LINK =
  "https://www.google.com/maps/search/?api=1&query=Zaks%20Kebab%20Alverca";

function Delivery() {
  const [tab, setTab] = useState("delivery");

  return (
    <>
      <style>{css}</style>

      <div className="delivery-page">
        <section className="delivery-hero">
          <span>🚚 ZAKS KEBAB ALVERCA</span>
          <h1>Entrega & Levantamento</h1>
          <p>Recebe o teu pedido quente, fresco e rápido.</p>
        </section>

        <div className="delivery-tabs">
          <button
            className={tab === "delivery" ? "active" : ""}
            onClick={() => setTab("delivery")}
          >
            🛵 Entrega
          </button>

          <button
            className={tab === "pickup" ? "active" : ""}
            onClick={() => setTab("pickup")}
          >
            🏬 Levantamento
          </button>
        </div>

        <main className="delivery-content">
          {tab === "delivery" && (
            <>
              <section className="premium-card">
                <h2>🗺️ Delivery Radius Map</h2>
                <p>Confirma no mapa se estás dentro da nossa zona de entrega.</p>

                <img
                  src="/images/delivery-map.png"
                  alt="Delivery Radius Map - Zaks Kebab Alverca"
                  className="delivery-map"
                />

                <p className="caption">Delivery Radius Map - Zaks Kebab Alverca</p>
              </section>

              <section className="premium-card">
                <h2>📍 Zonas de Entrega</h2>

                <div className="zone">
                  <div>
                    <strong>🟢 Zona 1</strong>
                    <p>0–2 km • Bom Sucesso / Alverca</p>
                  </div>
                  <span>€1.50</span>
                </div>

                <div className="zone">
                  <div>
                    <strong>🟡 Zona 2</strong>
                    <p>2–4 km • Arcena / Forte da Casa</p>
                  </div>
                  <span>€2.00</span>
                </div>

                <div className="zone">
                  <div>
                    <strong>🔴 Zona 3</strong>
                    <p>4–5 km • Sobralinho / arredores</p>
                  </div>
                  <span>€2.50</span>
                </div>

                <div className="highlight">
                  Pedido mínimo para entrega: <strong>€9</strong>
                </div>
              </section>

              <section className="premium-card">
                <h2>⏱️ Horário de Entrega</h2>
                <p>🕐 12:00 – 15:00 e 18:00 – 21:30, todos os dias.</p>
                <p>Tempo estimado: <strong>20–35 minutos</strong>, dependendo da zona.</p>
              </section>
            </>
          )}

          {tab === "pickup" && (
            <>
              <section className="premium-card">
                <h2>🏬 Levantamento na Loja</h2>
                <p>Podes fazer o pedido online e levantar diretamente na loja.</p>

                <div className="highlight">
                  ⏱️ Pronto para levantar em <strong>10–15 minutos</strong>
                </div>

                <a href={STORE_MAPS_LINK} target="_blank" rel="noreferrer" className="gold-btn">
                  📍 Abrir loja no Google Maps
                </a>
              </section>

              <section className="premium-card">
                <h2>🕐 Horário de Levantamento</h2>
                <p>12:00 – 00:30, todos os dias.</p>
              </section>
            </>
          )}

          <section className="premium-card">
            <h2>📦 Como Fazer Pedido</h2>

            <div className="steps">
              <div><span>1</span><p>Escolhe a categoria: Menus, Sem Menus, Pratos, Bebidas ou Acompanhamentos.</p></div>
              <div><span>2</span><p>Clica no produto, escolhe bebida incluída se tiver menu e adiciona extras se quiseres.</p></div>
              <div><span>3</span><p>Vai ao carrinho e confirma o teu pedido no checkout.</p></div>
              <div><span>4</span><p>Escolhe Entrega ou Levantamento e preenche os teus dados.</p></div>
              <div><span>5</span><p>Envia o pedido por WhatsApp ou Email e espera a confirmação da loja.</p></div>
            </div>
          </section>

          <section className="premium-card">
            <h2>💳 Pagamento</h2>
            <p>O pagamento é feito quando o pedido chega ou quando levantas na loja.</p>
            <div className="payment-grid">
              <div>💵 Dinheiro</div>
              <div>📱 MB Way</div>
            </div>
          </section>

          <section className="premium-card">
            <h2>ℹ️ Informação Importante</h2>
            <ul>
              <li>Pedidos são confirmados manualmente pela loja.</li>
              <li>A comida é preparada fresca após confirmação.</li>
              <li>Em horas de maior movimento, a entrega pode demorar mais.</li>
              <li>Se o motorista não estiver disponível, a loja pode sugerir levantamento.</li>
            </ul>
          </section>
        </main>
      </div>
    </>
  );
}

const css = `
.delivery-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top right, rgba(255,183,3,.10), transparent 36%),
    linear-gradient(180deg, #0f0b08, #1b120d);
  color: #fff7e8;
  padding-bottom: 70px;
}

.delivery-hero {
  text-align: center;
  padding: 70px 20px 35px;
}

.delivery-hero span {
  color: #ffb703;
  font-weight: 1000;
  letter-spacing: 3px;
  font-size: 13px;
}

.delivery-hero h1 {
  font-size: clamp(40px, 7vw, 76px);
  margin: 12px 0;
  font-weight: 1000;
  letter-spacing: -2px;
}

.delivery-hero p {
  color: #cdb89d;
  font-size: 18px;
}

.delivery-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 0 16px 28px;
}

.delivery-tabs button {
  padding: 13px 22px;
  border-radius: 999px;
  border: 1px solid rgba(255,183,3,.35);
  background: rgba(255,255,255,.06);
  color: #fff7e8;
  cursor: pointer;
  font-weight: 1000;
}

.delivery-tabs button.active {
  background: linear-gradient(135deg, #ffb703, #fb8500);
  color: #160f0b;
  box-shadow: 0 14px 34px rgba(251,133,0,.28);
}

.delivery-content {
  max-width: 1050px;
  margin: auto;
  padding: 0 16px;
  display: grid;
  gap: 22px;
}

.premium-card {
  background:
    radial-gradient(circle at top right, rgba(255,183,3,.12), transparent 34%),
    linear-gradient(180deg, #24150e, #130d09);
  border: 1px solid rgba(255,183,3,.25);
  border-radius: 26px;
  padding: 24px;
  box-shadow: 0 24px 60px rgba(0,0,0,.38);
}

.premium-card h2 {
  color: #ffb703;
  margin-top: 0;
}

.premium-card p,
.premium-card li {
  color: #d7c2a8;
  line-height: 1.6;
}

.delivery-map {
  width: 100%;
  border-radius: 22px;
  margin-top: 14px;
  border: 1px solid rgba(255,183,3,.25);
  box-shadow: 0 18px 45px rgba(0,0,0,.35);
}

.caption {
  text-align: center;
  font-weight: 900;
  color: #ffb703 !important;
}

.zone {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255,255,255,.12);
}

.zone p {
  margin: 4px 0 0;
}

.zone span {
  color: #ffb703;
  font-size: 22px;
  font-weight: 1000;
}

.highlight {
  margin-top: 18px;
  padding: 14px;
  border-radius: 16px;
  background: rgba(255,183,3,.12);
  border: 1px solid rgba(255,183,3,.3);
  font-weight: 900;
}

.gold-btn {
  display: inline-block;
  margin-top: 16px;
  padding: 13px 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, #ffb703, #fb8500);
  color: #160f0b;
  font-weight: 1000;
  text-decoration: none;
}

.steps {
  display: grid;
  gap: 14px;
}

.steps div {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,183,3,.16);
  padding: 14px;
  border-radius: 18px;
}

.steps span {
  min-width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffb703, #fb8500);
  color: #160f0b;
  display: grid;
  place-items: center;
  font-weight: 1000;
}

.steps p {
  margin: 0;
}

.payment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
  margin-top: 14px;
}

.payment-grid div {
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,183,3,.18);
  padding: 16px;
  border-radius: 18px;
  font-weight: 1000;
}

@media (max-width: 768px) {
  .delivery-hero {
    padding: 48px 16px 24px;
  }

  .premium-card {
    padding: 18px;
    border-radius: 22px;
  }

  .zone {
    flex-direction: column;
  }

  .delivery-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
`;

export default Delivery;