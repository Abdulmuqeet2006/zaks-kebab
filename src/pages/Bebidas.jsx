import CategoryPage from "./CategoryPage";
import { labels, getLang } from "../data/categories";

function Bebidas() {
  const lang = getLang();
  return <CategoryPage title={labels[lang].drinks} category="bebidas" />;
}

export default Bebidas;