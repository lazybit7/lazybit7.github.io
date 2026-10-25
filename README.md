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

## October pumpkin edition

Every October, the site automatically switches to a playful Halloween edition:
warm orange light/dark palettes, a seasonal hero badge,
pumpkin-stem tree details, a pumpkin favicon, and a little pumpkin cursor on
fine-pointer devices (including links and buttons). Text keeps its selection
cursor, touch behavior is unchanged, and unsupported custom cursors fall back
to native cursors. The existing light/dark preference still applies.

During October, the **pumpkin toggle next to the light/dark button** switches
the entire edition off or on, including its cursor and favicon, without changing
the light/dark theme. Its pressed state indicates whether Halloween is enabled;
its tooltip offers **Use normal design** or **Bring back pumpkins**.
Your choice is saved in `localStorage` as `halloween-disabled` and remembered
across reloads and future Octobers. If browser storage is unavailable, switching
still works for the current page. The control is hidden outside October.

The early script in `index.html` checks the visitor's **local month at page
load**, every year. October enables `data-season="halloween"` unless you have
chosen the normal design; a page loaded outside October always uses the
original design. An already-open page changes season
on its next reload, not at midnight. With JavaScript disabled, the original
design remains available. Resume printing stays unchanged.

Seasonal colors and decorations are scoped to screen media in `styles.css`.
The favicon and 32-pixel cursor share `assets/pumpkin.svg`.
There are no extra dependencies or build steps.

To preview outside October, use your browser's automation clock/date override
to set an October local date **before navigation**, then load the site. For a
visual-only preview in DevTools, set
`document.documentElement.dataset.season = "halloween"`; this previews the
styles and cursor but does not run favicon initialization. Reload to restore
the real-date behavior. Check September 30 / October 1 and October 31 /
November 1 when changing activation logic.

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
