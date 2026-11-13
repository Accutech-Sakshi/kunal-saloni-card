# Kunal & Saloni — React Wedding Invitation

Mobile-friendly React/Vite website with the floral invitation design, animated opening envelope, five illustrated event cards, family section, Google Maps, and music button.

## Run

```bash
npm install
npm run dev
```

Open the localhost URL shown in the terminal. To generate production files:

```bash
npm run build
```

## Vercel

Push the project to a GitHub repository, then import the repository at https://vercel.com/new. Framework Vite, build command `npm run build`, output directory `dist`.

## Update wedding details

Edit `src/data.js`. `To be announced` values are intentional placeholders; confirm all wedding ceremony dates, times and exact venue before sharing. Couple/family details in `src/App.jsx` can also be changed.

## Artwork & audio

The floral background is newly generated original artwork, not downloaded from the reference website. Event images are original decorative SVG illustrations. The MP3 is a newly synthesized instrumental melody, not the reference website's audio. Browsers do not allow automatic audio on page load: the audio begins when the guest taps to open the envelope, and can be muted or restarted using the lower-right button.

## Domain

A free `*.vercel.app` project URL is available after deployment. `kunal-saloni.invitationmedia.in` requires permission to use and configure the `invitationmedia.in` domain and its DNS records.

## Updated mobile envelope
`public/assets/reference-envelope.png` is a cropped envelope design from the user-provided reference screenshot (not extracted from the original website). The `K & S` seal overlays the old initials. `FlowerShower` in `src/App.jsx` renders falling blossoms on the first screen and invitation. Its animation is in `src/styles.css`.
