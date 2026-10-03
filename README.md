# Veronika Kadamani — Electric Violet

Статический сайт, готовый для GitHub Pages. Без сборки и платных зависимостей.

## Страницы и файлы

| Файл | Назначение |
| --- | --- |
| `index.html` | Главная |
| `portfolio.html` | Портфолио с фильтрами |
| `services.html` | Монтаж, контент, 3 формата SMM, сайты |
| `results.html` | YouTube, TikTok, Instagram кейсы |
| `about.html` | О Веронике, инструменты и обучение |
| `assets/style.css` | Адаптивный Electric Violet дизайн |
| `assets/content.js` | EN/RU тексты, реальные материалы и настройки |
| `assets/app.js` | Навигация, языки, фильтры, видео и форма |
| `assets/favicon.svg` | Favicon VK |
| `.github/workflows/pages.yml` | Публикация через GitHub Actions |
| `.nojekyll` | Поддержка статических файлов GitHub Pages |

## Посмотреть локально

Откройте `index.html` в браузере. Либо запустите в этой папке:

```sh
python3 -m http.server 8000
```

Затем откройте `http://localhost:8000`. Отдельный файл `Veronika-Kadamani-preview.html` позволяет просматривать все страницы без распаковки. В нём встроены фото, постеры, короткие previews и showreel; полные работы открываются через интернет в Drive. Для локальных полных MP4 используйте распакованный проект.

## Что реализовано

- 5 страниц, sticky header, адаптивное меню и контакты.
- Полный переключатель EN/RU, английский по умолчанию; выбор сохраняется на устройстве.
- Portfolio: ALL / REELS & SHORTS / YOUTUBE / BUSINESS / VLOGS без перезагрузки.
- Видео-модальное окно с нативными controls. Lazy loading, muted preview на hover/focus, preview в viewport на touch. Учитывается reduced motion.
- Get a Quote: разные подкатегории для монтажа и SMM, необязательный бюджет, проверка контакта, email-черновик, копирование запроса.
- FAQ, кейсы и подтверждённые ТЗ цифры, выбранные имена клиентов.
- Контакты только Telegram, email и Instagram. Без WhatsApp, личного TikTok и моделинга.

## Подключённые реальные материалы

- Два выбранных портрета в чёрном: главный и supporting portrait.
- 25 проектов из предоставленной Google Drive папки.
- 21 локальное видео с controls; 21 короткое muted preview по 4 секунды.
- Четыре крупных оригинала (два свадебных, влог и makeup reel) открываются через встроенный Drive player. Исходные ссылки доступны рядом с плеером.
- Шесть избранных проектов на главной и 18-секундный showreel из реальных видео.
- Два оригинальных скриншота Instagram. Показатели 27 644 просмотра, 83,2% не-подписчиков и 26 568 охваченных аккаунтов относятся к одной конкретной сторис; отдельный скриншот показывает 11 438 просмотров другой сторис. Эти показатели не суммируются.
- YouTube/TikTok case figures сохранены из ТЗ. Исходные скриншоты этих площадок в предоставленной папке не найдены.

Фильтр YouTube включает длинный Russian Vlog по формату; это не утверждение о публикации на конкретном канале. Папка Asia содержит ролик о еде и lifestyle, поэтому он подписан по содержимому.

Подтверждённые тексты настоящих отзывов не предоставлены; вымышленные отзывы не опубликованы. Прямая доставка формы пока не подключена.

## Подключение реальных материалов

Для последующих обновлений в `assets/content.js` изменять `PORTFOLIO_CONFIG`. Пути должны быть относительными, чтобы сайт работал в подпапке репозитория GitHub Pages.

```js
portraits: {
  main: 'assets/portrait-main.jpg',
  side: 'assets/portrait-side.jpg'
},
showreel: 'assets/showreel.mp4',
projects: [{
  id: 'restaurant-01',
  title: { en: 'Restaurant 01', ru: 'Ресторан 01' },
  category: 'business', // shorts, youtube, business, vlogs
  poster: 'assets/restaurant-01.jpg',
  video: 'assets/restaurant-01.mp4',
  description: { en: '...', ru: '...' },
  featured: true
}]
```

Для внешних работ можно добавить `url` вместо `video`; проект откроется по исходной ссылке. Не вставлять Drive share link в `<video>`: это не прямая ссылка на MP4. Лучше экспортировать небольшой web-ready MP4 и poster; для больших файлов — внешняя видеоплощадка или media storage. GitHub ограничивает отдельные файлы; не загружать исходные тяжёлые видео.

## Форма: реальное поведение

GitHub Pages не предоставляет сервер для отправки почты. По умолчанию форма готовит email со всеми данными; пользователь нажимает «Отправить» в почтовом приложении. Кнопка подписана «Prepare email request» / «Подготовить письмо». Успех доставки не заявляется.

Для прямой отправки подключить проверенный HTTPS endpoint через `formEndpoint`. Он должен принимать JSON POST с полями name, email, telegram, service, type, budget, details, language, поддерживать CORS и возвращать 2xx только после принятия заявки. Секретные ключи в frontend не хранить. Endpoint требуется проверить до публикации.

## GitHub Pages — что нажать

1. GitHub → **+ → New repository**.
2. Название: `veronika-portfolio`; выбрать **Public**, затем **Create repository**.
3. **uploading an existing file** / **Add file → Upload files**.
4. Распаковать архив. Загрузить содержимое папки `veronika-portfolio` в корень репозитория: HTML-файлы должны лежать сразу в корне, а не во вложенной папке. Нажать **Commit changes** в ветку `main`.
5. Для самого простого варианта: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main → /(root) → Save**. Это работает без скрытой папки `.github`.
6. Если загрузили `.github/workflows/pages.yml`, можно вместо этого выбрать **Source: GitHub Actions** и запустить **Actions → Deploy portfolio to GitHub Pages → Run workflow**.
7. Дождаться успешной публикации. Ссылка появится в **Settings → Pages**. Проверить главную, все страницы, EN/RU и форму по этой ссылке.

Не присылать пароль или токен в чат. Для совместной настройки достаточно ссылки репозитория; подключение GitHub может потребовать отдельно разрешить доступ.

## Проверки

Синтаксис JavaScript проверен командой `node --check`. Подробные результаты текущей проверки интерфейса находятся в `QA.md`, если файл включён в поставку.
