import requests

r = requests.get('http://img.wantuole.com/resources/backgrouds/VIP2.png')

print(r.content)