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
注意，addcourse传递时不需要有“id”字段，因为前端并不知道整个项目的id细节，所以添加时只需要说明这个课程的细节，后端会自动地补充一个id字段。
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

### 保存为json和显示信息
在向后端提交post后，如果返回为“success”，则说明修改成功。这时候需要再次 ```get  /api/schedule``` 以获得新的schedule。

在提交更新后，所有的更新都只是在内存中修改，下一次重启后端服务器将会清除这些更改。通过 ```get  /api/savechanges``` 可以将这些修改保存在以 ```com_``` 为首的几个文件中。这样做可以使你的修改在后端重启后继续保留。


## 对activity和tempwork的介绍
关于这部分的增删改功能，和course部分基本相同，不同在于msg字段中的内容是对应类型的内容。如对addtempwork，post的json为：
```json
{
        "command":"add",
        "msg":{
            "name": "买冰淇淋",
            "day": {
                "year": 2023,
                "month": 3,
                "day": 4
            },
            "time": 17,
            "placeInfo": {
                "type": "online",
                "link": "https://csrf.com"
            },
            "students": [
                {
                    "id": "1",
                    "name": "张三"
                },
                {
                    "id": "5",
                    "name": "太阳能rf"
                },
                {
                    "id": "4",
                    "name": "可爱软萌的猫娘女仆yya"
                }
            ]
        }
    }
```
post这个json可以在临时事物中增加如msg字段描述的“买冰淇淋”事件

### 关于id字段的介绍
在文件withStudentCourse.json中，每个键值对的格式例子为：
```json
"2":{
        "name": "热核武器与摩托车维修",
        "startTime": 8,
        "duration": 2,
        "weekday": 1,
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
```
这里不单独存在一个id字段，用来编号的是键值“2”
---
在变量withStudentCourse中，格式例子如下：
```ts
'2': {
    name: '热核武器与摩托车维修',
    startTime: 8,
    duration: 2,
    weekday: 1,
    startWeek: 1,
    endWeek: 10,
    placeInfo: { type: 'online', link: 'https://example.com' },
    students: [ 
        {
            "id": "3",
            "name": "法伍"
        },
        {
            "id": "5",
            "name": "太阳能rf"
        } 
    ],
    id: '2'
  }
```
> 这是在读文件时，根据键值增加了id字段

---
在发到前端的json中，格式例子如下：
```ts
    {
      name: '热核武器与摩托车维修',
      startTime: 8,
      duration: 2,
      weekday: 1,
      startWeek: 1,
      endWeek: 10,
      placeInfo: { type: 'online', link: 'https://example.com' },
      students: [ 
        {
            "id": "3",
            "name": "法伍"
        },
        {
            "id": "5",
            "name": "太阳能rf"
        } 
      ],
      id: '2'
    }
```

