# -*- coding: utf-8 -*-
import requests
import json
from elasticsearch import Elasticsearch

"""球员列表url"""
base_list_url = 'http://api.wantuole.com/api/fifa/list2?1=1&mi=%d&ma=%d'
base_list_url_with_job = 'http://api.wantuole.com/api/fifa/list2?1=1&j=%s&mi=%d&ma=%d'
"""国家列表url"""
nation_list_url = 'http://api.wantuole.com/api/nation/list'
"""联赛列表url"""
league_list_url = 'http://api.wantuole.com/api/league/list'
"""俱乐部列表url"""
club_list_url = 'http://api.wantuole.com/api/club/list?lcode='
"""天赋列表url"""
skill_list_url = 'http://api.wantuole.com/api/skill/list?gameCode=fifamobile'
"""天赋等级提升（单位：百分比）url"""
skill_level_capability_url = 'http://api.wantuole.com/api/levelup/list?gameCode=fifamobile&type=2&level=0&code='
"""位置等级提升url"""
job_level_capability_url = 'http://api.wantuole.com/api/levelup/list?gameCode=fifamobile&type=1&level=60&code='
"""活动列表url"""
program_list_url = 'http://api.wantuole.com/api/program/list?gameCode=fifamobile'
"""球员位置: 前锋 左边锋 右边锋 左内锋 中锋 右内锋 前腰 左前卫 中前卫 右前卫 后腰 左翼卫 左后卫 中后卫 右后卫 右翼卫 门将"""
job_list = ["ST", "LW", "RW", "LF", "CF", "RF", "CAM", "LM", "CM", "RM", "CDM", "LWB", "LB", "CB", "RB", "RWB", "GK"]
"""es连接"""
#TODO 设置最大连接数
es = Elasticsearch(['http://127.0.0.1:9200'])
"""球员索引"""
fifa_player_index = "fifa-player-index"
"""球员type"""
fifa_player_type = "fifa-player-type"
"""国家索引"""
fifa_nation_index = "fifa-nation-index"
"""国家type"""
fifa_nation_type = "fifa-nation-type"
"""联赛索引"""
fifa_league_index = "fifa-league-index"
"""联赛type"""
fifa_league_type = "fifa-league-type"
"""俱乐部索引"""
fifa_club_index = "fifa-club-index"
"""俱乐部type"""
fifa_club_type = "fifa-club-type"
"""天赋索引"""
fifa_skill_index = "fifa-skill-index"
"""天赋type"""
fifa_skill_type = "fifa-skill-type"
"""活动索引"""
fifa_program_index = "fifa-program-index"
"""活动type"""
fifa_program_type = "fifa-program-type"
"""天赋等级提升索引"""
fifa_skill_level_capability_index = 'fifa_skill_level_capability_index'
"""天赋等级提升type"""
fifa_skill_level_capability_type = 'fifa_skill_level_capability_type'
"""位置等级提升索引"""
fifa_job_level_capability_index = 'fifa_job_level_capability_index'
"""位置等级提升type"""
fifa_job_level_capability_type = 'fifa_job_level_capability_type'
"""默认取回200条数据"""
default_search_body = {"from": 0, "size": 200}

"""
从玩脱了爬取球员数据
"""
def downloadPlayersByURL(url):
    resp = requests.get(url)
    data = json.loads(resp.text)
    num = len(data['data'])
    print(url, ' ===》 数量：', num)
    p = {}
    for player in data['data']:
        setValue(p, player, 'code', 'code', None)
        setValue(p, player, 'name', 'name', None)
        setValue(p, player, 'rarityValue', 'rarityValue', None)
        setValue(p, player, 'rarity', 'rarity', None)
        """basicInfo"""
        setValue(p, player, 'no', 'basicInfo', 'no')
        setValue(p, player, 'enname', 'basicInfo', 'enname')
        setValue(p, player, 'score', 'basicInfo', 'score')
        setValue(p, player, 'jobCode', 'basicInfo', 'jobCode')
        setValue(p, player, 'job', 'basicInfo', 'job')
        p['nation'] = player['basicInfo']['nationInfo']['name']
        p['league'] = player['basicInfo']['leagueInfo']['name']
        p['club'] = player['basicInfo']['clubInfo']['name']
        p['program'] = player['basicInfo']['programInfo']['name']
        setValue(p, player, 'bg', 'basicInfo', 'bg')
        setValue(p, player, 'programicon', 'basicInfo', 'programicon')
        setValue(p, player, 'head', 'basicInfo', 'head')
        setValue(p, player, 'headcount', 'basicInfo', 'headcount')
        setValue(p, player, 'headcalcscore', 'basicInfo', 'headcalcscore')
        setValue(p, player, 'havaas', 'basicInfo', 'havaas')
        setValue(p, player, 'height', 'basicInfo', 'height')
        setValue(p, player, 'foot', 'basicInfo', 'foot')
        setValue(p, player, 'basicdownstatus', 'basicInfo', 'basicdownstatus')
        setValue(p, player, 'traits', 'basicInfo', 'traits')
        setValue(p, player, 'downstatus', 'basicInfo', 'downstatus')
        """capabilityValues"""
        setValue(p, player, 'capabilityValues', 'capabilityValues', 'extend')
        """skills"""
        setValue(p, player, 'skill_code', 'skills', 'code')
        setValue(p, player, 'skill_name', 'skills', 'name')

        print(p)
        #存入es
        es.index(index=fifa_player_index, doc_type=fifa_player_type, id=p['code'], body=p)
        player['basicInfo']['nationInfo']['name']
        background_pic_filename = getBackground(player['basicInfo']['programInfo']['name'], player['rarityValue'], player['basicInfo']['score'],
                                       player['basicInfo']['programInfo']['havebackground'],player['basicInfo']['bg'])
        background_url = getBackgroundURL(player['basicInfo']['programInfo']['name'], background_pic_filename)
        head_pic_filename = getHead(player['basicInfo']['programInfo']['name'], player['basicInfo']['no'], player['basicInfo']['score'],
                                 player['basicInfo']['headcalcscore'], player['basicInfo']['head'],
                                 player['basicInfo']['headcount'], player['basicInfo']['havaas'])
        head_url = getHeadURL(player['basicInfo']['programInfo']['name'], head_pic_filename)
        print('背景：', background_pic_filename, ' -> ', background_url)
        print('头像：', head_pic_filename, ' -> ', head_url)


def setValue(p1, p2, p1_colume, p2_colume1, p2_colume2):
    if p2_colume2 is None:
        p1[p1_colume] = p2[p2_colume1]
    elif p2_colume2 in p2[p2_colume1]:
        p1[p1_colume] = p2[p2_colume1][p2_colume2]
    else:
        p1[p1_colume] = None


"""
初始化球员索引
"""
def initPlayerIndex(min_score, max_score, split_score):
    # 删除原有索引
    es.indices.delete(index=fifa_player_index, ignore=[400, 404])
    # 重新创建索引
    es.indices.create(index=fifa_player_index, ignore=400)
    # 启用fielddata，关闭analyzed
    body = {
        "properties": {
            "score": {
                "type": "text",
                "fielddata": True
            }, "nation": {
                "type": "keyword"
            }, "league": {
                "type": "keyword"
            }, "club": {
                "type": "keyword"
            }, "job": {
                "type": "keyword"
            }, "skill": {
                "type": "keyword"
            }, "program": {
                "type": "keyword"
            }
        }
    }
    es.indices.put_mapping(index=fifa_player_index, doc_type=fifa_player_type, body=body)
    # 抓取球员数据
    downloadPlayers(min_score, max_score, split_score)


"""
爬取球员数据
"""
def downloadPlayers(min_score, max_score, split_score):
    i = max_score
    while i >= min_score:
        if i > split_score:
            downloadPlayersByURL(base_list_url%(i,i))
        else:
            for job in job_list:
                downloadPlayersByURL(base_list_url_with_job % (job, i, i))
        i = i-1

"""
初始化国家索引
"""
def initNationIndex():
    # 删除原有索引
    es.indices.delete(index=fifa_nation_index, ignore=[400, 404])
    # 重新创建索引
    es.indices.create(index=fifa_nation_index, ignore=400)
    # 爬取国家列表
    print(nation_list_url)
    resp = requests.get(nation_list_url)
    data = json.loads(resp.text)
    print(data)
    n = {}
    for nation in data['data']:
        setValue(n, nation, 'code', 'code', None)
        setValue(n, nation, 'icon', 'icon', None)
        setValue(n, nation, 'chname', 'chname', None)
        setValue(n, nation, 'enname', 'enname', None)
        print(n)
        es.index(index=fifa_nation_index, doc_type=fifa_nation_type, id=n['code'], body=n)


"""
search国家
"""
def searchNation():
    resp = es.search(index=fifa_nation_index, doc_type=fifa_nation_type, body=default_search_body)
    data = tranferDictWithUTF8(resp["hits"])
    print(data)
    return data


"""
初始化联赛/俱乐部索引
"""
def initLeagueAndClubIndex():
    # 删除原有索引
    es.indices.delete(index=fifa_league_index, ignore=[400, 404])
    es.indices.delete(index=fifa_club_index, ignore=[400, 404])
    # 重新创建索引
    es.indices.create(index=fifa_league_index, ignore=400)
    es.indices.create(index=fifa_club_index, ignore=400)
    # 关闭俱乐部analyzed，以便可以按照联赛全匹配
    body = {
        "properties": {
            "leagueName": {
                "type": "keyword"
            }
        }
    }
    es.indices.put_mapping(index=fifa_club_index, doc_type=fifa_club_type, body=body)
    # 爬取联赛列表
    print(league_list_url)
    resp = requests.get(league_list_url)
    data = json.loads(resp.text)
    print(data)
    n = {}
    for league in data['data']:
        setValue(n, league, 'code', 'code', None)
        setValue(n, league, 'icon', 'icon', None)
        setValue(n, league, 'chname', 'chname', None)
        setValue(n, league, 'enname', 'enname', None)
        print(n)
        es.index(index=fifa_league_index, doc_type=fifa_league_type, id=n['code'], body=n)
        # 爬取俱乐部列表
        print(club_list_url)
        resp2 = requests.get(club_list_url + n['code'])
        data2 = json.loads(resp2.text)
        print(data2)
        c = {'leagueName': n['chname']}
        for club in data2['data']:
            setValue(c, club, 'code', 'code', None)
            setValue(c, club, 'icon', 'icon', None)
            setValue(c, club, 'chname', 'chname', None)
            setValue(c, club, 'enname', 'enname', None)
            print(c)
            es.index(index=fifa_club_index, doc_type=fifa_club_type, id=c['code'], body=c)


"""
search联赛
"""
def searchLeague():
    resp = es.search(index=fifa_league_index, doc_type=fifa_league_type, body=default_search_body)
    data = tranferDictWithUTF8(resp["hits"])
    print(data)
    return data


"""
search俱乐部
"""
def searchClub(leagueName):
    body = {"from": 0, "size":500}
    if leagueName is not None:
        body['query'] = {'term': {'leagueName': leagueName}}
    resp = es.search(index=fifa_club_index, doc_type=fifa_club_type, body=body)
    data = tranferDictWithUTF8(resp["hits"])
    print(data)
    return data


"""
初始化天赋索引
"""
def initSkillIndex():
    # 删除原有索引
    es.indices.delete(index=fifa_skill_index, ignore=[400, 404])
    es.indices.delete(index=fifa_skill_level_capability_index, ignore=[400, 404])
    # 重新创建索引
    es.indices.create(index=fifa_skill_index, ignore=400)
    es.indices.create(index=fifa_skill_level_capability_index, ignore=400)
    # 取消analyzed，以便全匹配搜索
    # body = {'properties': {'code': {'type': 'keyword'}}}
    # es.indices.put_mapping(index=fifa_skill_level_capability_index, doc_type=fifa_skill_level_capability_type, body=body)
    # 爬取天赋列表
    print(skill_list_url)
    resp = requests.get(skill_list_url)
    data = json.loads(resp.text)
    print(data)
    n = {}
    for skill in data['data']:
        # 天赋
        setValue(n, skill, 'code', 'code', None)
        setValue(n, skill, 'name', 'name', None)
        print(n)
        es.index(index=fifa_skill_index, doc_type=fifa_skill_type, id=n['code'], body=n)
        # 天赋等级提升
        url2 = skill_level_capability_url+skill['code'];
        resp2 = requests.get(url2)
        data2 = json.loads(resp2.text)
        s = {'code': skill['code'], 'upData': data2['data']}
        es.index(index=fifa_skill_level_capability_index, doc_type=fifa_skill_level_capability_type, id=skill['code'], body=s)

"""
search天赋
"""
def searchSkill():
    resp = es.search(index=fifa_skill_index, doc_type=fifa_skill_type, body=default_search_body)
    data = tranferDictWithUTF8(resp["hits"])
    print(data)
    return data


"""
search天赋等级提升
"""
def searchSkillLevelCapability(code):
    # body = {'query': {'term': {'code': code}}}
    # resp = es.search(index=fifa_skill_level_capability_index, doc_type=fifa_skill_level_capability_type, body=body)
    resp = es.get(index=fifa_skill_level_capability_index, doc_type=fifa_skill_level_capability_type, id=code)
    data = tranferDictWithUTF8(resp["_source"])
    print(data)
    return data


"""
初始化活动索引
"""
def initProgramIndex():
    # 删除原有索引
    es.indices.delete(index=fifa_program_index, ignore=[400, 404])
    # 重新创建索引
    es.indices.create(index=fifa_program_index, ignore=400)
    # 爬取活动列表
    print(program_list_url)
    resp = requests.get(program_list_url)
    data = json.loads(resp.text)
    print(data)
    n = {}
    for program in data['data']:
        if program['isShow'] == '1':
            setValue(n, program, 'code', 'code', None)
            setValue(n, program, 'icon', 'icon', None)
            setValue(n, program, 'chname', 'chname', None)
            setValue(n, program, 'enname', 'enname', None)
            print(n)
            es.index(index=fifa_program_index, doc_type=fifa_program_type, id=n['code'], body=n)


"""
search活动
"""
def searchProgram():
    resp = es.search(index=fifa_program_index, doc_type=fifa_program_type, body=default_search_body)
    data = tranferDictWithUTF8(resp["hits"])
    print(data)
    return data


"""
初始化位置等级提升索引
"""
def initJobLevelCapabilityIndex():
    # 删除原有索引
    es.indices.delete(index=fifa_job_level_capability_index, ignore=[400, 404])
    # 重新创建索引
    es.indices.create(index=fifa_job_level_capability_index, ignore=400)
    # 取消analyzed，以便全匹配搜索
    # body = {'properties': {'code': {'type': 'keyword'}}}
    # es.indices.put_mapping(index=fifa_job_level_capability_index, doc_type=fifa_job_level_capability_type, body=body)
    # 爬取位置等级提升数据
    for job in job_list:
        url = job_level_capability_url+job;
        print(url)
        resp = requests.get(url)
        data = json.loads(resp.text)
        j = {'code': job, 'upData': data['data']}
        print(j)
        es.index(index=fifa_job_level_capability_index, doc_type=fifa_job_level_capability_type, id=j['code'], body=j)


"""
search位置等级提升
"""
def searchJobLevelCapability(code):
    # body = {'query': {'term': {'code': code}}}
    # resp = es.search(index=fifa_job_level_capability_index, doc_type=fifa_job_level_capability_type, body=body)
    resp = es.get(index=fifa_job_level_capability_index, doc_type=fifa_job_level_capability_type, id=code)
    data = tranferDictWithUTF8(resp["_source"])
    print(data)
    return data


"""
count球员
"""
def countPlayers():
    resp = es.count(index=fifa_player_index, doc_type=fifa_player_type)
    return str(resp['count'])

"""
count所有信息，包括球员/联赛/俱乐部/天赋/活动
"""
def countAll():
    player_count = es.count(index=fifa_player_index, doc_type=fifa_player_type)['count']
    league_count = es.count(index=fifa_league_index, doc_type=fifa_league_type)['count']
    club_count = es.count(index=fifa_club_index, doc_type=fifa_club_type)['count']
    skill_count = es.count(index=fifa_skill_index, doc_type=fifa_skill_type)['count']
    program_count = es.count(index=fifa_program_index, doc_type=fifa_program_type)['count']
    skill_updata_count = es.count(index=fifa_skill_level_capability_index, doc_type=fifa_skill_level_capability_type)['count']
    job_updata_count = es.count(index=fifa_job_level_capability_index, doc_type=fifa_job_level_capability_type)['count']
    result = {
        'player_count': player_count,
        'league_count': league_count,
        'club_count': club_count,
        'skill_count': skill_count,
        'program_count': program_count,
        'skill_updata_count': skill_updata_count,
        'job_updata_count': job_updata_count
    }
    return tranferDictWithUTF8(result)

"""
search球员
"""
def searchPlayers(min_score, max_score, name, nation, league, club, job, skill, program):
    body = {
        "from": 0, "size": 100,
        "query": {
            "bool": {
                "must": [
                ]
            }
        },
        "sort": {
            "score": {
                "order": "desc"
            }
        }
    }
    if min_score is not None or max_score is not None:
        score_range = {"range": {"score": {}}}
        if min_score is not None:
            score_range["range"]["score"]["gte"] = int(min_score)
        if max_score is not None:
            score_range["range"]["score"]["lte"] = int(max_score)
        body["query"]["bool"]["must"].append(score_range)
    if name is not None:
        name_match = {"match": {"name": name}}
        body["query"]["bool"]["must"].append(name_match)
    if nation is not None:
        nation_match = {"term": {"nation": nation}}
        body["query"]["bool"]["must"].append(nation_match)
    if league is not None:
        league_match = {"term": {"league": league}}
        body["query"]["bool"]["must"].append(league_match)
    if club is not None:
        club_match = {"term": {"club": club}}
        body["query"]["bool"]["must"].append(club_match)
    if job is not None:
        job_match = {"term": {"job": job}}
        body["query"]["bool"]["must"].append(job_match)
    if skill is not None:
        skill_match = {"term": {"skill": skill}}
        body["query"]["bool"]["must"].append(skill_match)
    if program is not None:
        program_match = {"term": {"program": program}}
        body["query"]["bool"]["must"].append(program_match)
    print(body)
    resp = es.search(index=fifa_player_index, doc_type=fifa_player_type, body=body)
    result = tranferDictWithUTF8(resp["hits"])
    print(result)
    return result

"""
将字典转为UTF8字符串
"""
def tranferDictWithUTF8(dict):
    result = json.dumps(dict, ensure_ascii=False).encode('utf-8')
    # print(type(result))
    return result


# ==================================================获取球员照片=======================================================
"""
获取背景图片URL
"""
def getBackgroundURL(pn, picFilename):
    imgUrl = "http://img.wantuole.com/resources/backgrouds/"
    return imgUrl + picFilename

def getBackground(pn, r, score, hb, bg):
    num = 0
    imgName = ""
    if int(hb) > 0:
        num = int((int(score) - 70) / 10)
        if bg == "CGER" or bg == 'SC' or bg == 'TC' or bg == 'T' or bg == 'TDYX' or pn.find('剧情精英球员') >= 0 or bg == 'ZCBase':
            num = int((int(score) - 50) / 10)
        elif bg == 'JLBZ':
            num = int((int(score) - 60) / 10)
        if pn == '世界杯球员':
            if num > 4:
                num = 4
        imgName = bg + str(num) + ".png"
    else:
        num = int((int(score) - 50) / 10);
        if bg != "BASIC":
            imgName = bg + str(num) + ".png"
        else:
            r_int = int(r)
            if r_int == 1:
                imgName = ""
            elif r_int == 2:
                imgName = "MR"
            elif r_int == 3:
                imgName = "ER"
            elif r_int == 4:
                imgName = "GR"
            elif r_int == 5:
                imgName = "SR"
            elif r_int == 6:
                imgName = "BR"
            imgName = imgName + str(num) + ".png"
    return imgName

"""
获取球员照片URL
"""
def getHeadURL(pn, picFilename):
    imgUrl = "http://img.wantuole.com/FIFA足球世界/players/"
    if pn == '世界杯球员':
        imgUrl = "http://img.wantuole.com/FIFA足球世界/wcplayers/"
    return imgUrl + picFilename

def getHead(pn, no, score, calcscore, head, count, haveas):
    imgUrl = "http://img.wantuole.com/FIFA足球世界/players/"
    if pn == '世界杯球员':
        imgUrl = "http://img.wantuole.com/FIFA足球世界/wcplayers/"
    num = 0
    imgName = ""

    if haveas != "" and int(haveas) == 1:
        if int(score) >= 80:
            if calcscore is not None:
                imgName = no + "_AS" + calcscore + ".png"
            else:
                imgName = no + "_AS.png"
        else:
            imgName = no + ".png"
    else:
        if head == "TOTW":
            #TODO 可能有bug
            if score is not None and score != "":
                imgName = no + "_" + head + calcscore + ".png"
            else:
                imgName = no + "_" + head + ".png"
        else:
            if count != "" and int(count) > 1:
                num = int((int(score) - int(calcscore)) / 10)
                if head == "IC" or head == "PI":
                    if num == 0:
                        num = 1
                if num > int(count):
                    num = int(count)
                imgName = no + "_" + head + str(num) + ".png"
            else:
                if head is not None and head != "":
                    if int(score) >= 80:
                        imgName = no + "_" + head + ".png"
                        if head == 'MM':
                            if score >= 100:
                                imgName = no + "_L" + head + ".png"
                        elif head == 'LVL':
                            if score >= 100:
                                imgName = no + "_LVLM.png"
                    else:
                        if calcscore == -1:
                            imgName = no + "_" + head + ".png"
                        else:
                            imgName = no + ".png"
                else:
                    imgName = no + ".png"
    return imgName