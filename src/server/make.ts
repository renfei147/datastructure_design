//创建一个对象让他长得和

import { Tempwork } from "../common/definitions";
import { renderToString } from '@vue/server-renderer'
import { User } from "../common/definitions";
interface students{
    name:string,
    id:string
}
let user:students[][] = [
    [{
        "name": "伍一",
        "id": "1"
    }],
    [{
        "name": "刘二",
        "id": "2"

    }],
    [{
        "name": "张三",
        "id": "3"
    }],
    [{
        "name": "李四",
        "id": "4"
    }],
    [{
        "name": "法五",
        "id": "5"
    }],
    [{
        "name": "王六",
        "id": "6"
    }],
    [{
        "name": "赵七",
        "id": "7"
    }],
    [{
        "name": "孙八",
        "id": "8"
    }],
    [{
        "name": "周九",
        "id": "9"
    }],
    [{
        "name": "吴十",
        "id": "10"
    }]
]
let idcnt = 0;
let sushe: string[] = ["学一公寓", "学二公寓", "学三公寓", "学四公寓", "学五公寓", "留学生公寓", "学七公寓", "学八公寓", "学九公寓", "学十公寓"]
let canting: string[] = ["综合食堂", "学生食堂", "学苑风味餐厅"]

let a: any = [];
let bb: any = {
    id: "",
    name: "",
    day: {
        year: 0,
        month: 0,
        day: 0
    },
    time: 0,
    placeInfo: {
        type: "offline",
        id: 0,
        detail: ""
    },
    students: [{
        name: "",
        id: ""
    }]
};

let timestamp = new Date(2023, 2, 3).getTime();
for (let day = 0; day <= 4 * 30; day++) {
    for (let i = 0; i < 10; i++) {
        let b = JSON.parse(JSON.stringify(bb));
        if (day % 7 == 0) {
            b.students = user[i];
            b.id = idcnt.toString();
            idcnt++; 
            b.name = "去操场跑步";
            let date = new Date(timestamp + day * 24 * 60 * 60 * 1000);
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 7;
            b.placeInfo = {
                type: "offline",
                id: 117,
                detail: "操场跑道"
            }
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "吃米粉";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 7;
            b.placeInfo = {
                type: "offline",
                id: 150,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "吃麦当劳";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 11;
            b.placeInfo = {
                type: "offline",
                id: 45,
                detail: ""
            };
            console.log(b);
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "去教三取奖品";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 11;
            b.placeInfo = {
                type: "offline",
                id: 154,
                detail: "301"
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            console.log(idcnt.toString());
            console.log(idcnt);
            b.name = "去邮局送信";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 11;
            b.placeInfo = {
                type: "offline",
                id: 81,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
        }
        if (day % 7 == 1) {
            b = JSON.parse(JSON.stringify(bb));
            b.students = user[i];
            b.id = idcnt.toString();
            idcnt++;
            b.name = "去校医院复查";
            let date = new Date(timestamp + day * 24 * 60 * 60 * 1000);
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 20;
            b.placeInfo = {
                type: "offline",
                id: 106,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "看音乐喷泉";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 20;
            b.placeInfo = {
                type: "offline",
                id: 102,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "吃麦当劳";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 11;
            b.placeInfo = {
                type: "offline",
                id: 45,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "去教三写作业";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 16;
            b.placeInfo = {
                type: "offline",
                id: 154,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
        }
        if (day % 7 == 2) {
            b.students = user[i];
            b.id = idcnt.toString();
            idcnt++;
            b.name = "看电影";
            let date = new Date(timestamp + day * 24 * 60 * 60 * 1000);
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 21;
            b.placeInfo = {
                type: "online",
                link: "https://www.bilibili.com/"
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "吃香翅捞饭";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 21;
            b.placeInfo = {
                type: "offline",
                id: 150,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "去教三写作业";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 19;
            b.placeInfo = {
                type: "offline",
                id: 154,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "吃双层鳕鱼堡";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 19;
            b.placeInfo = {
                type: "offline",
                id: 45,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "购物";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 19;
            b.placeInfo = {
                type: "offline",
                id: 37,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
        }
        if (day % 7 == 3) {
            b.students = user[i];
            b.id = idcnt.toString();
            idcnt++;
            b.name = "去校医院复查";
            let date = new Date(timestamp + day * 24 * 60 * 60 * 1000);
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 19;
            b.placeInfo = {
                type: "offline",
                id: 106,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "看音乐喷泉";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 21;
            b.placeInfo = {
                type: "offline",
                id: 102,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "吃麦当劳";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 21;
            b.placeInfo = {
                type: "offline",
                id: 45,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "去教三写作业";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 19;
            b.placeInfo = {
                type: "offline",
                id: 154,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "买饮料";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 21;
            b.placeInfo = {
                type: "offline",
                id: 37,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
        }
        if (day % 7 == 4) {
            b.students = user[i];
            b.id = idcnt.toString();
            idcnt++;
            b.name = "看电影";
            let date = new Date(timestamp + day * 24 * 60 * 60 * 1000);
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 21;
            b.placeInfo = {
                type: "online",
                link: "https://www.bilibili.com/"
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "吃香翅捞饭";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 21;
            b.placeInfo = {
                type: "offline",
                id: 150,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "去教三取忘了拿的东西";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 21;
            b.placeInfo = {
                type: "offline",
                id: 154,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "喝橘子泡泡饮料";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 21;
            b.placeInfo = {
                type: "offline",
                id: 45,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "购物";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 18;
            b.placeInfo = {
                type: "offline",
                id: 37,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
        }
        if (day % 7 == 5) {

            b.students = user[i];
            b.id = idcnt.toString();
            idcnt++;
            b.name = "打乒乓球";
            let date = new Date(timestamp + day * 24 * 60 * 60 * 1000);
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 6;
            b.placeInfo = {
                type: "offline",
                id: 120,
                detail: ""
            }
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "吃掉渣饼";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 6;
            b.placeInfo = {
                type: "offline",
                id: 150,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "吃麦当劳";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 6;
            b.placeInfo = {
                type: "offline",
                id: 45,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "去教四看影评";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 18;
            b.placeInfo = {
                type: "offline",
                id: 152,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "去邮局收信";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 16;
            b.placeInfo = {
                type: "offline",
                id: 81,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
        }
        if (day % 7 == 6) {
            b.students = user[i];
            b.id = idcnt.toString();
            idcnt++;
            b.name = "去校医院复查";
            let date = new Date(timestamp + day * 24 * 60 * 60 * 1000);
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 12;
            b.placeInfo = {
                type: "offline",
                id: 106,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "看音乐喷泉";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 12;
            b.placeInfo = {
                type: "offline",
                id: 102,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "吃麦当劳";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 12;
            b.placeInfo = {
                type: "offline",
                id: 45,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "去教三写作业";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 19;
            b.placeInfo = {
                type: "offline",
                id: 154,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "去邮局收信";
            b.day = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            b.time = 19;
            b.placeInfo = {
                type: "offline",
                id: 81,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
        }
    }
}
//将a转成json文件
let json = JSON.stringify(a);
const fs = require('fs');
fs.writeFileSync("tempwork.json", json);


