if (typeof browser === "undefined") {
  var browser = chrome;
}

// Criação do menu de contexto
browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: "uisp-action",
    title: "Entrar usando Ticket",
    contexts: ["page"],
  });
});

// Gerenciador de cliques no menu de contexto
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "uisp-action") {
    browser.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    }).catch((error) => {
      console.error("Erro ao executar o script:", error);
    });
  }
});
