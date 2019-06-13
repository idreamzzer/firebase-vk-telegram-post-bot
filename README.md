# firebase-vk-telegram-post-bot
Бот для Firebase functions. Репостит посты из группы VK в канал Telegram.
Главное его преимущество - бесплатное использование на Firebase functions.
Бот репостит по тегам, указанным в конфигах(по-умолчанию: ```&#13;``` и ```\r```)

## Установка
```
npm run install
```
- Создать закрытый ключ для сервисного аккаунта в проекте Firebase и заменить файл functions/config/serviceAccountKey.json на скаченный json файл
- Заполнить functions/config/index.js своими данными
- В проекте Firebase сменить тарифный план на Blaze(Оплата по мере использования)
```
firebase list
firebase use [название вашего проекта]
firebase deploy --only functions
```
