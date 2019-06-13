# firebase-vk-telegram-post-bot
Бот для Firebase functions. Репостит посты из группы VK в канал Telegram.
Главное его преимущество - бесплатное использование на Firebase functions.

## Установка
```
npm install

mv functions/config/_index.js functions/config/index.js && mv functions/config/_serviceAccountKey.json functions/config/serviceAccountKey.json
```
- Создать закрытый ключ для сервисного аккаунта в проекте Firebase и заменить файл functions/config/serviceAccountKey.json на скаченный json файл
- Заполнить functions/config/index.js своими данными
- В проекте Firebase сменить тарифный план на Blaze(Оплата по мере использования)
```
firebase list
firebase use [название вашего проекта]
firebase deploy --only functions
```
