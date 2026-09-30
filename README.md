# Task Message Max

Локальный запуск приложения состоит из двух процессов:
- клиентский фронтенд: Vite dev server
- серверный API: Express server

## Установка зависимостей

```bash
npm install
```

## Запуск сервера

В отдельном терминале:

```bash
npm run server
```

Сервер запускается на порту `3000`.

## Запуск клиента

Во втором терминале:

```bash
npm run dev
```

Клиент запускается на `http://localhost:5173`.

## Как это работает

- Vite dev server отвечает за frontend (`npm run dev`)
- Express сервер отвечает за API (`npm run server`)
- В `vite.config.ts` настроен proxy для `/api` на `http://localhost:3000`

## Переменные окружения

Для работы сервера нужен `SESSION_SECRET`.

Можно задать локально в терминале перед запуском:

```bash
SESSION_SECRET=your-secret-key npm run server
```

Или создать файл `.env`:

```env
SESSION_SECRET=your-secret-key
```

## Полный цикл запуска

1. Установить зависимости:
   ```bash
   npm install
   ```
2. Запустить сервер:
   ```bash
   npm run server
   ```
3. Запустить клиент:
   ```bash
   npm run dev
   ```
4. Открыть в браузере:
   ```text
   http://localhost:5173
   ```

## Сборка проекта

```bash
npm run build
```

## Продакшн запуск

После сборки приложение можно запустить как один сервер:

```bash
npm start
```
