# Description

description - todo

# Установка

1. Установить node.js
2. После установки из репозитория в папке `back` в консоле прописать `npm i` для установки необходимых модулей
3. Аналогично в папке `front`
4. Установить Python последней версии (3.9) с pip
5. Через консоль набрать `pip install playsound, requests, schedule` для установки библиотек для python

# Использование

1. В папку /client/sound/ загрузить мелодии в формате .mp3 (в том случае, если они их там нет или нужны другие мелодии), с названием "sfx1.mp3" и "sfx2.mp3" для звонка на урок и перемену соответственно
2. В папке `client` отредактировать `config.json`
3. В папке `front/src` отредактировать `config.json`
4. В консоле (открыта папка `back`) прописать `npm start` для запуска backend`а
5. В консоле (открыта папка `front`) прописать `npm start` для запуска frontend`a
6. На компьютере, подключенном к звонкам, запустить python скрипт

# Building
1. В консоле `npm run build` (папка front)
Папку build необходимо отсылать, можно использовать nginx для этого или любой другой веб-сервер
2. В консоле `node index.js` (папка back)
3. На компьютере, подключенном к звонкам, запустить python скрипт