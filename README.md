# firebase-vk-telegram-post-bot
Бот для Firebase functions. Репостит посты из группы VK в канал Telegram.

## Установка
```
npm install

mv functions/config/_index.js functions/config/index.js && mv functions/config/_serviceAccountKey.json functions/config/serviceAccountKey.json
```
- Создать закрытый ключ для сервисного аккаунта в проекте Firebase и заменить файл functions/config/serviceAccountKey.json на скаченный json файл
- Заполнить functions/config/index.js своими данными
```
firebase deploy --only functions
```
