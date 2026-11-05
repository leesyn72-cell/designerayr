#!/bin/zsh
# Builds the static site: compiles TSX in src/ to assets/js/, and writes one HTML page per route.
# usage: zsh tools/build.sh
set -e
cd "$(dirname "$0")/.."
ROOT="$PWD"
BABEL="$ROOT/tools/vendor/babel.min.js"
TMP="$(mktemp -d)"

compile() { osascript -l JavaScript "$ROOT/tools/compile.js" "$BABEL" "$1" "$2" >/dev/null; }

# App
compile "$ROOT/src/app.tsx" "$TMP/app.js"
{ echo "(function () {"; cat "$TMP/app.js"; echo "})();"; } > assets/js/app.js

# Guidelines: drop Framer imports, point images at /assets/img/, register on window.Guides
: > assets/js/guides.js
for f in src/guides/*.tsx; do
    name="$(basename "$f" .tsx)"
    perl -pe 's/^import .*$//; s/^export default function/function/; s#https://framerusercontent.com/images/#/assets/img/#g' "$f" > "$TMP/$name.tsx"
    compile "$TMP/$name.tsx" "$TMP/$name.js"
    { echo "(function () {"
      echo "const addPropertyControls = () => {}; const ControlType = new Proxy({}, { get: (_, k) => k });"
      cat "$TMP/$name.js"
      echo "(window.Guides = window.Guides || {}).$name = $name;"
      echo "})();"; } >> assets/js/guides.js
done
rm -rf "$TMP"

# Pages
page() { # $1 = output dir, $2 = PAGE json, $3 = title
    mkdir -p "$1"
    sed -e "s#__PAGE__#$2#" -e "s#__TITLE__#$3#" tools/page.html > "$1/index.html"
}
page "." '{"type":"home"}' "Ahn Yu Lim — Graphic Designer"
page "work" '{"type":"work"}' "Work — Ahn Yu Lim"
page "about" '{"type":"about"}' "About — Ahn Yu Lim"
grep -o 'slug: "[^"]*", title: "[^"]*"' assets/js/data.js | while IFS= read -r line; do
    slug="$(echo "$line" | sed -E 's/slug: "([^"]*)".*/\1/')"
    title="$(echo "$line" | sed -E 's/.*title: "([^"]*)"/\1/')"
    page "projects/$slug" "{\"type\":\"project\",\"slug\":\"$slug\"}" "$title — Ahn Yu Lim"
done
cp index.html 404.html
echo "built"
