---
name: uisp-login
description: Entrar (login sem senha, via ticket do UISP) em rádios e equipamentos Ubiquiti/airOS cadastrados no UISP a partir do IP, usando a UISP Extension no Chrome. Use quando o usuário pedir para acessar, abrir ou entrar num equipamento UISP pelo IP.
license: GPL-3.0-only
---

# Login em equipamento UISP pelo IP

Requer acesso ao navegador do usuário e a **UISP Extension** instalada e
configurada. O token do UISP fica só dentro da extensão: nunca peça o token
ao usuário nem tente lê-lo.

## Faça tudo numa única chamada em lote

Sem capturas de tela e sem conferências extras. Num só lote, na mesma aba:

1. Abra `https://<IP>/` (um IP por vez, só IPv4).
2. Execute na página do equipamento:
   ```js
   location.href = "https://intera-net-br.github.io/uisp-extension/login.html#" + location.hostname;
   ```
3. Aguarde 3 segundos (a extensão gera o ticket e redireciona para o equipamento).
4. Execute a conferência, que espera sozinha até 15 segundos o airOS abrir o painel:
   ```js
   await new Promise((done) => {
     const t0 = Date.now();
     const tick = () => {
       const erro = document.getElementById("uisp-login-status")?.textContent || "";
       const noRadio = location.hostname !== "intera-net-br.github.io";
       // Enquanto processa o ticket, o airOS fica em "#ticketid=..." com título "Ubiquiti"
       const logado = noRadio && document.readyState === "complete"
         && !/(login|ticket)\.cgi/.test(location.pathname)
         && !/ticketid/.test(location.hash)
         && document.title !== "Ubiquiti"
         && !document.querySelector("input[type=password]");
       if (logado || erro.startsWith("Erro:") || Date.now() - t0 > 15000)
         return done({ logado, erro, url: location.origin + location.pathname, titulo: document.title });
       setTimeout(tick, 250);
     };
     tick();
   });
   ```

Se `logado` for `true`, avise o usuário em uma frase e encerre. O resultado
já é definitivo.

Se o passo 4 falhar porque a página navegou durante a conferência, execute só
o passo 4 mais uma vez. Em qualquer outro caso (`logado` falso, `erro`
preenchido, aviso de certificado, extensão não detectada ou página do
equipamento que não carrega), leia `erros.md` (nesta skill ou em
https://intera-net-br.github.io/uisp-extension/erros.md).
