# Ahn Yu Lim — portfolio site

Static site for GitHub Pages. No server code: plain HTML, CSS and JavaScript.

## Folders

- `src/app.tsx` — home, work, project and about pages
- `src/guides/` — the fru:now and Tandanji Office Meal guideline boards
- `assets/js/data.js` — all text and project content (edit this to change copy or add a project)
- `assets/img/` — every image on the site
- `assets/css/site.css` — layout and type
- `tools/` — build and preview scripts (not needed by the live site)

## Build

After editing anything in `src/` or `assets/js/data.js` (new project pages are created from it):

```
zsh tools/build.sh
```

This compiles `src/` into `assets/js/app.js` and `assets/js/guides.js` and writes one `index.html` per page.

## Preview

```
perl tools/serve.pl 8123
```

Then open http://localhost:8123.

## Publish on GitHub Pages

1. Create a repository named `<your-github-id>.github.io` (the site uses root paths like `/work/`).
2. Upload the contents of this folder to it (GitHub Desktop: add this folder as a repository, then Publish).
3. Repository → Settings → Pages → Source: "Deploy from a branch", Branch: `main`, folder `/ (root)`.
4. The site appears at `https://<your-github-id>.github.io` after a minute or two.

## Custom domain (e.g. ahnyulim.com, bought on Gabia)

1. Repository → Settings → Pages → Custom domain: enter the domain and save. This adds a `CNAME` file.
2. Gabia → My가비아 → 도메인 관리 → the domain → DNS 관리툴 (DNS 설정) → add records:
   - `A` `@` `185.199.108.153`
   - `A` `@` `185.199.109.153`
   - `A` `@` `185.199.110.153`
   - `A` `@` `185.199.111.153`
   - `CNAME` `www` `<your-github-id>.github.io`
3. Back in Settings → Pages, tick "Enforce HTTPS" once it becomes available.
