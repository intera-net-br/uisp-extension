if (typeof browser === "undefined") {
  var browser = chrome;
}

document.addEventListener("DOMContentLoaded", async () => {
  const uispBaseInput = document.getElementById("uisp-base");
  const tokenApiInput = document.getElementById("token-api");
  const uispBaseLabel = document.getElementById("uisp-base-label");
  const tokenApiLabel = document.getElementById("token-api-label");

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
  });
});
