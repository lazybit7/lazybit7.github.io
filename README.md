# lazybit7.github.io

Personal site, prepared for https://lazybit7.github.io/.

## Local preview

From this directory, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/. Stop the server with Ctrl+C.

Edit `index.html`, `styles.css`, `script.js`, or files in `assets/`, then refresh
the browser. No dependencies or build step are required.

## GitHub Pages

The site uses relative asset paths and can be served from the repository root
at https://lazybit7.github.io/. When publishing is authorized, GitHub Pages
can use **Deploy from a branch**, with **main** and **/ (root)**.

Local changes are not published until they are committed and pushed.
