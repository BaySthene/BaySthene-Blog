# BaySthene Blog 📝

Kişisel blog sitesi - Next.js 15, TypeScript ve Material Design 3 token sistemi ile geliştirilmiştir.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Özellikler

- ⚡ **Next.js 15** - App Router ile modern React
- 🎨 **M3 Design Tokens** - Material Design 3 renk sistemi
- 🌙 **Dark/Light Mode** - Tema + kontrast ayarları
- 🔍 **Canlı Arama** - Debounced, klavye navigasyonu
- ✨ **Syntax Highlighting** - Kod blokları için renklendirme
- 📋 **Kod Kopyalama** - Tek tıkla kodu kopyala
- 📱 **Responsive** - Tüm ekran boyutlarında uyumlu
- 🎯 **SEO Optimized** - Meta taglar ve Open Graph

## 📦 Kurulum

```bash
# Repoyu klonla
git clone https://github.com/YOUR_USERNAME/BaySthene-Blog.git

# Klasöre gir
cd BaySthene-Blog

# Bağımlılıkları yükle
npm install

# Development server başlat
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini aç.

## 📁 Proje Yapısı

```
src/
├── app/                 # Next.js App Router sayfaları
│   ├── blog/[slug]/     # Blog detay sayfası
│   ├── search/          # Arama sayfası
│   └── api/             # API routes
├── components/          # React bileşenleri
│   ├── Icons/           # SVG ikon bileşenleri
│   ├── Header/          # Üst menü
│   ├── Footer/          # Alt kısım
│   ├── BlogCard/        # Blog kartı
│   └── ...
├── content/             # Markdown blog yazıları
├── lib/                 # Yardımcı fonksiyonlar
└── styles/              # Global CSS ve tokenlar
```

## ✍️ Blog Yazısı Ekleme

`src/content/` klasörüne `.md` dosyası ekleyin:

```markdown
---
title: "Yazı Başlığı"
excerpt: "Kısa açıklama"
date: "2024-12-30"
coverImage: "/images/cover.jpg"
tags: ["React", "TypeScript"]
authorName: "Muhammed Bera Koç"
---

Yazı içeriği buraya...
```

## 🛠️ Teknolojiler

- **Framework:** Next.js 15 (App Router)
- **Dil:** TypeScript
- **Stil:** CSS Modules + M3 Tokens
- **Markdown:** gray-matter + unified/remark
- **Syntax Highlight:** rehype-highlight

## 📋 Yol Haritası

Bkz: [ROADMAP.md](./ROADMAP.md)

## 🔮 Gelecek Planlar

Bkz: [FUTURE_IMPROVEMENTS.md](./FUTURE_IMPROVEMENTS.md)

## 📄 Lisans

MIT License - Dilediğiniz gibi kullanabilirsiniz.

---

Built with ❤️ by [Muhammed Bera Koç](https://github.com/YOUR_USERNAME)
