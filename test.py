import json
import requests
import playsound
res = requests.get("https://jsonplaceholder.typicode.com/todos") # получаем объект с ссылки
obj = json.loads(res.text) # преобразуем в объект (массив) python
print(obj[0]) # выводим первый элемент
playsound.playsound('./static\sounds\sfx1.mp3') #проигрываем звук
