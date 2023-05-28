

import { Tempwork } from "../common/definitions";
import { renderToString } from '@vue/server-renderer'
import { User } from "../common/definitions";
interface students {
    name: string,
    id: string
}

let user: students[][] = [
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
let bb: any ={
    id: "",
    name: "",
    startTime: 0,
    repeat: {
        type: 'weekly',
        weekday: 0,
        startWeek: 1,
        endWeek: 16
    },
    placeInfo: {
        type: "offline",
        id: 0,
        detail: ""
    },
    collective: true,
    students: []
};

let timestamp = new Date(2023, 2, 3).getTime();
    for (let i = 0; i < 10; i++) {
        if (true) {
            let b = JSON.parse(JSON.stringify(bb));
            b.students = user[i];
            b.id = idcnt.toString();
            idcnt++;
            b.name = "晨练";
            b.startTime = 6;
            b.repeat = {
                type: 'weekly',
                weekday: 0,
                startWeek: 1,
                endWeek: 16
            }
            b.placeInfo = {
                type: "offline",
                id: 117,
                detail: "操场跑道"
            }
            b.collective=true;
            b.students = user[i];
            a.push(b);


            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "吃早饭";
            b.repeat = {
                type: 'weekly',
                weekday: 0,
                startWeek: 1,
                endWeek: 16
            }
            b.startTime = 7;
            b.placeInfo = {
                type: "offline",
                id: 60,
                detail: ""
            };
            b.collective = false;
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "吃晚饭";
            b.repeat = {
                type: 'weekly',
                weekday: 0,
                startWeek: 1,
                endWeek: 16
            }
            b.startTime = 19;
            b.placeInfo = {
                type: "offline",
                id: 45,
                detail: ""
            };
            console.log(b);
            b.collective = false;
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "去教三上自习";
            b.repeat = {
                type: 'weekly',
                weekday: 0,
                startWeek: 1,
                endWeek: 16
            }
            b.startTime = 21;
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
            b = JSON.parse(JSON.stringify(bb));
            b.students = user[i];
            b.id = idcnt.toString();
            idcnt++;
            b.name = "去校医院做志愿";
            b.repeat = {
                type: 'weekly',
                weekday: 1,
                startWeek: 1,
                endWeek: 16
            }
            b.startTime = 7;
            b.placeInfo = {
                type: "offline",
                id: 106,
                detail: ""
            };
            b.collective= true;
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "去主楼做实验";
            b.repeat = {
                type: 'weekly',
                weekday: 1,
                startWeek: 1,
                endWeek: 16
            }
            b.startTime = 20;
            b.placeInfo = {
                type: "offline",
                id: 103,
                detail: ""
            };
            b.collective=true;
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "吃午饭";
            b.repeat = {
                type: 'weekly',
                weekday: 1,
                startWeek: 1,
                endWeek: 16
            }
            b.collective=false;
            b.startTime = 11;
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
            b.name = "吃晚饭";
            b.repeat = {
                type: 'weekly',
                weekday: 1,
                startWeek: 1,
                endWeek: 16
            }
            b.collective=false;
            b.startTime = 18;
            b.placeInfo = {
                type: "offline",
                id: 151,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.students = user[i];
            b.id = idcnt.toString();
            idcnt++;
            b.name = "线上开班会";
            b.repeat = {
                type: 'weekly',
                weekday: 2,
                startWeek: 1,
                endWeek: 16
            }
            b.collective=true;
            b.startTime = 19;
            b.placeInfo = {
                type: "online",
                link: "https://www.tengxunhuiyi.com/"
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "吃午饭";
            b.repeat = {
                type: 'weekly',
                weekday: 2,
                startWeek: 1,
                endWeek: 16
            }
            b.collective=false;
            b.startTime = 12;
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
            b.name = "去教三自习";
            b.repeat = {
                type: 'weekly',
                weekday: 2,
                startWeek: 1,
                endWeek: 16
            }
            b.collective=false;
            b.startTime = 20;
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
            b.name = "吃早饭";
            b.repeat = {
                type: 'weekly',
                weekday: 3,
                startWeek: 1,
                endWeek: 16
            }
            b.collective=false;
            b.startTime = 7;
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
            b.name = "洗澡";
            b.repeat = {
                type: 'weekly',
                weekday: 2,
                startWeek: 1,
                endWeek: 16
            }
            b.collective=false;
            b.startTime = 21;
            b.placeInfo = {
                type: "offline",
                id: 28,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.students = user[i];
            b.id = idcnt.toString();
            idcnt++;
            b.name = "洗澡";
            b.repeat = {
                type: 'weekly',
                weekday: 3,
                startWeek: 1,
                endWeek: 16
            }
            b.collective=false;
            b.startTime = 20;
            b.placeInfo = {
                type: "offline",
                id: 28,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "打篮球";
            b.repeat = {
                type: 'weekly',
                weekday: 3,
                startWeek: 1,
                endWeek: 16
            }
            b.collective=true;
            b.startTime = 12;
            b.placeInfo = {
                type: "offline",
                id: 69,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "吃午饭";
            b.repeat = {
                type: 'weekly',
                weekday: 3,
                startWeek: 1,
                endWeek: 16
            }
            b.collective=false;
            b.startTime = 12;
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
            b.name = "创新创业实践课";
            b.repeat = {
                type: 'weekly',
                weekday: 4,
                startWeek: 1,
                endWeek: 16
            }
            b.collective=true;
            b.startTime = 19;
            b.placeInfo = {
                type: "offline",
                id: 32,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "买洗澡";
            b.repeat = {
                type: 'weekly',
                weekday: 3,
                startWeek: 1,
                endWeek: 16
            }
            b.collective=false;
            b.startTime = 20;
            b.placeInfo = {
                type: "offline",
                id: 28,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.students = user[i];
            b.id = idcnt.toString();
            idcnt++;
            b.name = "小组作业";
            b.repeat = {
                type: 'weekly',
                weekday: 5,
                startWeek: 1,
                endWeek: 16
            }
            b.collective=false;
            b.startTime = 10;
            b.placeInfo = {
                type: "online",
                link: "https://www.xiaozuzuoye.com/"
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
            b.id = idcnt.toString();
            idcnt++;
            b.name = "吃午饭";
            b.repeat = {
                type: 'weekly',
                weekday: 5,
                startWeek: 1,
                endWeek: 16
            }
            b.collective=false;
            b.startTime = 12;
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
            b.name = "去教三自习";
            b.repeat = {
                type: 'weekly',
                weekday: 5,
                startWeek: 1,
                endWeek: 16
            }
            b.collective=false;
            b.startTime = 20;
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
            b.name = "吃晚饭";
            b.repeat = {
                type: 'weekly',
                weekday: 6,
                startWeek: 1,
                endWeek: 16
            }
            b.collective=false;
            b.startTime = 18;
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
            b.name = "做计组实验";
            b.repeat = {
                type: 'weekly',
                weekday: 6,
                startWeek: 1,
                endWeek: 16
            }
            b.collective=true;
            b.startTime = 8;
            b.placeInfo = {
                type: "offline",
                id: 103,
                detail: ""
            };
            b.students = user[i];
            a.push(b);
            b = JSON.parse(JSON.stringify(bb));
}
}
//将a转成json文件
let json = JSON.stringify(a);
const fs = require('fs');
fs.writeFileSync("tempACITIVY.json", json);
