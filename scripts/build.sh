#!/bin/sh
# Gera em dist/ os arquivos para anexar às releases (veja "Releases" no README):
#   uisp-login-skill.zip         skill para assistentes de IA
#   uisp-extension-chrome.zip    extensão para Chrome (também serve para a Chrome Web Store)
#   uisp-extension-firefox.zip   extensão para Firefox (também serve para a AMO)
# e copia o SKILL.md e o erros.md para o GitHub Pages.
set -e
cd "$(dirname "$0")/.."
cp plugin/skills/uisp-login/SKILL.md plugin/skills/uisp-login/erros.md docs/
rm -rf dist
mkdir -p dist
(cd plugin/skills && zip -qr ../../dist/uisp-login-skill.zip uisp-login)
for browser in chrome firefox; do
  (cd "$browser" && zip -qr "../dist/uisp-extension-$browser.zip" . -x "web-ext-artifacts/*" ".*")
done
ls dist
