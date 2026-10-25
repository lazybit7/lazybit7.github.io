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

## Tree topics

The tree keeps eight leaves, the root range `[0,7]`, and seven `push_down` calls.
Under `pro` are about `[0,1]` and resume `[2,3]`; under `fun` are sports `[4,5]`
and photos `[6,7]`. Each topic has two fact leaves defined in `script.js`.

The detailed lazy-propagation explainer is outside the tree. When all seven
internal nodes have been pushed, either individually or with **be eager**, the
completion log offers **→ The trick behind the tree** as a link instead of
opening the explainer automatically. The header's **lazy propagation** tab,
the hero and About text links, or `#lazy`, also open it directly
without pushing tree nodes. Reset hides it again.

## Adding photos and notes

Edit the photography section (`id="photos"`) in `index.html`. Replace the
Photos empty-state paragraph with figures and the Field notes empty-state
paragraph with your notes. Store web-sized images in `assets/` and use relative
paths. For example, after adding your own `assets/photo.jpg`:

```html
<figure class="photo">
  <img src="assets/photo.jpg" alt="Describe what is visible in the photograph"
       width="1600" height="1067" loading="lazy" decoding="async">
  <figcaption>Add a caption and any context you want to share.</figcaption>
</figure>
```

Use the image's actual pixel dimensions, meaningful alt text, and captions;
the existing styles preserve its aspect ratio. Add notes as paragraphs or
individual articles with headings in the Field notes panel. Update the two
photos fact leaves (nodes 14 and 15 in `script.js`) when content is available.
The gallery and notes remain readable without JavaScript and are excluded
from resume printing.
