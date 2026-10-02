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

   Os dois desfechos são normais: o lote devolve a listagem, ou devolve erro
   da ferramenta (página navegou, aba fora do grupo da sessão) porque a aba
   troca de site várias vezes. No caso de erro, aguarde 8 segundos por
   qualquer meio disponível (ferramenta de espera, shell) e liste as abas numa
   chamada à parte.

2. Confira pela **listagem de abas**:
   - **Logado:** endereço em `https://<IP>/` sem `login.cgi` nem `ticket.cgi`,
     e título com o nome do equipamento, como `<nome> - Dashboard - airOS`,
     `<nome> - Painel de controle - airOS` ou `[<nome>] - Principal`. Se a aba
     aceitar comandos, confirme que não há campo de senha
     (`!document.querySelector("input[type=password]")`). Avise em uma frase
     e encerre.
   - **Ainda processando:** título "Ubiquiti" ou `ticket.cgi` no endereço. O
     equipamento pode levar até 15 s: aguarde 5 segundos e liste de novo (no
     máximo 3 vezes).
   - **Parado no trampolim:** endereço em `intera-net-br.github.io` por mais
     de 10 s. Leia a mensagem da página (`#uisp-login-status`) e veja abaixo.
   - **Tela de login do equipamento** depois de 15 s (`login.cgi` ou título
     "Iniciar sessão"): o ticket não foi aceito. Avise o usuário.

## Se algo der errado

- **"Erro: ..." no trampolim:** repasse a mensagem. Casos comuns: extensão
  não configurada (URL e token no popup), IP não cadastrado no UISP, UISP
  inacessível deste navegador.
- **"UISP Extension não detectada" no trampolim:** peça ao usuário para
  instalar a extensão (link na página) e configurar URL e token no popup.
- **Trampolim mostra um botão em vez de seguir sozinho**, ou não foi possível
  executar JavaScript no equipamento: abra
  `https://intera-net-br.github.io/uisp-extension/login.html#<IP>` e clique no
  botão "Entrar em <IP> (UISP Extension)" com um clique de verdade (clique via
  JavaScript é ignorado de propósito).
- **Aviso de certificado inválido** no equipamento: é esperado (certificado
  autoassinado). Se você conseguir ler e interagir com a tela de aviso,
  confira que o endereço é o IP pedido e, se der para ver o certificado, que
  tem o formato de fábrica da Ubiquiti (emissor igual ao assunto,
  `O=Ubiquiti Networks Inc.`, `CN=UBNT-<MAC>`); então aceite e recomece do
  passo 1. Se a ferramenta não deixar interagir com essa tela (ela costuma
  ser tratada como página de erro), peça ao usuário que aceite e recomece do
  passo 1.
