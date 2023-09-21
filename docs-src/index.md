---
layout: page.11ty.cjs
title: <go-board> ⌲ Home
---

# &lt;go-board>

`<go-board>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns">
  <div>

`<go-board>` is just an HTML element. You can it anywhere you can use HTML!

```html
<go-board></go-board>
```

  </div>
  <div>

<go-board></go-board>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<go-board>` can be configured with attributed in plain HTML.

```html
<go-board name="HTML"></go-board>
```

  </div>
  <div>

<go-board name="HTML"></go-board>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<go-board>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name = 'lit-html';

render(
  html`
    <h2>This is a &lt;go-board&gt;</h2>
    <go-board .name=${name}></go-board>
  `,
  document.body
);
```

  </div>
  <div>

<h2>This is a &lt;go-board&gt;</h2>
<go-board name="lit-html"></go-board>

  </div>
</section>
