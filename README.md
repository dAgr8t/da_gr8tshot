# Photography portfolio site

A plain static website: six pages, separate CSS and JavaScript files, no build step and no backend.

## Folder map

```
index.html        Home page
about.html        About page
services.html     Services page
portfolio.html    Portfolio page (gallery with filter tabs)
packages.html     Packages page
contact.html      Contact page

css/
  base.css          colours, fonts, buttons: shared by all pages
  layout.css        header and footer
  components.css    photo frames, cards, sliders, price plans, gallery tiles, FAQ
  page-header.css   the dark banner at the top of the inner pages
  home.css          home page only
  about.css, services.css, portfolio.css, packages.css, contact.css   one per page

js/
  frames.js         puts your photos into the photo frames (all pages)
  layout.js         builds the header and footer (all pages)
  reveal.js         fade-in on scroll (all pages)
  page-header.js    scrolling photo columns in the page banners (inner pages)
  home.js           hero light, sliders (home page)
  portfolio.js      builds the gallery and filter tabs (Portfolio page)
  contact.js        checks the form and opens the email app (Contact page)

data/
  site.js           YOUR DETAILS: name, email, phone, address, Instagram
  photos.js         YOUR PHOTOS: one line per photo

images/             the photo files
```

Every HTML page has a comment above each section saying what it is, and every CSS and JS file starts with a comment explaining its job.

## Adding a photo
1. Resize the photo to about 1600px on the long side and save it as a JPG under 400 KB (Squoosh.app is free and runs in the browser).
2. Put it in `images/`, for example `images/anna-wedding.jpg`.
3. Add one line at the top of the list in `data/photos.js`:

   `{ src: "images/anna-wedding.jpg", title: "Anna's wedding", category: "Events", camera: "Sony A7 IV", date: "Oct 2026" },`

4. Redeploy. The photo appears in the Portfolio gallery, and a new category becomes a filter tab automatically.

The first photos in the list also fill the scrolling backgrounds on the home page and page banners, so keep your best work at the top.

## Changing your details
Edit `data/site.js`. The header, footer, contact page and contact form all read from it.
Also search the HTML files for the placeholder text, sample prices, testimonials and client names, and replace them with your own.

## Changing the menu
Edit the `LINKS` list at the top of `js/layout.js`. The header and footer update on every page.

## Removing the sample photos
Delete the `images/sample-*.jpg` files and the sample lines in `data/photos.js`. They are open-licensed placeholders. Do not publish them as your own work.

## Deploying (free)
- **Vercel or Netlify:** connect a GitHub repo containing these files, with no build command and the root folder as the output. Every push redeploys automatically. Dragging the folder onto Netlify's deploy page also works.
- **GitHub Pages:** push to a repo and turn on Pages.

## Previewing on your computer
Open `index.html` in a browser. It works without a server.

## Notes
- The contact form opens the visitor's email app, addressed to the email in `data/site.js`, because a static site cannot send email itself. To receive messages directly, point the form at Formspree or Netlify Forms.
- The "Blog" link goes to the journal section on the home page. A full blog page is not built yet.
