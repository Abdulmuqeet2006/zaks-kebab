import { useState } from "react";
import { useCart } from "../context/CartContext";

const DRINKS_NORMAL = [
  "Pepsi 33cl",
  "Lipton Ice Tea Limão 33cl",
  "Lipton Ice Tea Manga 33cl",
  "Sumol Ananás 33cl",
  "Sumol Laranja 33cl",
  "Água 50cl",
];

const DRINKS_1L = [
  "Coca-Cola 1L",
  "Coca-Cola Zero 1L",
  "Pepsi 1L",
  "Pepsi Max 1L",
];

function normalize(text = "") {
  return text.toLowerCase();
}

function hasDrink(item) {
  const text = normalize(`${item.name} ${item.desc}`);
  return item.category === "menus" || text.includes("bebida") || text.includes("drink");
}

function hasOneLiterDrink(item) {
  const text = normalize(`${item.name} ${item.desc}`);
  return text.includes("1l") || text.includes("litro");
}

function getAllowedExtras(item) {
  if (item.category === "bebidas" || item.category === "extras") return [];

  const text = normalize(`${item.name} ${item.desc}`);

  const isFrango =
    text.includes("frango") ||
    text.includes("chicken") ||
    text.includes("nuggets");

  const isKebab = text.includes("kebab");
  const isDurum = text.includes("durum");
  const isDonerBox = text.includes("doner box");
  const isBurger = text.includes("burger") || text.includes("hamb");

  if (isFrango) {
    return [{ name: "Molho Extra (1 caixa)", price: 1.0 }];
  }

  const extras = [];

  if (isKebab || isDurum || isDonerBox || isBurger) {
    extras.push({ name: "Molho Extra (1 caixa)", price: 1.0 });
  }

  if (isKebab || isDurum) {
    extras.push({ name: "Batata Frita (Dentro)", price: 0.7 });
  }

  if (isKebab || isDurum || isDonerBox || isBurger) {
    extras.push({ name: "Queijo Extra", price: 0.7 });
  }

  return extras;
}

function FoodCard({ item }) {
  const { addToCart } = useCart();

  const [open, setOpen] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [selectedDrink, setSelectedDrink] = useState("");
  const [notes, setNotes] = useState("");

  const allowedExtras = getAllowedExtras(item);
  const showDrinkChoice = hasDrink(item);
  const drinkOptions = hasOneLiterDrink(item) ? DRINKS_1L : DRINKS_NORMAL;

  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const finalPrice = item.price + extrasTotal;

  function toggleExtra(extra) {
    const exists = selectedExtras.find((e) => e.name === extra.name);

    if (exists) {
      setSelectedExtras(selectedExtras.filter((e) => e.name !== extra.name));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  }

  function addProductToCart() {
    if (showDrinkChoice && !selectedDrink) {
      alert("Escolhe uma bebida para este menu.");
      return;
    }

    addToCart({
      ...item,
      basePrice: item.price,
      price: finalPrice,
      extras: selectedExtras,
      drink: showDrinkChoice ? selectedDrink : "",
      notes,
    });

    setOpen(false);
    setSelectedExtras([]);
    setSelectedDrink("");
    setNotes("");
  }

  return (
    <>
      <style>{css}</style>

      <article className="food-card" onClick={() => setOpen(true)}>
        <div className="food-image-wrap">
          <img src={item.image} alt={item.name} />
          <span>€{item.price.toFixed(2)}</span>
        </div>

        <div className="food-content">
          <h3>{item.name}</h3>
          <p>{item.desc}</p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            Add +
          </button>
        </div>
      </article>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="food-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpen(false)}>
              ×
            </button>

            <img className="modal-img" src={item.image} alt={item.name} />

            <h2>{item.name}</h2>
            <p className="modal-desc">{item.desc}</p>

            {showDrinkChoice && (
              <div className="drink-box">
                <h3>Bebida incluída</h3>
                <p>
                  {hasOneLiterDrink(item)
                    ? "Escolhe uma bebida de 1L sem pagar extra."
                    : "Escolhe uma bebida sem pagar extra."}
                </p>

                <select
                  value={selectedDrink}
                  onChange={(e) => setSelectedDrink(e.target.value)}
                >
                  <option value="">Selecionar bebida</option>
                  {drinkOptions.map((drink) => (
                    <option key={drink} value={drink}>
                      {drink}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {allowedExtras.length > 0 && (
              <>
                <h3>Extras disponíveis</h3>

                {allowedExtras.map((extra) => (
                  <label key={extra.name} className="extra-row">
                    <span>
                      <input
                        type="checkbox"
                        checked={selectedExtras.some((e) => e.name === extra.name)}
                        onChange={() => toggleExtra(extra)}
                      />
                      {extra.name}
                    </span>

                    <strong>+€{extra.price.toFixed(2)}</strong>
                  </label>
                ))}
              </>
            )}

            {allowedExtras.length === 0 && !showDrinkChoice && (
              <p className="no-extra">Este produto não tem opções extra.</p>
            )}

            <textarea
              placeholder="Notas: sem cebola, mais molho, sem salada..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="modal-total">
              <span>Total</span>
              <strong>€{finalPrice.toFixed(2)}</strong>
            </div>

            <button className="modal-add" onClick={addProductToCart}>
              Add to cart
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const css = `
.food-card {
  overflow: hidden;
  cursor: pointer;
  border-radius: 32px;
  position: relative;

  background:
    radial-gradient(circle at top right, rgba(255,183,3,.18), transparent 40%),
    linear-gradient(180deg, #24150e, #0f0b08);

  border: 1px solid rgba(255,183,3,.25);

  box-shadow:
    0 30px 80px rgba(0,0,0,.55),
    inset 0 0 0 rgba(255,183,3,0);

  transition: all .35s ease;
}

.food-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent, rgba(255,183,3,.15), transparent);
  opacity: 0;
  transition: .4s;
}

.food-card:hover::before {
  opacity: 1;
}

.food-card:hover {
  transform: translateY(-10px) scale(1.02);
  border-color: rgba(255,183,3,.7);
  box-shadow:
    0 40px 100px rgba(0,0,0,.7),
    0 0 30px rgba(255,183,3,.2);
}

/* IMAGE */
.food-image-wrap {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.food-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .5s ease;
}

.food-card:hover img {
  transform: scale(1.12);
}

/* PRICE BADGE */
.food-image-wrap span {
  position: absolute;
  right: 16px;
  bottom: 16px;

  background: linear-gradient(135deg, #ffb703, #fb8500);
  color: #160f0b;

  padding: 10px 16px;
  border-radius: 999px;

  font-weight: 1000;
  font-size: 15px;

  box-shadow: 0 15px 35px rgba(251,133,0,.4);
}

/* CONTENT */
.food-content {
  padding: 22px;
}

.food-content h3 {
  color: #fff7e8;
  font-size: 24px;
  margin-bottom: 8px;
}

.food-content p {
  color: #cdb89d;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
}

/* BUTTON */
.food-content button,
.modal-add {
  width: 100%;
  padding: 14px;

  border-radius: 18px;
  border: none;

  background: linear-gradient(135deg, #ffb703, #fb8500);
  color: #160f0b;

  font-weight: 1000;
  font-size: 15px;

  cursor: pointer;

  transition: .25s;
  box-shadow: 0 15px 35px rgba(251,133,0,.3);
}

.food-content button:hover,
.modal-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 45px rgba(251,133,0,.45);
}

/* MODAL */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 500;

  display: flex;
  justify-content: center;
  align-items: center;

  background: rgba(0,0,0,.85);
  backdrop-filter: blur(6px);
}

.food-modal {
  position: relative;
  width: 100%;
  max-width: 580px;
  max-height: 92vh;
  overflow-y: auto;

  padding: 26px;
  border-radius: 30px;

  background:
    radial-gradient(circle at top right, rgba(255,183,3,.12), transparent 35%),
    linear-gradient(180deg, #24150e, #100b08);

  border: 1px solid rgba(255,183,3,.35);

  box-shadow:
    0 40px 120px rgba(0,0,0,.8),
    0 0 40px rgba(255,183,3,.15);

  color: #fff7e8;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;

  width: 44px;
  height: 44px;

  border-radius: 50%;
  border: none;

  background: rgba(0,0,0,.6);
  color: white;

  font-size: 28px;
  cursor: pointer;
}

.modal-img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  border-radius: 22px;
  margin-bottom: 15px;
}

.modal-desc {
  color: #cdb89d;
}

/* DRINK BOX */
.drink-box {
  background: rgba(255,183,3,.12);
  border: 1px solid rgba(255,183,3,.25);

  padding: 16px;
  border-radius: 18px;
  margin: 18px 0;
}

.drink-box h3 {
  color: #ffb703;
}

.drink-box select {
  width: 100%;
  padding: 12px;

  border-radius: 12px;
  border: none;

  background: #fff7e8;
  color: #160f0b;
  font-weight: 800;
}

/* EXTRAS */
.extra-row {
  display: flex;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255,255,255,.12);
}

/* NOTES */
.food-modal textarea {
  width: 100%;
  min-height: 100px;

  margin-top: 16px;
  padding: 14px;

  border-radius: 16px;
  border: none;

  background: #fff7e8;
  color: #160f0b;
}

/* TOTAL */
.modal-total {
  display: flex;
  justify-content: space-between;

  margin: 20px 0;

  font-size: 26px;
  font-weight: 1000;
  color: #ffb703;
}

/* MOBILE */
@media (max-width: 768px) {
  .food-image-wrap {
    height: 240px;
  }

  .food-modal {
    padding: 18px;
    border-radius: 24px;
  }

  .modal-img {
    height: 220px;
  }
}
`;

export default FoodCard;