# Bosman Smit Pretorius Inc: Website

A static 3-page website built with plain HTML, CSS and JavaScript. It needs no build step, no framework and no backend.

## File structure

```
bosman-smit-pretorius-inc/
├── index.html          Home (hero, about preview, practice areas, why us, testimonials, booking, CTA)
├── about.html          About (overview, mission, values, approach, stats, timeline)
├── contact.html        Contact (details, hours, form, map placeholder, FAQ accordion)
├── css/styles.css      All styles (design tokens at the top under :root)
├── js/main.js          Navigation, animations, counters, FAQ, forms, WhatsApp config
├── images/             Placeholder images (replace these)
│   ├── hero.svg            Home hero background      (1920×1080)
│   ├── about-office.svg    Home/About split image    (1200×1500 portrait)
│   ├── attorney.svg        About attorney portrait   (1000×1250 portrait)
│   ├── cta-bg.svg          CTA band background       (1920×900)
│   ├── og-image.svg        Social share preview      (export as og-image.jpg, 1200×630)
│   └── favicon.svg         Browser tab icon
├── robots.txt
├── sitemap.xml
└── README.md
```

To preview the site, open `index.html` in a browser. You can also run `npx serve .` in this folder.

---

## Where to replace your details

Use your editor's **Find & Replace across all files**. Each placeholder below is written the same way everywhere it appears.

| What | Find this placeholder | Files |
|---|---|---|
| **Phone (display)** | `+27 (0)28 000 0000` | index, about, contact |
| **Phone (links)** | `tel:+27280000000` | index, about, contact |
| **Phone (schema)** | `+27-28-000-0000` | index, about, contact (inside `<script type="application/ld+json">`) |
| **Email** | `info@bosmansmitpretorius.co.za` | index, about, contact |
| **Street address** | `00 Main Road` | all pages + schema |
| **Town / postcode** | `Hermanus` / `7200` (check each match) | all pages + schema |
| **Map coordinates** | `-34.4187` and `19.2345` | index, contact (meta `geo.position`, `ICBM`, schema `geo`) |
| **Domain** | `https://www.bosmansmitpretorius.co.za` | all HTML `<head>`s, `robots.txt`, `sitemap.xml` |
| **Business hours** | `08:00 – 17:00` / `Mon – Fri` | contact.html "Business Hours", footer, schema `openingHoursSpecification` |
| **Principal attorney** | `[Principal Attorney Name]` | about.html |
| **Social links** | `<!-- REPLACE: social media URLs -->` (the `href="#"` below it) | footer on every page; also `sameAs` in index.html schema |

### WhatsApp number: one place only
Open `js/main.js`. At the very top:

```js
const SITE_CONFIG = {
  WHATSAPP_NUMBER: "27000000000",   // ← digits only, international format
  WHATSAPP_MESSAGE: "Good day, I would like to enquire ...",
  FORM_ENDPOINT: ""
};
```

Example: `082 123 4567` becomes `"27821234567"`. Every element with the `data-whatsapp` attribute (the floating button and the Contact page CTA) updates automatically. For full fallback without JavaScript, also find and replace `https://wa.me/27000000000` in the HTML.

### Images
Every image has a `<!-- REPLACE IMAGE: ... -->` comment above it. Two ways to replace:
1. **Simplest:** keep the filename and overwrite the file. If you switch from `.svg` to `.jpg`/`.webp`, find and replace `images/hero.svg` → `images/hero.jpg` (etc.) across the HTML files. For the hero, also update the `<link rel="preload">` in `index.html`.
2. Update the `alt` text so it describes the new photo. This matters for SEO and accessibility.

Tips: export photos as **WebP or JPG under ~250 KB** (hero under ~400 KB). Photos are shown in greyscale by default (`.frame img` and `.cta__bg img` in the CSS). Remove `filter: grayscale(1)` there if you want them in colour.

**Social image:** create `images/og-image.jpg` at **1200×630**. Facebook, LinkedIn and WhatsApp previews do not support SVG.

### Statistics, timeline and badge
- `about.html`: stats use `data-count="2500" data-suffix="+"`. Change both `data-count` and the text inside the tag.
- `about.html`: timeline years and milestones are marked `<!-- REPLACE -->`.
- `index.html`: the "25+ Years of practice" badge in the About preview.

### Testimonials (important)
The six testimonials in `index.html` are **sample content for layout only**. Replace them with genuine client reviews, used with the client's consent, before launch. Publishing invented reviews misleads clients and may breach the Legal Practice Council's rules on advertising. For the same reason, there is deliberately **no `aggregateRating` in the schema**. Only add one if it is backed by real, verifiable reviews (e.g. from your Google Business Profile).

---

## Activating the forms

Both forms (Home booking and Contact) validate input, block spam with a honeypot, and require POPIA consent. They currently **simulate** a successful send.

To make them live, create a free form endpoint (e.g. Formspree, Getform, Basin) and paste its URL:

```js
FORM_ENDPOINT: "https://formspree.io/f/your-id"
```

If you host on **Netlify**, you can use Netlify Forms instead. Add `name="booking"` and `data-netlify="true"` to the `<form>` tag.

For **real-time scheduling**, replace the booking `<form>` in `index.html` (the section `id="booking"`) with a Calendly, Cal.com or Acuity embed. The surrounding design stays the same.

## Activating Google Maps

In `contact.html`, find the `GOOGLE MAPS PLACEHOLDER` comment. In Google Maps, search for the office, then choose **Share → Embed a map** and copy the `<iframe>`. Paste it in place of the `<div class="map__pin">…</div>`, and add `loading="lazy" title="Office location map"`. The CSS automatically styles the map in a dark tone.

---

## SEO checklist at launch

- [ ] Replace the domain in every `<link rel="canonical">`, `og:url`, schema `@id`/`url`, `robots.txt` and `sitemap.xml`
- [ ] Update `<lastmod>` dates in `sitemap.xml`
- [ ] Create `images/og-image.jpg` (1200×630)
- [ ] Submit `sitemap.xml` in Google Search Console
- [ ] Create or verify a **Google Business Profile** with exactly the same name, address and phone (NAP) as the site
- [ ] Test the schema at https://search.google.com/test/rich-results
- [ ] Add pages for the Privacy Policy (POPIA), PAIA Manual and Terms, then link them in the footer (they currently point to `#`)

### What's included
- Semantic HTML5 landmarks (`header`, `nav`, `main`, `section`, `article`, `footer`) with one `<h1>` per page and a logical H2/H3 hierarchy
- JSON-LD: `LegalService` + `LocalBusiness` (with address, geo, hours, area served and service catalogue), `Organization`, `WebSite`, `WebPage`, `AboutPage`, `ContactPage`, `BreadcrumbList` and `FAQPage`
- Open Graph and Twitter Card tags, canonical URLs, hreflang `en-za`, geo meta tags
- Target keywords placed in titles, descriptions, headings and body copy: *Attorneys / Lawyers / Law Firm / Legal Services Overstrand, Attorneys Western Cape, Property & Family Lawyers Overstrand*
- Accessibility: skip link, visible focus states, ARIA on the menu and accordion, labelled form fields with live error messages, and reduced-motion support
- Performance: no frameworks, deferred JavaScript, lazy-loaded images, a preloaded hero image and `font-display: swap`

## Customising the look
All colours, fonts and spacing are CSS variables at the top of `css/styles.css` (`:root`). Change `--c-black`, `--c-dark` and `--c-charcoal` to adjust the palette site-wide.
