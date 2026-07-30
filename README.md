# Inner Compass

A mobile-first, installable self-awareness web app for:

- Naming likely emotions through guided multiple-choice questions
- Clarifying wants, needs, preferences, and boundaries
- Choosing free-time activities based on current energy, mental bandwidth, available time, and emotional need—without treating rest as less worthy
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

## Free-Time Compass

The **What should I do right now?** guide asks about available time, energy, mental bandwidth, desired feeling, and guilt or decision pressure. It reflects back a likely downtime mode (such as deep recovery, comfort, play, creative expression, connection, or a satisfying reset) and offers concrete activities that fit the current moment. Saved choices appear in History and can contribute to pattern insights after repeated use.


## Version 3 additions

- History entries can now be edited to fix typos or revise the original reflection.
- Entries can also receive dated follow-up notes without overwriting the original.
- Emotion check-ins now suggest context-aware ways to soothe the feeling and respond with more choice. Relationship and family frustration includes communication-focused guidance rather than only generic calming advice.
