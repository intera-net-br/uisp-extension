if (typeof browser === "undefined") {
  var browser = chrome;
}

const TRAMPOLIM = "https://intera-net-br.github.io/uisp-extension/login.html";

// Permissão só para o host do UISP, usada pelo trampolim dos assistentes de IA
function originPattern(uispBase) {
  try {
    return new URL(uispBase).origin + "/*";
  } catch (error) {
    return null;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const uispBaseInput = document.getElementById("uisp-base");
  const tokenApiInput = document.getElementById("token-api");
  const uispBaseLabel = document.getElementById("uisp-base-label");
  const tokenApiLabel = document.getElementById("token-api-label");
  const saveStatus = document.getElementById("save-status");
  const aiButton = document.getElementById("ai-button");
  const aiStatus = document.getElementById("ai-status");

  async function showAiStatus(uispBase) {
    const pattern = originPattern(uispBase);
    const granted = pattern && (await browser.permissions.contains({ origins: [pattern] }));
    aiButton.hidden = !!granted;
    aiStatus.textContent = granted ? "Uso por assistente de IA habilitado." : "";
  }

  // Obtenha os valores salvos
  const config = await browser.storage.local.get(["uispBase", "tokenApi"]);
  if (config.uispBase) {
    uispBaseInput.value = config.uispBase;
    uispBaseLabel.textContent = `Current: ${config.uispBase}`;
    await showAiStatus(config.uispBase);
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
    await showAiStatus(uispBase);
  });

  aiButton.addEventListener("click", () => {
    const pattern = originPattern(uispBaseInput.value);
    if (!pattern) {
      aiStatus.textContent = "Informe e salve a URL do UISP primeiro.";
      return;
    }
    // Sem await antes do request: o pedido de permissão precisa do gesto do usuário
    browser.permissions.request({ origins: [pattern] })
      .then((granted) => {
        if (!granted) {
          aiStatus.textContent = "Permissão negada.";
          return;
        }
        // Abre o trampolim uma vez para salvar a cópia local (sw.js) antes do primeiro uso
        browser.tabs.create({ url: TRAMPOLIM });
        showAiStatus(uispBaseInput.value);
      })
      .catch((error) => {
        aiStatus.textContent = "Erro: " + error.message;
      });
  });
});
