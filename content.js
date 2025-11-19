async function postRequest(url, data, tokenApi, unmsBase) {
  return fetch(unmsBase + url, {
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

async function getRequest(url, tokenApi, unmsBase) {
  return fetch(unmsBase + url, {
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
  chrome.storage.local.get(["unmsBase", "tokenApi"], async (config) => {
    if (!config.unmsBase || !config.tokenApi) {
      console.error("UNMS configuration is missing!");
      return;
    }

    const unmsBase = config.unmsBase;
    const tokenApi = config.tokenApi;

    // Substituir com sua lógica
    let id = (
      await getRequest(
        "/nms/search?query=" + window.location.hostname + "&page=1&count=10",
        tokenApi,
        unmsBase
      )
    )[0].data.identification.id;

    let ticket = (
      await postRequest(
        "/devices/" + id + "/iplink/redirect",
        "",
        tokenApi,
        unmsBase
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
