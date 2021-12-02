import os
import json
import schedule
import threading
import time
import socketio  # python-socketio
import playsound
from aiohttp import web

path_to_static = "../front/dist/"

sio = socketio.AsyncServer(cors_allowed_origins="*")
app = web.Application()
sio.attach(app)
routes = web.RouteTableDef()

global day_id, lessons, settings, todays_lessons

lessons = []
todays_lessons = []
day_id = 0
setting = {}


# ------------------ server

@routes.get("/")
async def index(request) -> web.Response:
    """Serve the client-side application."""
    with open(path_to_static + 'index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')


@routes.get('/get_lessons')
async def get_lessons(request):
    global lessons
    return web.json_response(lessons)


@routes.post('/write_lessons')
async def write_lessons(request: web.Request) -> web.Response:
    global lessons, todays_lessons, day_id
    data = await request.json()
    lessons = data
    todays_lessons = list(filter(lambda lesson: lesson['id'] == day_id, lessons))
    open('./lessons.json', 'w').write(json.dumps(data))
    return web.Response()


@routes.get('/get_settings')
async def get_settings(request: web.Request) -> web.Response:
    global settings
    return web.Response(body=json.dumps(settings))


@routes.post('/write_settings')
async def write_settings(request: web.Request) -> web.Response:
    global settings
    settings = await request.json()
    print(settings)
    open('./settings.json', 'w').write(json.dumps(settings))
    return web.Response()


@routes.get('/fetch_file_list')
async def fetch_file_list(request: web.Request) -> web.Response:
    file_list = os.listdir('./sounds')
    return web.Response(body=json.dumps(file_list))


@routes.post('/write_file')
async def store_mp3_handler(request: web.Request):
    reader = await request.multipart()
    field = await reader.next()
    filename = field.filename
    size = 0
    with open(os.path.join('./sounds', filename + '.mp3'), 'wb') as f:
        while True:
            chunk = await field.read_chunk()
            if not chunk:
                break
            size += len(chunk)
            f.write(chunk)
    return web.Response(text='{} sized of {} successfully stored'
                             ''.format(filename, size))


routes.static('/static', path_to_static)
app.add_routes(routes)


@sio.event
async def connect(sid, environ, auth):
    global lessons
    print("connected", sid)
    await sio.emit('lessons', lessons)


@sio.event
def disconnect(sid):
    print("disconnected", sid)

# -----------------------

# ----------------------- bells


def read_lessons():
    global lessons, todays_lessons
    raw_lessons = open("./lessons.json", "r").read()  # получаем конфиг
    lessons = json.loads(raw_lessons)
    todays_lessons = list(filter(lambda lesson: lesson['id'] == day_id, lessons))


def read_settings():
    global settings
    raw_settings = open('./settings.json', 'r').read()
    settings = json.loads(raw_settings)


def update_day_id():
    global day_id
    day_id = int(time.strftime("%w"))


update_day_id()
read_lessons()
read_settings()


# TODO: optimize check function
def check():
    global todays_lessons, day_id
    if 0 < day_id <= 7:
        # текущее время
        h = str(time.strftime("%H"))
        m = str(time.strftime("%M"))
        for t in todays_lessons:
            if t['timeStart'] == h + ":" + m and t['dayOfWeek'] == day_id:
                playsound.playsound(
                    f'./sounds/{settings["lessonStartSound"]}')
                time.sleep(60)
            elif t['timeEnd'] == h + ":" + m:  # проверка на перемену
                playsound.playsound(f'./sounds/{settings["lessonEndSound"]}')
                time.sleep(60)


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


def run_threaded(job_func):
    job_thread = threading.Thread(target=job_func)
    job_thread.start()


# Start the background thread
stop_run_continuously = run_continuously()
schedule.every(1).seconds.do(check)
schedule.every(1).hours.do(update_day_id)
run_threaded(web.run_app(app, port=4000))
