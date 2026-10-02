---
name: uisp-login
description: Entrar (login sem senha, via ticket do UISP) em rádios e equipamentos Ubiquiti/airOS cadastrados no UISP a partir do IP, usando a UISP Extension no Chrome. Use quando o usuário pedir para acessar, abrir ou entrar num equipamento UISP pelo IP.
license: GPL-3.0-only
---

# Login em equipamento UISP pelo IP

Requer a **UISP Extension** instalada e configurada no navegador. O token do
UISP fica só dentro dela: nunca peça nem tente ler o token. Não tire capturas
de tela.

1. Numa única chamada em lote, na mesma aba:
   - abra `https://<IP>/favicon.ico` (arquivo leve do próprio equipamento);
   - execute:
     ```js
     location.href = "https://intera-net-br.github.io/uisp-extension/login.html#" + location.hostname;
     ```
   - aguarde 8 segundos;
   - liste as abas (endereço e título).

   A ferramenta pode devolver erro aqui (página navegou, aba fora do grupo da
   sessão). Isso é normal: a aba troca de site várias vezes. Nesse caso,
   aguarde 8 segundos e liste as abas numa chamada à parte.

2. Confira o resultado pela **listagem de abas**, não por JavaScript:
   - **Logado:** endereço em `https://<IP>/` sem `login.cgi`, `ticket.cgi` nem
     `ticketid`, e título com o nome do equipamento, como
     `<nome> - Dashboard - airOS`, `<nome> - Painel de controle - airOS` ou
     `[<nome>] - Principal`. Avise em uma frase e encerre.
   - **Ainda processando:** endereço com `ticketid` ou `ticket.cgi`, ou título
     "Ubiquiti". O equipamento pode levar até 15 s: aguarde 5 segundos e
     liste as abas de novo (no máximo 3 vezes).
   - **Parado no trampolim:** endereço em `intera-net-br.github.io` por mais de
     10 s. Leia a mensagem da página (`#uisp-login-status`) e siga `erros.md`.
   - **Tela de login** (`login.cgi`, título "Iniciar sessão" ou campo de
     senha) depois de 15 s: o ticket não foi aceito; siga `erros.md`.

`erros.md` está nesta skill ou em
https://intera-net-br.github.io/uisp-extension/erros.md (aviso de certificado,
extensão não detectada, erros da extensão).
