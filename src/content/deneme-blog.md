---
title: "CSS Grid Layout"
excerpt: "CSS Grid ile modern ve responsive layout'lar oluşturun."
coverImage: "/developer.jpg"
date: "2024-12-20"
tags: ["CSS", "Grid", "Layout", "Responsive"]
---

# CSS Grid Layout

CSS Grid, two-dimensional layout sistemidir. Flexbox'a göre daha karmaşık layout'lar için idealdir.

## Temel Kullanım

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```

## Grid Areas

```css
.container {
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

## Responsive Grid

```css
.container {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

CSS Grid ile esnek ve güçlü layout'lar oluşturabilirsiniz!
