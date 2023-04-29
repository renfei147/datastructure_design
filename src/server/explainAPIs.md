### addcourse
```json
{
    "command":"add",
    "msg":{
        "name": "mytest3",
        "startTime": 10,
        "duration": 2,
        "weekday": 4,
        "startWeek": 1,
        "endWeek": 10,
        "placeInfo": {
            "type": "online",
            "link": "https://example.com"
        },
        "students": [
            {
                "id": "3",
                "name": "法伍"
            },
            {
                "id": "5",
                "name": "太阳能rf"
            }
        ]
    }
}
```

### delcourse
```json
{
    "command":"del",
    "msg":"9"
}
```
msg内容即为删除的course的id


### updcourse
```json
{
    "command":"upd",
    "msg":{
        "name": "updcase",
        "startTime": 10,
        "duration": 2,
        "weekday": 4,
        "startWeek": 2,
        "endWeek": 10,
        "placeInfo": {
            "type": "online",
            "link": "https://example.com"
        },
        "students": [
            {
                "id": "3",
                "name": "法伍"
            },
            {
                "id": "5",
                "name": "太阳能rf"
            }
        ],
        "id":"11"
    }
}
```
msg内容为需要更改的内容。更新时，唯一标识符是id。


### 变量介绍
变量withStudentCourse是不带“id”字段的，因为键值就意味着id了。但发送给前端的schedule中是带id字段的，因为前端需要知道id。