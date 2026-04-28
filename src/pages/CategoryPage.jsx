import FoodCard from "../components/FoodCard";
import { products } from "../data/products";

function CategoryPage({ title, category }) {
  const filtered = products.filter((item) => item.category === category);

  return (
    <>
      <style>{css}</style>

      <div className="cat-page">
        <section className="cat-hero">
          <span>ZAKS KEBAB ALVERCA</span>
          <h1>{title}</h1>
          <p>Escolhe o teu favorito, adiciona extras e envia o pedido em segundos.</p>
        </section>

        <main className="cat-container">
          <div className="cat-top">
            <h2>{filtered.length} produtos</h2>
            <p>🔥 Preparado fresco hoje</p>
          </div>

          <div className="cat-grid">
            {filtered.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

const css = `
.cat-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(255,183,3,.16), transparent 28%),
    linear-gradient(135deg, #0f0b08, #1b100b 55%, #0f0b08);
  color: #fff7e8;
}

.cat-hero {
  padding: 75px 20px 55px;
  text-align: center;
  border-bottom: 1px solid rgba(255,183,3,.22);
  background:
    radial-gradient(circle at center, rgba(255,183,3,.13), transparent 35%),
    linear-gradient(135deg, rgba(255,183,3,.08), rgba(220,38,38,.08));
}

.cat-hero span {
  color: #ffb703;
  font-weight: 1000;
  letter-spacing: 3px;
  font-size: 13px;
}

.cat-hero h1 {
  font-size: clamp(42px, 7vw, 78px);
  margin: 12px 0;
  font-weight: 1000;
  letter-spacing: -2px;
}

.cat-hero p {
  color: #d7c2a8;
  font-size: 18px;
}

.cat-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 18px 85px;
}

.cat-top {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 28px;
}

.cat-top h2 {
  margin: 0;
}

.cat-top p {
  margin: 0;
  color: #ffb703;
  background: rgba(255,183,3,.12);
  border: 1px solid rgba(255,183,3,.28);
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 1000;
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(245px, 1fr));
  gap: 26px;
}

@media (max-width: 768px) {
  .cat-hero {
    padding: 48px 18px 36px;
  }

  .cat-container {
    padding: 28px 14px 60px;
  }

  .cat-grid {
    grid-template-columns: 1fr;
  }
}
`;

export default CategoryPage;