if (typeof browser === "undefined") {
  var browser = chrome;
}

// Roda só no trampolim (login.html#IP); o token nunca chega à página, só o background o usa.
// O IP vem depois do "#", que o navegador não envia ao servidor da página.
//  - Automático: quando a navegação partiu da própria página do equipamento
//    (referrer com host igual ao IP). Nenhum outro site consegue produzir esse referrer.
//  - Nos demais casos: botão que exige clique real.
(function () {
  if (window.top !== window) return; // nunca dentro de iframe (clickjacking)
  if (!location.pathname.endsWith("/login.html")) return;

  document.documentElement.dataset.uispExtension = browser.runtime.getManifest().version;

  function referrerHost() {
    try {
      return new URL(document.referrer).hostname;
    } catch (error) {
      return "";
    }
  }

  let autoTried = "";

  function render() {
    let ip;
    try {
      ip = decodeURIComponent(location.hash.slice(1));
    } catch (error) {
      ip = location.hash.slice(1);
    }
    const area = document.getElementById("uisp-login");
    if (!ip || !area) return;

    const status = document.createElement("p");
    status.id = "uisp-login-status";

    const button = document.createElement("button");
    button.type = "button";
    button.id = "uisp-login-button";
    button.textContent = "Entrar em " + ip + " (UISP Extension)";

    async function login() {
      button.disabled = true;
      status.textContent = "Gerando ticket no UISP...";
      try {
        const response = await browser.runtime.sendMessage({ type: "uisp-login", ip: ip });
        if (!response || !response.ok) throw new Error((response && response.error) || "Falha desconhecida.");
        status.textContent = "Redirecionando para " + ip + "...";
      } catch (error) {
        status.textContent = "Erro: " + error.message;
        button.disabled = false;
      }
    }

    button.addEventListener("click", (event) => {
      if (!event.isTrusted) return; // ignora cliques simulados por script
      login();
    });

    area.replaceChildren(button, status);

    // Uma tentativa automática por IP, só com referrer do próprio equipamento
    if (referrerHost() === ip && autoTried !== ip) {
      autoTried = ip;
      login();
    }
  }

  render();
  // Trocar só o "#IP" não recarrega a página (o referrer continua o do carregamento)
  window.addEventListener("hashchange", render);
})();
