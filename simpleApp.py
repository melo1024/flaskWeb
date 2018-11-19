# -*- coding:utf-8 -*-
from flask import Flask, render_template

"""Flask app"""
app = Flask(__name__)

@app.route('/fifamobile')
def fifa_mobile():
    return render_template("players.html")

@app.route('/test')
def test():
    return 'ok'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)