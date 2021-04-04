# schoolBell

discription

# Установка

1. Установить node.js
2. После установки из репозитория в консоле прописать npm i для установки необходимых модулей

# Использование

1. В папку /static/sound/ загрузить мелодии в формате .mp3
2. В консоле (открыта папка репозитория) прописать npm start

# SQLite

Создание таблицы
CREATE TABLE days (id INTEGER PRIMARY KEY AUTOINCREMENT, dayOfWeek INTEGER, isEnabled INTEGER);
CREATE TABLE bells (id integer primary key autoincrement, timeStart time, timeEnd time);
