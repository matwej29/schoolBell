# import os
# import sys

# _PATH = '/__pypackages__/'

# sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)) + _PATH)
import json
import requests
import socketio
sio = socketio.Client()

global ip, port, lessons
lessons = []

def getConfig():
    global ip, port
    conf = open("./config.json", "r").read()  # получаем конфиг
    connection_config = json.loads(conf)  # преобразуем в объект python
    ip = connection_config["ip"]
    port = connection_config["port"]

def write_file(obj):
    open('./lessons.json', 'w').write(json.dumps(obj))
    print(obj)

def connect():
    global ip, port
    url = f"http://{ip}:{port}"
    sio.connect(url)
    print('connected')

def get_lessons():
    global lessons
    res = requests.get(f"http://{ip}:{port}/days")  # получаем объект с ссылки
    lessons = json.loads(res.text)  # преобразуем в объект (массив) python
    write_file(lessons)

@sio.on('message')
def write_lessons(data):
    global lessons
    lessons = json.loads(data)
    write_file(lessons)

@sio.event
def error(err):
    print(err)

getConfig()
connect()
get_lessons()

sio.wait()
