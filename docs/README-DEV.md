# Maintain Signal Studio

Use Node.js 22 or newer. From the repository root run `npm run build`, `npm run check`, then `npm run preview`. Open `http://127.0.0.1:4173/Yatharth-Portfolio/`. The production build has no npm dependencies.

## Add a project

Edit `src/data/portfolio.json`. Duplicate a project and give it a unique lowercase URL-safe `id`. The ID is the permanent case study URL. Set its name, category (Products or Experiments), kind, description, problem, approach, and stack. Place project art in `src/assets/` and set `art` to the filename. Use the optional `repo` and `live` fields only for public destinations. For a verified screenshot, add `capture`, `captureAlt`, `captureWidth` and `captureHeight`. Record confirmed roles in `role`. The homepage, case page, sitemap and command palette are built from those entries.

## Change the look or content

Edit the two token blocks at the top of `src/studio.css` for the dark and light palettes. Geist Sans and Geist Mono are served locally from `src/assets/fonts/`, alongside their license. Edit the portrait, contact, biography, social links and dated journey in the data file. `scripts/build.mjs` holds the shared HTML templates. `src/studio.js` handles the filter, palette, terminal, contact form, signal control and typewriter.

## Check and publish

The Pages workflow verifies pull requests to `main`. It builds static files, checks internal links, exercises the browser UI, runs axe, enforces mobile Lighthouse scores of at least 90 in all four categories and uploads its audit artifacts. After verification, a push to `main` deploys `dist/` with `actions/deploy-pages`. Set the repository's Settings → Pages → Build and deployment → Source to GitHub Actions. On an internet-connected machine `node scripts/check.mjs --external` also checks external destinations. Results on third-party sites can depend on rate limits and bot rules.

The form uses the publicly documented email address and the existing FormSubmit endpoint. Activate the first message from FormSubmit if needed. Rejected requests leave the visitor's text in the form and display the direct-email fallback.

## Edit the GitHub profile

The account-named repository has its own `README.md` and daily workflow. Edit its introductory text, paths and project links in that README. Keep the two recent-activity comment markers. Edit `scripts/brand.mjs` and run it to regenerate banners/buttons. See `docs/PROFILE.md` in the profile project for card generation, scopes and activation.

## Remaining content

**TODO:** Add an approved résumé and additional public demo URLs when available. Original ORBITAL product screenshot and any undocumented individual roles can be added when verified. The portrait is already supplied. The portfolio has no runtime analytics or API credentials.

