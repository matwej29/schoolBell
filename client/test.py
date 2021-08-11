import os
import sys

_PATH = '/__pypackages__/'

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)) + _PATH)
import json
import schedule
import requests
import time
import playsound
import socketio

sio = socketio.Client()

global id, lessons, ip, port

lessons = []  # список со звонками за 1 день
id = 0  # номер дня (варьируется с 0 до 7)

def getConfig():
    global ip, port
    conf = open("./config.json", "r").read()  # получаем конфиг
    connection_config = json.loads(conf)  # преобразуем в объект python
    ip = connection_config["ip"]
    port = connection_config["port"]

def connect():
    global ip, port
    uri = f"http://{ip}:{port}"
    print(uri)
    sio.connect(uri)

@sio.on('message')
def write_lessons(data):
    global lessons
    #obj = json.loads(data)  # преобразуем в объект (массив) python
    lessons.clear()  # очищаем массив
    for t in data:  # добавляем в массив данные об уроке в виде [начало, конец]
        start = str(t["timeStart"])
        end = str(t["timeEnd"])
        lessons.append([start, end])

@sio.event
def error(err):
    print(err)

def response():
    global id, lessons
    id = int(time.strftime("%w"))  # переприсваиваем id
    if id == 0:  # если воскресенье, то у python - 0
        id = 7  # а у базы данных - 7
    if 0 < id < 8:  # проверка дня недели, нет смысла выполнять скрипт по воскресеньям
        res = requests.get(f"http://{ip}:{port}/day?dayOfWeek={id}")  # получаем объект с ссылки
        obj = json.loads(res.text)  # преобразуем в объект (массив) python
        lessons.clear()  # очищаем массив
        for t in obj:  # добавляем в массив данные об уроке в виде [начало, конец]
            start = str(t["timeStart"])
            end = str(t["timeEnd"])
            lessons.append([start, end])


# функция сверяет время с началом или концом урока и дает соответствующий звонок (звонки)
def check():
    if 0 < id < 8:  # проверка дня недели, нет смысла выполнять скрипт по воскресеньям
        m = str(time.strftime("%M"))  # получаем минуты [0-59]
        h = str(time.strftime("%H"))  # получем часы [0-23]
        #if m[-1] == "9":  # если минуты оканчиваются на 9,
        #    response()  # то делается обновление расписания (в итоге - раз в 10 минут)
        for t in lessons:
            if t[0] == h + ":" + m:  # проверка на начало урока
                playsound.playsound("./client/sounds/sfx1.mp3")  # первый звонок
                time.sleep(30)  # ожидаем 15 секунд
                playsound.playsound("./client/sounds/sfx1.mp3")  # второй звонок
                time.sleep(30)  # ожидаем еще 45 секунд, иначе звонки повторяться (нужно, чтобы время перешло на след. минуту)
            elif t[1] == h + ":" + m:  # проверка на перемену
                playsound.playsound("./sounds/sfx2.mp3")  # звонок и ожидание 60 секунд
                time.sleep(60)

getConfig()
# response()  # получение расписания сразу после запуска
connect()

schedule.every(1).seconds.do(check)  # делаем функцию check каждую секунду

# while True:
#     schedule.run_pending()  # непрерываемая функция
