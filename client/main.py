import json
import schedule
import threading
import time
import socketio # python-socketio
import playsound
# import asyncio
from aiohttp import web

path_to_static="../front/build/"

sio = socketio.AsyncServer(cors_allowed_origins="*")
app = web.Application()
sio.attach(app)

global id, lessons

lessons = []  # список со звонками за 1 день
id = 0  # номер дня (варьируется с 0 до 7)


def run_threaded(job_func):
    job_thread = threading.Thread(target=job_func)
    job_thread.start()

# ------------------ socket-io
async def index(request):
    """Serve the client-side application."""
    with open(path_to_static+'index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')

def getConfig():
    global ip, port
    conf = open("./config.json", "r").read()  # получаем конфиг
    connection_config = json.loads(conf)  # преобразуем в объект python
    ip = connection_config["ip"]
    port = connection_config["port"]

def write_file(obj):
    open('./lessons.json', 'w').write(json.dumps(obj))
    print(obj)

@sio.on('get_lessons')
async def lessons():
    await sio.emit('lessons', lessons)

@sio.on('write_lessons')
def write_lessons(data):
    global lessons
    lessons = json.loads(data)
    write_file(lessons)

@sio.event
def error(err):
    print(err)

@sio.event
async def connect(sid, environ, auth):
    global lessons
    print("connected", sid)
    await sio.emit('lessons', lessons)

app.router.add_static('/static', path=path_to_static)
app.router.add_get('', index)
# -----------------------

# ----------------------- bells

def get_lessons():
    global lessons
    row_lessons = open("./lessons.json", "r").read()  # получаем конфиг
    lessons = json.loads(row_lessons)
    print(lessons)

# функция сверяет время с началом или концом урока и дает соответствующий звонок (звонки)

def check():
    if 0 < id <= 6:  # проверка дня недели, нет смысла выполнять скрипт по воскресеньям
        h = str(time.strftime("%H"))  # получем часы [0-23]
        m = str(time.strftime("%M"))  # получаем минуты [0-59]
        for t in lessons[id]:
            if t[0] == h + ":" + m:  # проверка на начало урока
                playsound.playsound(
                    "./sounds/sfx1.mp3")  # первый звонок
                time.sleep(60)
            elif t[1] == h + ":" + m:  # проверка на перемену
                # звонок и ожидание 60 секунд
                playsound.playsound("./sounds/sfx2.mp3")
                time.sleep(60)


get_lessons()

def run_continuously(interval=1):
    cease_continuous_run = threading.Event()

    class ScheduleThread(threading.Thread):
        @classmethod
        def run(cls):
            while not cease_continuous_run.is_set():
                schedule.run_pending()
                time.sleep(interval)

    continuous_thread = ScheduleThread()
    continuous_thread.start()
    return cease_continuous_run

# Start the background thread
stop_run_continuously = run_continuously()
schedule.every(1).seconds.do(check)
run_threaded(web.run_app(app))