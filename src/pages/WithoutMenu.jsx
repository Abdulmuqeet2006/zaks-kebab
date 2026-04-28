import CategoryPage from "./CategoryPage";
import { labels, getLang } from "../data/categories";

function WithoutMenu() {
  const lang = getLang();
  return <CategoryPage title={labels[lang].withoutMenu} category="without-menu" />;
}

export default WithoutMenu;