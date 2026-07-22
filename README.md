# Inner Compass

A mobile-first, installable self-awareness web app for:

- Naming likely emotions through guided multiple-choice questions
- Clarifying wants, needs, preferences, and boundaries
- Understanding reactions as trigger → interpretation → protection → need
- Reflecting on decisions without outsourcing the choice
- Building an evidence-based record of what energizes, drains, fits, and matters to you
- Seeing recurring patterns across saved entries

## Privacy

Inner Compass has no account or backend. Entries are stored only in the current browser using `localStorage`. Use **Settings → Export backup** to protect or move your data.

## Run locally

Because the app includes a service worker, use a local web server instead of opening `index.html` directly.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Upload every file and folder in this project.
3. Open **Settings → Pages** in the repository.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)` folder, then save.
6. Open the Pages URL GitHub provides.

On iPhone or iPad, open the deployed site in Safari, tap **Share**, and choose **Add to Home Screen**. On desktop Chrome or Edge, use the install icon in the address bar when available.

## Important note

This is a reflection and journaling tool. It does not diagnose mental-health conditions and should not be treated as a replacement for professional care.
