# lazybit7.github.io

Personal site at [lazybit7.github.io](https://lazybit7.github.io/), built with
plain HTML, CSS, and JavaScript.

## Features

- Interactive segment-tree navigation with lazy propagation.
- About, resume, sports, and photography sections.
- Light/dark themes and a print-friendly resume.
- Automatic October Halloween theme with a fading pumpkin cursor trail and opt-out.

## Local preview

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [localhost:8000](http://127.0.0.1:8000/). No dependencies or build step.

## Editing

- `index.html`: content and seasonal initialization.
- `styles.css`: layout, themes, and print styles.
- `script.js`: tree navigation and theme controls.
- `assets/`: images, favicon, and pumpkin artwork.

The Halloween theme uses the visitor's local month at page load. The pumpkin
toggle beside light/dark remembers the choice without changing that preference.
Small pumpkins fade along the native cursor's path on mouse devices. The trail
is disabled for touch and reduced-motion preferences and never intercepts clicks.
