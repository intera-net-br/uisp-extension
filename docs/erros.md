# UISP Login: quando não dá certo

- **`erro` começa com "Erro:"**: repasse a mensagem ao usuário. Casos comuns:
  extensão não configurada (URL e token no popup), IP não cadastrado no UISP,
  UISP inacessível a partir deste navegador.
- **Extensão não detectada** (a página `login.html` diz isso): peça ao usuário
  para instalar a UISP Extension (link na página) e configurar URL e token no
  popup.
- **A página `login.html` mostrou um botão em vez de seguir sozinha**, ou não
  foi possível executar JavaScript na página do equipamento: abra
  `https://intera-net-br.github.io/uisp-extension/login.html#<IP>` e clique no
  botão **"Entrar em <IP> (UISP Extension)"** (`#uisp-login-button`) com um
  clique de verdade (ferramenta de clique/mouse). Clique via JavaScript é
  ignorado pela extensão de propósito.
- **`logado` falso com a URL no equipamento e campo de senha na tela**: o
  ticket não foi aceito pelo equipamento. Avise o usuário.
- **Aviso de certificado inválido** no equipamento (no passo 1 ou no final):
  é esperado, os equipamentos Ubiquiti usam certificado autoassinado.
  - Se você conseguir ler e interagir com a tela de aviso, confira que o
    endereço é exatamente `https://<IP>/` pedido e, se der para ver o
    certificado, que ele tem o formato de fábrica da Ubiquiti: emissor igual
    ao assunto, `O=Ubiquiti Networks Inc.` e `CN=UBNT-<MAC do equipamento>`
    (ex.: `CN=UBNT-04:18:D6:38:83:78`). Estando
    certo, aceite o aviso (Avançado › Continuar para <IP>) e recomece do
    passo 2. Esse certificado é só um indício; a garantia de verdade é a
    extensão, que só gera ticket para IP cadastrado no UISP.
  - Se a ferramenta não deixar ler ou interagir com a tela de aviso (algumas
    tratam essa tela como página de erro), peça ao usuário que aceite o aviso
    e recomece do passo 2.
