const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const fetch = require("node-fetch");

// 🔐 METE O TEU TOKEN AQUI
const BOT_TOKEN = "8794370064:AAGHNM49wZlwhUyLVO07prjszixjSPsOD7I";
const CHAT_ID = "8763381847";

exports.newOrderNotification = onDocumentCreated(
  "orders/{orderId}",
  async (event) => {
    const order = event.data.data();

    const items = order.items
      ?.map((item, i) => `${i + 1}. ${item.name} — €${item.price}`)
      .join("\n") || "Sem itens";

    const message = `
🍔 NOVO PEDIDO!

👤 ${order.customerName}
📞 ${order.phone}

📦 ${order.method}
📍 ${order.address || "Levantamento"}

💰 €${order.total}

🧾 Itens:
${items}
`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
        }),
      });

      console.log("Telegram enviado!");
    } catch (err) {
      console.error("Erro Telegram:", err);
    }
  }
);