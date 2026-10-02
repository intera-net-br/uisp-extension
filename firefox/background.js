if (typeof browser === "undefined") {
  var browser = chrome;
}

// Página pública usada como trampolim por assistentes de IA (skill uisp-login)
const TRAMPOLIM = "https://intera-net-br.github.io/uisp-extension/login.html";

const IPV4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

// Criação do menu de contexto
browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: "uisp-action",
    title: "Entrar usando Ticket",
    contexts: ["page"],
  });
});

async function uispRequest(method, url, config) {
  const options = {
    method: method,
    headers: { "Accept": "application/json", "x-auth-token": config.tokenApi },
  };
  if (method === "POST") {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify("");
  }
  // Sem permissão de host: depende do CORS do UISP, o mesmo que a versão 1.1 já usava
  let response;
  try {
    response = await fetch(config.uispBase + url, options);
  } catch (error) {
    throw new Error("Não foi possível acessar o UISP em " + config.uispBase + " (rede ou CORS).");
  }
  if (!response.ok) {
    throw new Error("UISP respondeu HTTP " + response.status);
  }
  return response.json();
}

async function getConfig() {
  const config = await browser.storage.local.get(["uispBase", "tokenApi"]);
  if (!config.uispBase || !config.tokenApi) {
    throw new Error("Extensão não configurada: informe URL e token no popup da UISP Extension.");
  }
  return config;
}

// IP de um resultado da busca do UISP, sem a máscara ("10.0.0.5/24" -> "10.0.0.5")
function deviceIp(item) {
  const data = item.data || {};
  const ip = data.ipAddress || (data.identification && data.identification.ipAddress) || "";
  return String(ip).split("/")[0];
}

// Procura o equipamento no UISP; só aceita IP idêntico ao pedido.
async function findDevice(host, config) {
  const results = await uispRequest(
    "GET",
    "/nms/search?query=" + encodeURIComponent(host) + "&page=1&count=10",
    config
  );
  const devices = (results || []).filter((item) => item.data && item.data.identification);
  const match = devices.find((item) => deviceIp(item) === host);
  if (match) return { id: match.data.identification.id, ip: deviceIp(match) };
  throw new Error("Equipamento " + host + " não encontrado no UISP.");
}

async function ticketUrl(device, config) {
  const ticket = (await uispRequest("POST", "/devices/" + device.id + "/iplink/redirect", config)).token;
  if (!ticket) throw new Error("UISP não devolveu ticket.");
  return "https://" + device.ip + "/ticket.cgi?ticketid=" + encodeURIComponent(ticket);
}

// Gerenciador de cliques no menu de contexto (mesmo fluxo da 1.1, via menu.js)
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "uisp-action") {
    browser.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["menu.js"],
    }).catch((error) => {
      console.error("Erro ao executar o script:", error);
    });
  }
});

// Pedido vindo do trampolim (content.js). Faz a chamada aqui para o token nunca chegar à página.
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.type !== "uisp-login") return false;

  (async () => {
    if (!sender.tab || !sender.url || !sender.url.startsWith(TRAMPOLIM)) {
      throw new Error("Origem não autorizada.");
    }
    if (!IPV4.test(message.ip || "")) {
      throw new Error("IP inválido.");
    }
    const config = await getConfig();
    // O redirecionamento usa o IP devolvido pelo UISP, nunca o texto vindo da página
    const device = await findDevice(message.ip, config);
    await browser.tabs.update(sender.tab.id, { url: await ticketUrl(device, config) });
    return { ok: true };
  })()
    .then(sendResponse)
    .catch((error) => sendResponse({ ok: false, error: error.message }));

  return true;
});
