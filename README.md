# firebase-vk-telegram-post-bot

Бот для Firebase functions. Репостит посты из группы VK в канал Telegram.
Главное его преимущество - бесплатное использование на Firebase functions.

## Установка

```
npm run install
```

- В настройках проекта Firebase создать закрытый ключ для сервисного аккаунта и заменить файл functions/config/serviceAccountKey.json на скаченный json файл
- Добавить в functions/config/index.js в массив `bots` названия ботов
- В проекте Firebase на сайте сменить тарифный план на Blaze(Оплата по мере использования)

```
npm install -g firebase-tools // if Firebase CLI is not installed
firebase login // if Firebase CLI is not installed
firebase projects:list
firebase use [Project ID]
firebase deploy --only functions
```

- Создать коллекцию `bots` в Firebase Firestore. В нее добавлять необходимых ботов. Все добавляемые ID должны быть Number.![Пример с необходимыми полями](/example.jpg)
- В настройках группы ВК перейти на страницу Работа с API
- Перейти во вкладку Callback API
- Заполнить адрес, который можно найти в проекте Firebase в functions после деплоя функций
- Нажать подтвердить. Если неудачно, то проверить все ли конфиги заполнены и функции задеплоены
- Во вкладе Типы событий выделить Записи на стене - Добавление

Дополнительные возможности бота при добавлении параметров бота в конфиге(в firestore):

- Репост только от определенных авторов - массив `allowedAuthors` с ID авторов(Number)
- Репост только если есть разрешенный тег - массив `postTags`
- Запрещающие теги - массив `deniedTags`
