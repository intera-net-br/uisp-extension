if (typeof browser === "undefined") {
  var browser = chrome;
}

const TRAMPOLIM = "https://intera-net-br.github.io/uisp-extension/login.html";

document.addEventListener("DOMContentLoaded", async () => {
  const uispBaseInput = document.getElementById("uisp-base");
  const tokenApiInput = document.getElementById("token-api");
  const uispBaseLabel = document.getElementById("uisp-base-label");
  const tokenApiLabel = document.getElementById("token-api-label");
  const saveStatus = document.getElementById("save-status");

  // Obtenha os valores salvos
  const config = await browser.storage.local.get(["uispBase", "tokenApi"]);
  if (config.uispBase) {
    uispBaseInput.value = config.uispBase;
    uispBaseLabel.textContent = `Current: ${config.uispBase}`;
  }
  if (config.tokenApi) {
    tokenApiInput.value = "********";
    tokenApiLabel.textContent = "Token is saved.";
  }

  document.getElementById("save-button").addEventListener("click", async () => {
    const uispBase = uispBaseInput.value;
    const tokenApi = tokenApiInput.value !== "********" ? tokenApiInput.value : null;

    const newConfig = {};
    if (uispBase) newConfig.uispBase = uispBase;
    if (tokenApi) newConfig.tokenApi = tokenApi;

    await browser.storage.local.set(newConfig);
    if (uispBase) uispBaseLabel.textContent = `Current: ${uispBase}`;
    if (tokenApi) tokenApiLabel.textContent = "Token is saved.";
    saveStatus.textContent = "Salvo.";
  });

  // Abre o trampolim uma vez para salvar a cópia local (sw.js) antes do primeiro uso
  document.getElementById("ai-button").addEventListener("click", () => {
    browser.tabs.create({ url: TRAMPOLIM });
  });
});
