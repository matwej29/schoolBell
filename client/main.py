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


global id, lessons

lessons = []  # список со звонками за 1 день
id = 0  # номер дня (варьируется с 0 до 7)

# ------------------ socket-io


@routes.get('/')
async def index(req):
    """Serve the client-side application."""
    with open(path_to_static+'index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')


@routes.get('/get_lessons')
async def get_lessons(req):
    global lessons
    return web.json_response(lessons)

@routes.post('/write_lessons')
async def write_lessons(request: web.Request) -> web.Response:
    data = await request.json()
    print(data)
    update_lessons(data)
    return web.Response()

routes.static('/static', path_to_static)
app.add_routes(routes)

def update_lessons(new_lessons):
    global lessons
    lessons = new_lessons
    open('./lessons.json', 'w').write(json.dumps(new_lessons))


# @sio.on('get_lessons')
# async def lessons():
#     await sio.emit('lessons', lessons)


# @sio.on('write_lessons')
# def write_lessons(data):
#     global lessons
#     lessons = json.loads(data)
#     write_file(lessons)


# @sio.event
# def error(err):
#     print(err)


# @sio.event
# async def connect(sid, environ, auth):
#     global lessons
#     print("connected", sid)
#     await sio.emit('lessons', lessons)


# @sio.event
# def disconnect(sid):
#     print("disconnected", sid)

# -----------------------

# ----------------------- bells


def get_lessons():
    global lessons
    row_lessons = open("./lessons.json", "r").read()  # получаем конфиг
    lessons = json.loads(row_lessons)
    # print(lessons)


get_lessons()

# функция сверяет время с началом или концом урока и дает соответствующий звонок (звонки)


def check():
    global lessons, id
    id = int(time.strftime("%w"))
    if 0 < id <= 7:
        # текущее время
        h = str(time.strftime("%H"))
        m = str(time.strftime("%M"))
        for t in lessons:
            if t['timeStart'] == h + ":" + m and t['dayOfWeek'] == id:  # проверка на начало урока
                playsound.playsound(
                    "./sounds/sfx1.mp3")
                time.sleep(60)
            elif t['timeEnd'] == h + ":" + m:  # проверка на перемену
                playsound.playsound("./sounds/sfx2.mp3")
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
run_threaded(web.run_app(app))
