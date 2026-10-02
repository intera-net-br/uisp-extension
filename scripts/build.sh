#!/bin/sh
# Gera em dist/ os arquivos para anexar às releases (veja "Releases" no README):
#   uisp-login-skill.zip         skill para assistentes de IA
#   uisp-extension-chrome.zip    extensão para Chrome ("Carregar sem compactação")
#   uisp-extension-firefox.zip   extensão para Firefox (também serve para a AMO)
#   uisp-extension-chrome.crx    só se houver a chave .pem: pacote assinado para a
#                                Chrome Web Store (uploads verificados)
# e copia o SKILL.md para o GitHub Pages.
# Chave: uisp_extension.pem na raiz do projeto, ou o caminho em UISP_PEM.
set -e
cd "$(dirname "$0")/.."
cp plugin/skills/uisp-login/SKILL.md docs/
rm -rf dist
mkdir -p dist
(cd plugin/skills && zip -qr ../../dist/uisp-login-skill.zip uisp-login)
for browser in chrome firefox; do
  (cd "$browser" && zip -qr "../dist/uisp-extension-$browser.zip" . -x "web-ext-artifacts/*" ".*")
done

PEM="${UISP_PEM:-uisp_extension.pem}"
CHROME="$(command -v google-chrome || command -v chromium || command -v chromium-browser || true)"
if [ -f "$PEM" ] && [ -n "$CHROME" ]; then
  # Empacota uma cópia com um perfil temporário, sem tocar no navegador do usuário
  TMP="$(mktemp -d)"
  cp -r chrome "$TMP/uisp-extension"
  "$CHROME" --headless=new --user-data-dir="$TMP/profile" --no-message-box \
    --pack-extension="$TMP/uisp-extension" --pack-extension-key="$(realpath "$PEM")" >/dev/null 2>&1 || true
  if [ -f "$TMP/uisp-extension.crx" ]; then
    cp "$TMP/uisp-extension.crx" dist/uisp-extension-chrome.crx
  else
    echo "Aviso: falha ao gerar o .crx" >&2
  fi
  rm -rf "$TMP"
else
  echo "Sem $PEM ou sem Chrome: .crx não gerado" >&2
fi
ls dist
