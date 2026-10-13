# Punto Vivo Dashboard

Dashboard for Punto Vivo Bogotá, a smart bulky-waste management system. The interface is in Spanish by default and can be switched to English from the login screen.

## Prerequisites

- [Node.js](https://nodejs.org/) 22
- [pnpm](https://pnpm.io/) 10.34.3
- [Git LFS](https://git-lfs.com/), used for the logo and map images

Versions are also pinned in `.mise.toml` if you use [mise](https://mise.jdx.dev/).

## Setup

```bash
git lfs install
git clone https://github.com/motionmanjevin/punto-vivo-dashboard.git
cd punto-vivo-dashboard
pnpm install
pnpm dev
```

Open [http://localhost:8443](http://localhost:8443). The dev server binds to port `8443`. Set `PORT` before starting if that port is already in use:

```bash
# Windows PowerShell
$env:PORT = "5173"; pnpm dev

# macOS / Linux
PORT=5173 pnpm dev
```

If the logo or images are missing after clone, Git LFS did not download them. Run:

```bash
git lfs install
git lfs pull
```

## Sign in

The login screen is a local demo. Any email and password will open the dashboard. Leave the fields empty to continue as `admin@puntovivo.gov.co`.

## Mapbox

Tracking maps use Mapbox. A public token is already included, so maps work without extra configuration. To use your own token, create a `.env` file in the project root:

```bash
VITE_MAPBOX_TOKEN=your_mapbox_public_token
```

`.env` files are gitignored.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server on port 8443 |
| `pnpm build` | Build the production app into `dist/` |
| `pnpm preview` | Serve the production build |
| `pnpm format` | Format the source with oxfmt |
