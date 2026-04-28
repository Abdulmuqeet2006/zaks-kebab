import CategoryPage from "./CategoryPage";
import { labels, getLang } from "../data/categories";

function Dishes() {
  const lang = getLang();
  return <CategoryPage title={labels[lang].dishes} category="dishes" />;
}

export default Dishes;