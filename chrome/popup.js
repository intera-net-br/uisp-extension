if (typeof browser === "undefined") {
  var browser = chrome;
}

document.addEventListener("DOMContentLoaded", async () => {
  const unmsBaseInput = document.getElementById("unms-base");
  const tokenApiInput = document.getElementById("token-api");
  const unmsBaseLabel = document.getElementById("unms-base-label");
  const tokenApiLabel = document.getElementById("token-api-label");

  // Obtenha os valores salvos
  const config = await browser.storage.local.get(["unmsBase", "tokenApi"]);
  if (config.unmsBase) {
    unmsBaseInput.value = config.unmsBase;
    unmsBaseLabel.textContent = `Current: ${config.unmsBase}`;
  }
  if (config.tokenApi) {
    tokenApiInput.value = "********";
    tokenApiLabel.textContent = "Token is saved.";
  }

  document.getElementById("save-button").addEventListener("click", async () => {
    const unmsBase = unmsBaseInput.value;
    const tokenApi = tokenApiInput.value !== "********" ? tokenApiInput.value : null;

    const newConfig = {};
    if (unmsBase) newConfig.unmsBase = unmsBase;
    if (tokenApi) newConfig.tokenApi = tokenApi;

    await browser.storage.local.set(newConfig);
  });
});
