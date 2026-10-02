---
name: uisp-login
description: Entrar (login sem senha, via ticket do UISP) em rádios e equipamentos Ubiquiti/airOS cadastrados no UISP a partir do IP, usando a UISP Extension no Chrome. Use quando o usuário pedir para acessar, abrir ou entrar num equipamento UISP pelo IP.
license: GPL-3.0-only
---

# Login em equipamento UISP pelo IP

Requer a **UISP Extension** instalada e configurada no navegador. O token do
UISP fica só dentro dela: nunca peça nem tente ler o token.

Faça tudo numa **única chamada em lote**, na mesma aba, sem capturas de tela:

1. Abra `https://<IP>/favicon.ico` (arquivo leve do próprio equipamento).
2. Execute:
   ```js
   location.href = "https://intera-net-br.github.io/uisp-extension/login.html#" + location.hostname;
   ```
3. Aguarde 4 segundos.
4. Execute (espera sozinho até o painel abrir; o equipamento pode levar 10 s):
   ```js
   await new Promise((done) => {
     const t0 = Date.now();
     const tick = () => {
       const erro = document.getElementById("uisp-login-status")?.textContent || "";
       const logado = location.hostname !== "intera-net-br.github.io"
         && document.readyState === "complete"
         && !/(login|ticket)\.cgi/.test(location.pathname)
         && !/ticketid/.test(location.hash)
         && document.title !== "Ubiquiti"
         && !document.querySelector("input[type=password]");
       if (logado || erro.startsWith("Erro:") || Date.now() - t0 > 25000)
         return done({ logado, erro, url: location.origin + location.pathname, titulo: document.title });
       setTimeout(tick, 250);
     };
     tick();
   });
   ```

`logado: true`: avise em uma frase e encerre, o resultado é definitivo.
Se o passo 4 falhar porque a página navegou, repita só o passo 4.
Qualquer outro caso (erro, aviso de certificado, página que não carrega):
leia `erros.md` (nesta skill ou em
https://intera-net-br.github.io/uisp-extension/erros.md).
