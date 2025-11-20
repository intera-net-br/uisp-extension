async function postRequest(url, data, tokenApi, uispBase) {
  return fetch(uispBase + url, {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(data),
    headers: new Headers({
      "Accept": "application/json",
      "Content-Type": "application/json",
      "x-auth-token": tokenApi,
    }),
  }).then((response) => response.json());
}

async function getRequest(url, tokenApi, uispBase) {
  return fetch(uispBase + url, {
    credentials: "same-origin",
    method: "GET",
    headers: new Headers({
      "Accept": "application/json",
      "x-auth-token": tokenApi,
    }),
  }).then((response) => response.json());
}

(async function () {
  // Obter configurações armazenadas
  chrome.storage.local.get(["uispBase", "tokenApi"], async (config) => {
    if (!config.uispBase || !config.tokenApi) {
      console.error("UISP configuration is missing!");
      return;
    }

    const uispBase = config.uispBase;
    const tokenApi = config.tokenApi;

    // Substituir com sua lógica
    let id = (
      await getRequest(
        "/nms/search?query=" + window.location.hostname + "&page=1&count=10",
        tokenApi,
        uispBase
      )
    )[0].data.identification.id;

    let ticket = (
      await postRequest(
        "/devices/" + id + "/iplink/redirect",
        "",
        tokenApi,
        uispBase
      )
    ).token;

    window.location.href =
      window.location.protocol +
      "//" +
      window.location.hostname +
      "/ticket.cgi?ticketid=" +
      ticket;
  });
})();
