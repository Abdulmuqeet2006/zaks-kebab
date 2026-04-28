export const labels = {
  pt: {
    home: "Início",
    menus: "Menus",
    withoutMenu: "Sem Menus",
    dishes: "Pratos",
    drinks: "Bebidas",
    extras: "Acompanhamentos",
    delivery: "Entrega",
    login: "Login",
  },
  en: {
    home: "Home",
    menus: "Menus",
    withoutMenu: "Without Menu",
    dishes: "Dishes",
    drinks: "Drinks",
    extras: "Acompanhamentos",
    delivery: "Delivery",
    login: "Login",
  },
};

export function getLang() {
  return navigator.language.startsWith("pt") ? "pt" : "en";
}