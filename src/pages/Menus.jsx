import CategoryPage from "./CategoryPage";
import { labels, getLang } from "../data/categories";

function Menus() {
  const lang = getLang();
  return <CategoryPage title={labels[lang].menus} category="menus" />;
}

export default Menus;