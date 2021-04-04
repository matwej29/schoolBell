import json
import schedule
import requests
import time
import playsound
import threading
global id, enable, lessons
lessons = []
id = 0

def response():
    q = 1
    dayOfWeek = int(time.strftime("%w"))
    global id, lessons, enable
    if 0<dayOfWeek<6:
        res = requests.get(f"http://localhost:3000/test?id={dayOfWeek}") # получаем объект с ссылки
        obj = json.loads(res.text) # преобразуем в объект (массив) python
        id = dayOfWeek
        enable = bool(obj["enabled"])
        lessons = []
        for t in obj["lessons"]:
            q = list(t.split())
            lessons.append(q)
    else:
        id = 0


def check():
    q = 1
    if 0<id<6:
        if enable:
            m = str(time.strftime("%M"))
            h = str(time.strftime("%H"))
            for t in lessons:
                if t[0] == h+':'+m:
                    playsound.playsound('./static/sounds/sfx1.mp3')
                    print('bell')
                    time.sleep(15)
                    playsound.playsound('./static/sounds/sfx1.mp3')
                    time.sleep(45)

                elif t[1] == h+':'+m:
                    playsound.playsound('./static/sounds/sfx2.mp3')
                    print('bell')
                    time.sleep(60)

schedule.every(1).minutes.do(response)
schedule.every(1).seconds.do(check)

while True:
    schedule.run_pending()