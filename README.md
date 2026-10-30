# FUNDS ARE SAFU — $SAFU website

A complete, original, responsive memecoin website inspired by the **section sequence** of the PEPEween reference (hero → story → four gallery memes → featured chapter → how-to guide → footer). All images are original artwork created in this conversation. No code, fonts, or illustrations were copied from PEPEween.

This is intentionally an **unofficial parody/meme website**, not a Binance product, not an assurance of fund security, and not financial advice.

## Requirements

- Node.js **18+**
- **No `npm install` required**. No third-party build dependencies.

## Start developing

```bash
npm run dev
```

Open **http://localhost:5173**.

## Build and deploy

```bash
npm run check
npm run build
npm run preview
```

Preview the production output at **http://localhost:4173**. Upload the whole **`dist/`** directory to Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, or any static host. `dist/` is already included in the delivered ZIP, so you can also upload it **without building locally**.

### Deploy options

- **Netlify**: drag `dist/` onto Netlify Drop, or connect the repo with build command `npm run build` and publish directory `dist`.
- **Vercel**: choose "Other" framework, build command `npm run build`, output directory `dist`.
- **Cloudflare Pages**: build command `npm run build`, output directory `dist`.
- **GitHub Pages**: deploy the content of `dist/` to the publishing branch. All file references are relative, so sub-path hosting is supported.

## IMPORTANT: customize before going live

Open **`src/config.js`** and replace blank fields **only with real verified information**:

```js
export const SITE_CONFIG = {
  symbol: '$SAFU',
  chain: 'To be announced',
  contractAddress: '',
  links: {
    buy: '',
    telegram: '',
    x: '',
    chart: '',
  },
};
```

Until these are set:
- the **Buy**, **X**, **Telegram** and **Chart** links show a clear "coming soon" notification instead of pointing to an invented asset;
- copy contract buttons display a notification instead of a fake address;
- the network displays "To be announced".

If you edit `config.js`, **run `npm run build` again** and redeploy the updated `dist/`.

### Content & visuals

- Edit all copy, headings, gallery captions and page structure in `src/index.html`.
- Edit colors, layouts, fonts, effects, and responsive breakpoints in `src/styles.css`.
- Edit behavior (image viewer, copy, toggle, interactions) in `src/main.js`.
- Original, full-resolution PNGs are stored in `original-art/`.
- Optimized WebP versions are stored in `src/assets/` and are used by the production site.
- The transparent logo illustration is `src/assets/safu-mascot.webp`. The widescreen Chapter 1 illustration is `story-collage.webp`.
- The primary hero art is `hero-scene.webp`; the four gallery pieces are `gallery-01.webp` through `gallery-04.webp`, and the giant circular Chapter 2 image is `featured-vault.webp`.
- Change `src/assets/social-preview.jpg` to customize the OpenGraph image. For best sharing previews, replace the relative `og:image` URL in `src/index.html` with the **absolute public URL** after launch.
- Optional Google Fonts are loaded via a Google Fonts stylesheet; local fallbacks are included so the website remains usable if those fonts cannot load.

### Built-in features

- Responsive desktop, tablet and mobile designs
- Editable, verified-link configuration and safe unconfigured states
- Sticky navigation, mobile menu, scroll progress indicator
- Paper/night mode toggle with local preference storage
- Four-image gallery modal with keyboard navigation and Escape-to-close
- Scroll-in reveals with reduced-motion support
- Copy contract button and accessible status notifications
- SEO/social preview metadata and SVG favicon
- Lazy-loaded gallery/section images, WebP compression
- Semantic HTML, alt text, keyboard-focus styling, skip navigation
- Zero runtime dependencies, self-contained static production build

## License and disclaimer

Source code authored for this user. The included artwork features stylized public-figure likenesses and Binance-themed symbols as **parody**; neither these people nor Binance are claimed to sponsor, partner with, or endorse the token. Verify trademark and publicity rights with counsel before commercial deployment. No artwork or language guarantees that user funds are safe. Crypto assets are speculative and can lose all value.
