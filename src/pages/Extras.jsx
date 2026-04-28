import CategoryPage from "./CategoryPage";
import { labels, getLang } from "../data/categories";

function Extras() {
  const lang = getLang();
  return <CategoryPage title={labels[lang].extras} category="extras" />;
}

export default Extras;