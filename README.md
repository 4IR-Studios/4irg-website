# 4irg.com

The 4IR Group site. A single hand-written `index.html` — all CSS and JS inline,
the logo embedded as base64, Google Fonts the only external dependency. There is
no build step and no framework; the file that is committed here is the file that
is served.

## Editing

Open `index.html`, change it, commit. Netlify deploys `main` automatically once
the project is linked to this repo.

To preview locally:

    python3 -m http.server 8000

then open http://localhost:8000

## History note

Before this repo existed the site was published by drag-and-drop ("Netlify
Drop"), so there is no history earlier than the initial commit. That commit is a
byte-for-byte copy of what was live on 4irg.com.
