<p align="center">
  <img src="public/favicon.svg" width="72" alt="Paperlight logo">
</p>

<h1 align="center">Paperlight website</h1>

<p align="center">
  <b>The landing page for <a href="https://github.com/webKing021/paperlight">Paperlight</a>.</b><br>
  Every document on your PC, one search away.
</p>

<p align="center">
  <a href="https://github.com/webKing021/paperlight"><b>The app</b></a> ·
  <a href="https://github.com/webKing021/paperlight/releases/latest">Download for Windows</a> ·
  <a href="#deploy">Deploy</a>
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/webKing021/paperlight-website"><img alt="Deploy with Vercel" src="https://vercel.com/button"></a>
  <a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-e09c26"></a>
</p>

<picture>
  <source media="(prefers-color-scheme: light)" srcset="docs/preview-light.png">
  <img src="docs/preview-dark.png" alt="The Paperlight website: headline, download button and the interactive demo below">
</picture>

## What's on it

- **A live demo.** A working copy of the app with sample documents. Search, typos and all.
- **Dark and light.** Dark by default; the choice is remembered.
- **Always current.** Star count and the latest installer come straight from GitHub.
- **Light to load.** No backend, no tracking, fonts self-hosted.
- **No dead ends.** Unknown links show a friendly page, never a 404.

## Run it

```bash
npm install
npm run dev      # start locally
npm run build    # production build in dist/
```

Add `?theme=light` to the URL to preview the light theme.

## Deploy

Import the repo on [Vercel](https://vercel.com/new) and press **Deploy**. No settings needed:
`vercel.json` handles the build, routing and short links (`/download`, `/github`).

## Where things are

| Path | What |
|---|---|
| `src/components` | Page sections: hero, features, privacy, FAQ |
| `src/demo` | The interactive app demo and its sample documents |
| `public` | Icons, screenshots and the social preview image |

Built with Vite, React, TypeScript and Tailwind CSS. [MIT](LICENSE) licensed.
Made by [webKing021](https://github.com/webKing021).
