# -*- coding:utf-8 -*-

from qingstor.sdk.service.qingstor import QingStor
from qingstor.sdk.config import Config
import requests
import tempfile

# 初始化QingStor对象
config = Config('EBZAULNLJTMJJCZJWCRG', '02MLUQZA5wZPwTrOmVWUajPhNUSFI8c5VKu2Wf0u')
qingstor = QingStor(config)

# 获取bucket列表
# output = qingstor.list_buckets()
# print(output.status_code)
# print(output['buckets'])

# 获取指定bucket对象
bucket = qingstor.Bucket('fifa-helper-bucket', 'sh1a')

def getFileByKey(key):
    resp = bucket.get_object(key)
    with tempfile.NamedTemporaryFile() as f:
        for chunk in resp.iter_content():
            f.write(chunk)
    return f


def getRespByKey(key):
    resp = bucket.get_object(key)
    return resp


# 上传本地文件，图片使用'rb'格式，文档使用'r'
# with open('1625_IC1.png', 'rb') as f:
#     output = bucket.put_object(
#         'test-key', body=f
#     )
# print(output.status_code)

# 上传网络文件，图片使用'rb'格式，文档使用'r'
# r = requests.get('http://img.wantuole.com/resources/backgrouds/VIP2.png')
# output = bucket.put_object(
#     'test-key-2.png', body=r
# )
# print('结果：', output.status_code)

# 获取bucket文件列表
# output = bucket.list_objects()
# print(output.status_code)
# print("文件列表：", output['keys'])
#
# resp = bucket.head_object('test-key-2.png')
# print("文件状态：", resp.status_code)


# 根据key获取具体文件
# resp = bucket.get_object('test-key-2.png')
# with tempfile.NamedTemporaryFile() as f:
#     for chunk in resp.iter_content():
#         f.write(chunk)


# 根据key删除文件
# resp = bucket.delete('test-key-2.png')
# print("删除状态：", resp.status_code)