# -*- coding:utf-8 -*-
""" 本地测试url
初始化：
http://127.0.0.1:5000/es/init?min_score=94&max_score=94&split_score=76
统计信息：
http://127.0.0.1:5000/all/count
球员数量统计：
http://127.0.0.1:5000/player/count
国家列表：
http://127.0.0.1:5000/nation/list
联赛列表：
http://127.0.0.1:5000/league/list
俱乐部列表：
http://127.0.0.1:5000/club/list?leagueName=美国足球职业大联盟
天赋列表：
http://127.0.0.1:5000/skill/list
活动列表：
http://127.0.0.1:5000/program/list
天赋等级提升（扑救大师）：
http://127.0.0.1:5000/skill/updata?code=5581e0a0-00d1-11e8-9a00-8105ee8c8a87
位置等级提升：
http://127.0.0.1:5000/job/updata?code=ST
青云对象存储：
http://127.0.0.1:5000/file

网站首页：
http://127.0.0.1:5000/fifamobile
"""
from flask import Flask, Response, send_file, send_from_directory, make_response
from flask import request, render_template
import esHandler
import qingstorHandler
from io import BytesIO
import tempfile
import os

"""Flask app"""
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/fifamobile')
def fifa_mobile():
    return render_template("players.html")

@app.route('/file')
def return_file():
    key = request.args.get('key')
    r = qingstorHandler.getRespByKey(key)
    b = bytes()
    for chunk in r.iter_content():
        b = b + chunk
    response = make_response(b)
    response.headers["Content-Disposition"] = "attachment; filename={}".format(key)
    return response


@app.route('/es/init', methods=['get'])
def init_es():
    min_score = request.args.get('min_score')
    max_score = request.args.get('max_score')
    split_score = request.args.get('split_score')
    if min_score is None or max_score is None or split_score is None:
        return 'Invalid request, pls check the url.'
    if min_score.isdigit() and max_score.isdigit() and split_score.isdigit():
        # # 初始化国家
        # esHandler.initNationIndex()
        # # 初始化联赛/俱乐部
        # esHandler.initLeagueAndClubIndex()
        # # 初始化天赋
        # esHandler.initSkillIndex()
        # # 初始化活动
        # esHandler.initProgramIndex()
        # # 初始化位置等级提升
        # esHandler.initJobLevelCapabilityIndex()
        # 初始化球员
        esHandler.initPlayerIndex(int(min_score), int(max_score), int(split_score))
        return 'ES init complete!'
    else:
        return 'Param type error.'


@app.route('/all/count', methods=['get'])
def countAll():
    return esHandler.countAll()

@app.route('/player/count', methods=['get'])
def count():
    return esHandler.countPlayers()

@app.route('/player/list', methods=['get'])
def searchPlayer():
    print(request.args)
    min_score = request.args.get('min_score')
    max_score = request.args.get('max_score')
    name = request.args.get('name')
    nation = request.args.get('nation')
    league = request.args.get('league')
    club = request.args.get('club')
    job = request.args.get('job')
    skill = request.args.get('skill')
    #活动，比如黄金周/七夕
    program = request.args.get('program')

    result = esHandler.searchPlayers(min_score, max_score, name, nation, league, club, job, skill, program)
    return result

@app.route('/nation/list', methods=['get'])
def searchNation():
    result = esHandler.searchNation()
    return result

@app.route('/league/list', methods=['get'])
def searchLeague():
    result = esHandler.searchLeague()
    return result

@app.route('/club/list', methods=['get'])
def searchClub():
    leagueName = request.args.get('leagueName')
    result = esHandler.searchClub(leagueName)
    return result

@app.route('/skill/list', methods=['get'])
def searchSkill():
    result = esHandler.searchSkill()
    return result

@app.route('/program/list', methods=['get'])
def searchProgram():
    result = esHandler.searchProgram()
    return result

@app.route('/job/updata', methods=['get'])
def searchJobLevelCapability():
    job = request.args.get('code')
    result = esHandler.searchJobLevelCapability(job)
    return result

@app.route('/skill/updata', methods=['get'])
def searchSkillLevelCapability():
    skill = request.args.get('code')
    result = esHandler.searchSkillLevelCapability(skill)
    return result

if __name__ == '__main__':
    app.run()
