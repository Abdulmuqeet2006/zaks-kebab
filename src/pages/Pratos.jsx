
import FoodCard from "../components/FoodCard";
import { products } from "../data/products";

function Pratos() {
  const pratos = products.filter((item) => item.category === "pratos");

  return (
    <div>
      

      <div style={styles.container}>
        <h1>Pratos</h1>

        <div style={styles.grid}>
          {pratos.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "40px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
};

export default Pratos;