# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Selenium E2E testid (Login + Register)

Selles projektis on olemas Selenium testid failis `e2e/login-register.selenium.test.mjs`.

Testid katavad:

- registreerimise valideerimisvea (paroolid ei uhti)
- eduka registreerimise
- eduka sisselogimise
- vigase sisselogimise (vale kasutaja/parool)

### Kaivitamine lokaalselt

Kaivita frontendi kaustas:

```bash
npm run test:e2e:local
```

See kask:

- kaivitab backendi (`http://127.0.0.1:3005`)
- kaivitab frontendi (`http://127.0.0.1:5173`)
- ootab, kuni molemad pordid on uleval
- kaivitab Selenium testid

Marge: frontendi port on testides lukustatud `5173` peale (`--strictPort`).
Kui port `5173` on juba kasutuses, testid peatatakse kohe selge veaga.

### Ainult testifaili kaivitamine

Kui serverid on juba eraldi kaivitatud, kasuta:

```bash
npm run test:e2e
```

### Kasulikud keskkonnamuutujad

- `E2E_FRONTEND_URL` (vaikimisi `http://127.0.0.1:5173`)
- `E2E_BACKEND_URL` (vaikimisi `http://127.0.0.1:3005`)
- `E2E_HEADLESS` (`false`, kui soovid brauseriakent naha)

Kui naed, et Vite proovib minna pordile `5174` voi muule pordile, peata eelmine dev-server ja kaivita test uuesti.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
