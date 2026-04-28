import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const [activeVideo, setActiveVideo] = useState(1);

  useEffect(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;

    if (!v1 || !v2) return;

    v1.play().catch(() => {});
    v2.pause();

    function playSecond() {
      setActiveVideo(2);
      v2.currentTime = 0;
      v2.play().catch(() => {});
    }

    function playFirst() {
      setActiveVideo(1);
      v1.currentTime = 0;
      v1.play().catch(() => {});
    }

    v1.addEventListener("ended", playSecond);
    v2.addEventListener("ended", playFirst);

    return () => {
      v1.removeEventListener("ended", playSecond);
      v2.removeEventListener("ended", playFirst);
    };
  }, []);

  return (
    <>
      <style>{css}</style>

      <div className="home-page">
        <section className="hero">
          <video ref={video1Ref} muted playsInline className={`hero-video ${activeVideo === 1 ? "active" : ""}`}>
            <source src="/videos/kebab-video.mp4" type="video/mp4" />
          </video>

          <video ref={video2Ref} muted playsInline className={`hero-video ${activeVideo === 2 ? "active" : ""}`}>
            <source src="/videos/kebab-video1.mp4" type="video/mp4" />
          </video>

          <div className="hero-shade" />

          <div className="hero-content">
            <span className="hero-label">🔥 Fresh • Fast • Halal</span>
            <h1>ZAKS KEBAB ALVERCA</h1>
            <p>Sabores intensos, kebabs quentes, acompanhamentos crocantes e entrega rápida.</p>

            <div className="hero-actions">
              <Link to="/menus" className="btn-main">Order Now</Link>
              <Link to="/delivery" className="btn-ghost">Delivery Info</Link>
            </div>
          </div>
        </section>

        <section className="category-section">
          <div className="section-head">
            <span>EXPLORE</span>
            <h2>Choose your category</h2>
          </div>

          <div className="category-grid">
            <Link to="/menus" className="category-card"><span>🍽️</span><h3>Menus</h3><p>Full meals with drink and fries.</p></Link>
            <Link to="/without-menu" className="category-card"><span>🥙</span><h3>Without Menu</h3><p>Only the food, no menu.</p></Link>
            <Link to="/dishes" className="category-card"><span>🍛</span><h3>Dishes</h3><p>Kebab plates and special dishes.</p></Link>
            <Link to="/bebidas" className="category-card"><span>🥤</span><h3>Drinks</h3><p>Cold drinks and water.</p></Link>
            <Link to="/extras" className="category-card"><span>🍟</span><h3>Acompanhamentos</h3><p>Batatas, molhos e saladas.</p></Link>
            <Link to="/delivery" className="category-card"><span>🚚</span><h3>Delivery</h3><p>Zones, prices and hours.</p></Link>
          </div>
        </section>
      </div>
    </>
  );
}

const css = `
.home-page {
  background: #0f0b08;
  min-height: 100vh;
  overflow-x: hidden;
}

.hero {
  position: relative;
  height: calc(100vh - 88px);
  min-height: 650px;
  overflow: hidden;
  background: #0f0b08;
}

.hero-video {
  position: absolute;
  inset: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: contrast(1.18) saturate(1.15) brightness(.82);
  transition: opacity .9s ease;
}

.hero-video.active {
  opacity: 1;
}

.hero-shade {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 35%, rgba(255,183,3,.20), transparent 24%),
    linear-gradient(90deg, rgba(15,11,8,.97), rgba(15,11,8,.66), rgba(15,11,8,.20)),
    linear-gradient(180deg, transparent, rgba(15,11,8,.96));
}

.hero-content {
  position: relative;
  z-index: 2;
  height: 100%;
  max-width: 950px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px clamp(24px, 8vw, 115px);
  color: white;
}

.hero-label {
  width: fit-content;
  color: #ffb703;
  background: rgba(255,183,3,.12);
  border: 1px solid rgba(255,183,3,.32);
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 1000;
  letter-spacing: 1.8px;
  box-shadow: 0 0 28px rgba(255,183,3,.16);
}

.hero-content h1 {
  font-size: clamp(52px, 8vw, 108px);
  margin: 22px 0 10px;
  line-height: .9;
  font-weight: 1000;
  letter-spacing: -3px;
}

.hero-content p {
  max-width: 650px;
  font-size: 22px;
  line-height: 1.45;
  color: #ead8bd;
}

.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 28px;
}

.btn-main,
.btn-ghost {
  padding: 17px 30px;
  border-radius: 999px;
  font-weight: 1000;
  text-decoration: none;
  font-size: 16px;
}

.btn-main {
  background: linear-gradient(135deg, #ffb703, #fb8500);
  color: #160f0b;
  box-shadow: 0 18px 40px rgba(251,133,0,.35);
}

.btn-ghost {
  color: white;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.22);
  backdrop-filter: blur(8px);
}

.category-section {
  max-width: 1250px;
  margin: 0 auto;
  padding: 80px 20px;
}

.section-head span {
  color: #ffb703;
  font-weight: 1000;
  letter-spacing: 3px;
}

.section-head h2 {
  color: #fff7e8;
  font-size: clamp(34px, 5vw, 56px);
  margin: 8px 0 30px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(245px, 1fr));
  gap: 24px;
}

.category-card {
  position: relative;
  overflow: hidden;
  min-height: 190px;
  padding: 28px;
  border-radius: 28px;
  background:
    radial-gradient(circle at top right, rgba(255,183,3,.16), transparent 36%),
    linear-gradient(180deg, #24150e, #130d09);
  border: 1px solid rgba(255,183,3,.22);
  box-shadow: 0 24px 60px rgba(0,0,0,.38);
  color: #fff7e8;
  text-decoration: none;
  transition: transform .25s ease, border .25s ease;
}

.category-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255,183,3,.58);
}

.category-card span {
  font-size: 34px;
}

.category-card h3 {
  font-size: 24px;
  margin: 16px 0 8px;
}

.category-card p {
  color: #cdb89d;
  line-height: 1.45;
}

@media (max-width: 768px) {
  .hero {
    height: calc(100vh - 78px);
    min-height: 640px;
  }

  .hero-shade {
    background:
      linear-gradient(180deg, rgba(15,11,8,.18), rgba(15,11,8,.78), rgba(15,11,8,.98));
  }

  .hero-content {
    justify-content: flex-end;
    padding: 24px 18px 60px;
  }

  .hero-label {
    font-size: 13px;
    letter-spacing: 1px;
  }

  .hero-content h1 {
    font-size: 48px;
    letter-spacing: -1px;
  }

  .hero-content p {
    font-size: 18px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .btn-main,
  .btn-ghost {
    width: 100%;
    text-align: center;
  }

  .category-section {
    padding: 55px 16px;
  }

  .category-grid {
    grid-template-columns: 1fr;
  }
}
`;

export default Home;