# schoolBell

discription

# Установка

1. Установить node.js
2. После установки из репозитория в консоле прописать npm i для установки необходимых модулей
3. Установить любой CLI-player
4. Установить Python последней версии с pip
5. Через консоль набрать pip install "название библиотеки" для следующих библиотек: playsound, requests

# Использование

1. В папку /static/sound/ загрузить мелодии в формате .mp3
2. В консоле (открыта папка репозитория) прописать npm start
3. Со стороны клиента запустить test.py (Сервер и компьютер должны быть подключены к одной локальной сети)

# SQLite

Создание таблицы
CREATE TABLE days (id INTEGER PRIMARY KEY AUTOINCREMENT, dayOfWeek INTEGER, isEnabled INTEGER);
CREATE TABLE bells (id integer primary key autoincrement, timeStart time, timeEnd time);
