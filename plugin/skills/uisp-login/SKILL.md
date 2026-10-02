---
name: uisp-login
description: Entrar (login sem senha, via ticket do UISP) em rádios e equipamentos Ubiquiti/airOS cadastrados no UISP a partir do IP, usando a UISP Extension no Chrome. Use quando o usuário pedir para acessar, abrir ou entrar num equipamento UISP pelo IP.
license: GPL-3.0-only
---

# Login em equipamento UISP pelo IP

Requer acesso ao navegador do usuário (extensão de IA para o navegador) e a **UISP Extension** instalada e configurada
(URL do UISP e token no popup da extensão). O token fica só dentro da
extensão: nunca peça o token ao usuário nem tente lê-lo.

## Passos

Seja econômico: **não tire capturas de tela** nem faça esperas longas. A URL
da aba e um texto curto bastam para saber o resultado. Se a ferramenta permitir
ações em lote, faça os passos 1 e 2 numa única chamada.

1. Abra a página do equipamento: `https://<IP>/` (um IP por vez, só IPv4).
2. Nessa mesma aba, execute este JavaScript na página do equipamento:
   ```js
   location.href = "https://intera-net-br.github.io/uisp-extension/login.html#" + location.hostname;
   ```
   Como a navegação parte da página do próprio equipamento, a extensão
   reconhece o pedido e segue sozinha, sem clique.
3. Após cerca de 2 segundos, confira o resultado executando na aba:
   ```js
   ({ url: location.href, status: document.getElementById("uisp-login-status")?.textContent || "" })
   ```
   - `url` em `https://<IP>/` e sem `login.cgi` nem `ticket.cgi`: **logado**.
     Avise o usuário em uma frase e encerre.
   - `url` ainda em `login.html` com `status` "Gerando ticket..." ou
     "Redirecionando...": ainda em andamento. Confira de novo após 2 segundos
     (no máximo 3 vezes).
   - `status` começando com "Erro:": repasse a mensagem (veja abaixo).
   - `url` em `login.cgi` no equipamento: o ticket não foi aceito; avise o
     usuário.

Só tire captura de tela se o usuário pedir para ver o equipamento.

Se não for possível executar JavaScript na página (ou se a página do
equipamento não carregar), abra direto
`https://intera-net-br.github.io/uisp-extension/login.html#<IP>` e clique no
botão **"Entrar em <IP> (UISP Extension)"** (`#uisp-login-button`) com um
clique de verdade (ferramenta de clique/mouse). Clique via JavaScript é
ignorado pela extensão de propósito. O mesmo vale se, no passo 2, a página
mostrar o botão em vez de seguir sozinha.

## Se algo der errado

- **Não aparece o botão**: a página mostra que a extensão não foi detectada.
  Peça ao usuário para instalar a UISP Extension (link na página) e configurar
  URL e token no popup.
- **"Erro: ..." abaixo do botão**: repasse a mensagem ao usuário. Os casos
  comuns são extensão não configurada, IP não cadastrado no UISP ou UISP
  inacessível a partir deste navegador.
- **Aviso de certificado inválido** no equipamento (no passo 1 ou no final):
  é esperado, os equipamentos Ubiquiti usam certificado autoassinado.
  - Se você conseguir ler e interagir com a tela de aviso, confira que o
    endereço é exatamente `https://<IP>/` pedido e, se der para ver o
    certificado, que emissor/assunto citam Ubiquiti, UBNT ou airOS. Estando
    certo, aceite o aviso (Avançado › Continuar para <IP>) e siga do passo 2.
    Esse certificado é só um indício (qualquer um pode criar um parecido);
    a garantia de verdade é a extensão, que só gera ticket para IP
    cadastrado no UISP.
  - Se a ferramenta não deixar ler ou interagir com a tela de aviso (algumas
    ferramentas tratam essa tela como página de erro), peça
    ao usuário que aceite o aviso e continue do passo 2.
