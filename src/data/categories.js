export const labels = {
  pt: {
    home: "Início",
    menus: "Menus",
    withoutMenu: "Sem Menu",
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
    extras: "Sides",
    delivery: "Delivery",
    login: "Login",
  },
};

export function getLang() {
  const savedLang = localStorage.getItem("zaksLang");

  if (savedLang === "pt" || savedLang === "en") {
    return savedLang;
  }

  const browserLang = navigator.language || navigator.userLanguage || "pt";

  if (browserLang.toLowerCase().startsWith("pt")) {
    return "pt";
  }

  return "en";
}

export function setLang(lang) {
  if (lang === "pt" || lang === "en") {
    localStorage.setItem("zaksLang", lang);
    window.location.reload();
  }
}