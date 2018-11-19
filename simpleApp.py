# -*- coding:utf-8 -*-
from flask import Flask, render_template

"""Flask app"""
app = Flask(__name__)

@app.route('/fifamobile')
def fifa_mobile():
    return render_template("players.html")

if __name__ == '__main__':
    app.run()