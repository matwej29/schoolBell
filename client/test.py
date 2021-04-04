import json
import schedule
import requests
import time
import playsound
global id, lessons
lessons = []
id = 0

def response():
    global id, lessons
    id = int(time.strftime("%w"))
    if id == 0:
        id = 7
    if 0<id<8:
        res = requests.get(f"http://localhost:3000/day?dayOfWeek={id}") # получаем объект с ссылки
        obj = json.loads(res.text) # преобразуем в объект (массив) python
        lessons.clear()
        for t in obj:
            start = str(t["timeStart"])
            end = str(t["timeEnd"])
            lessons.append([start,end])
    else:
        id = 0


def check():
    if 0<id<8:
        m = str(time.strftime("%M"))
        h = str(time.strftime("%H"))
        if m == '9':
            response()
        for t in lessons:
            if t[0] == h+':'+m:
                playsound.playsound('./client/sounds/sfx1.mp3')
                time.sleep(15)
                playsound.playsound('./client/sounds/sfx1.mp3')
                time.sleep(45)
            elif t[1] == h+':'+m:
                playsound.playsound('./client/sounds/sfx2.mp3')
                time.sleep(60)

response()
schedule.every(1).seconds.do(check)

while True:
    schedule.run_pending()