# ✦ AI Social Content Studio

> **Mobile-First веб-приложение для генерации контента для соцсетей (Telegram, Instagram, YouTube) на базе Google Gemini API.**

🌐 **Live Demo (Рабочее веб-приложение):**  
👉 **[https://olimyunusxojaev-oss.github.io/smm-content-studio/](https://olimyunusxojaev-oss.github.io/smm-content-studio/)**

Создано с фокусом на избавление от «нейрослопа», утонченную эстетику *Warm Editorial / Quiet Luxury*, пружинную физику Framer Motion, тактильный отклик (Web Audio ASMR + Haptics) и модель полной приватности **BYOK (Bring Your Own Key)**.

---

## ✨ Ключевые возможности

- 🌐 **Работает прямо в браузере:** Развернуто на GitHub Pages без необходимости локальной установки: [Открыть приложение](https://olimyunusxojaev-oss.github.io/smm-content-studio/).
- 📱 **Mobile-First UX & Safe Areas:** Интерфейс оптимизирован под управление одной рукой — фиксированный плавающий док действий снизу (Thumb Sticky Dock).
- 🧠 **Google Gemini Engine:** Поддержка моделей `gemini-2.0-flash`, `gemini-1.5-flash-lite` и `gemini-2.5-flash` со структурированным JSON-выводом.
- 🎯 **3 разноплановых варианта:** Каждая генерация создает 3 альтернативы:
  - *«Продающий оффер»* (прямая выгода, оффер и конверсия)
  - *«Сторителлинг»* (эмпатия, опыт, инсайт или кейс)
  - *«Экспертный разбор»* (факты, польза, цифры, мифы)
- 🌊 **Живой каскадный стриминг (Fade-Up):** Текст плавно проявляется построчно в реальном времени с эффектом дыхания (Breathing Glow).
- 📋 **1-Click Copy & Тактильность:** Копирование всего поста целиком со стрелкой `→`, микро-салютом конфетти, двойным Haptic-откликом и мягким звуковым аккордом. Также доступно поблочное копирование (хук, тело, CTA, теги).
- 🔥 **Шкала силы хука (Hook Meter):** 3-уровневый индикатор виральности заголовка.
- 💾 **Офлайн-история (IndexedDB):** До 200 постов сохраняются локально в базе данных через Dexie.js, с фильтрами по соцсетям, избранным (★) и поиском.
- 🎨 **Anti-AI-Slop Дизайн:** Никаких фиолетовых клише. Теплый льняной фон (`#F8F5F0`), темный эспрессо-режим (`#141211`), матовый микро-шум бумаги и нативные бейджи соцсетей.
- 🔒 **BYOK Приватность:** API-ключ Gemini вводится один раз, валидируется живым пингом и хранится исключительно в `localStorage` вашего браузера.

---

## 🛠 Технологический стек

- **Фреймворк:** [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Хостинг:** [GitHub Pages](https://olimyunusxojaev-oss.github.io/smm-content-studio/)
- **Язык:** TypeScript 5
- **Стилизация:** [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Анимации:** [Framer Motion 12](https://www.framer.com/motion/) (пружинная физика, layoutId)
- **База данных:** [Dexie.js](https://dexie.org/) (IndexedDB оффлайн хранилище)
- **Иконки:** [Lucide React](https://lucide.dev/)
- **Звук & Салют:** Web Audio API (ASMR clicks) + `canvas-confetti`

---

## 🚀 Быстрый запуск

### Вариант 1: Открыть онлайн без установки
Просто перейдите по ссылке:  
👉 **[https://olimyunusxojaev-oss.github.io/smm-content-studio/](https://olimyunusxojaev-oss.github.io/smm-content-studio/)**

### Вариант 2: Локальная разработка
```bash
git clone https://github.com/olimyunusxojaev-oss/smm-content-studio.git
cd smm-content-studio
npm install
npm run dev
```
Откройте [http://localhost:3000](http://localhost:3000).

---

## 🔑 Как начать пользоваться:
1. Нажмите на иконку ключа `⚙️ / 🔑` в верхнем правом углу.
2. Вставьте ваш бесплатный ключ из [Google AI Studio](https://aistudio.google.com/app/apikey).
3. Нажмите «Проверить ключ» и «Сохранить».

---

## 📚 Документация проекта

- [PRD.md](./PRD.md) — Продуктовые требования и бизнес-цели
- [SPEC.md](./SPEC.md) — Архитектурная и техническая спецификация
- [DESIGN.md](./DESIGN.md) — Дизайн-манифест, токены и анимационная хореография

---

## 📄 Лицензия

MIT License © 2026
