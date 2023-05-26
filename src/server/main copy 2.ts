import express from "express";
import ViteExpress from "vite-express";
import { Activity, Course, Schedule, User, Tempwork } from "../common/definitions";
import { HashTable } from "./HashTable";
import { findShortestPath } from "./ShortestPath";
import fse from "fs-extra";
import { dayToDate } from "../common/day";

interface time_interval {
  start: number;
  end: number;//保存时间戳
}
let time_interval_list: time_interval[] = [];
let url = require("url");
// console.log(new Date());
const isAtPresent = 0;

const app = express();

let users: User[];
let schedule: Schedule;
let withStudentsCourse: {
  [key: string]:
  Course & { students: User[] } & { id: string }
};
let com_withStudentsCourse: {
  [key: string]:
  {
    command: "add" | "upd";
    msg: Course & { students: User[] } & { id: string };
  } | {
    command: "del";
    msg: string
  }
};

let withStudentsActivity: {
  [key: string]:
  Activity & { students: User[] }
};
let com_withStudentsActivity: {
  [key: string]:
  {
    command: "add" | "upd";
    msg: Activity & { students: User[] } & { id: string };
  } | {
    command: "del";
    msg: string
  }
};

let withStudentsTempwork: {
  [key: string]:
  Tempwork & { students: User[] }
}; let com_withStudentsTempwork: {
  [key: string]:
  {
    command: "add" | "upd";
    msg: Tempwork & { students: User[] };
  } | {
    command: "del";
    msg: string
  }
};

// let myHashTable = new HashTable();
// myHashTable.put("shedule", "my shedule");
// console.log(myHashTable.find("shedule"));

// async function test() {
//   console.log("!shortest path");
//   console.log(await findShortestPath(0, 1));
// }
// test(); 

/*以下为读文件相关*/
fse.readJSON("src/server/schedule.json").then((data) => {
  schedule = data;
});

fse.readJSON("src/server/users.json").then((data) => {
  users = data;
  if (isAtPresent) users.splice(4, 5);
});

fse.readJSON("src/server/withStudentCourse.json").then((data) => {
  withStudentsCourse = data;
}).then(() => {
  fse.readJSON("src/server/com_withStudentCourse.json").then((data) => {
    com_withStudentsCourse = data;
  }).then(() => {
    for (const [key, value] of Object.entries(com_withStudentsCourse)) {
      if (value.command == "add") withStudentsCourse[value.msg.id] = value.msg;
      if (value.command == "del") delete withStudentsCourse[value.msg];
      if (value.command == "upd") withStudentsCourse[value.msg.id] = value.msg;
    }
  });
});

fse.readJSON("src/server/withStudentActivity.json").then((data) => {
  withStudentsActivity = data;
}).then(() => {
  fse.readJSON("src/server/com_withStudentActivity.json").then((data) => {
    com_withStudentsActivity = data;
  }).then(() => {
    for (const [key, value] of Object.entries(com_withStudentsActivity)) {
      if (value.command == "add") withStudentsActivity[value.msg.id] = value.msg;
      if (value.command == "del") delete withStudentsActivity[value.msg];
      if (value.command == "upd") withStudentsActivity[value.msg.id] = value.msg;
    }
  });
});

fse.readJSON("src/server/withStudentTempwork.json").then((data) => {
  withStudentsTempwork = data;
}).then(() => {
  fse.readJSON("src/server/com_withStudentTempwork.json").then((data) => {
    com_withStudentsTempwork = data;
  }).then(() => {
    for (const [key, value] of Object.entries(com_withStudentsTempwork)) {
      if (value.command == "add") withStudentsTempwork[value.msg.id] = value.msg;
      if (value.command == "del") delete withStudentsTempwork[value.msg];
      if (value.command == "upd") withStudentsTempwork[value.msg.id] = value.msg;
    }
  });
});
/*以上为读文件相关*/

/*以下为基础操作*/
app.use(express.json())

app.get("/api/users", (_, res) => {
  res.send(users);
});

app.get("/api/schedule", (req, res) => {
  console.log(withStudentsActivity);
  let params = url.parse(req.url, true).query;
  res.send(structSchedule(params.id));
});

app.get("/api/shortestPath", (req, res) => {
  let params = url.parse(req.url, true).query;
  findShortestPath(parseInt(params.start), parseInt(params.end)).then((data) => {
    console.log(JSON.stringify(data));
    console.log(data);
    res.send(data);
  })
});
/*以上为基础操作*/


/*以下为course增删改操作*/
app.post("/api/addcourse", (req, res) => {
  let body = req.body;
  let course = body.msg;
  let nextID = 0;
  //course没有冲突时间检测
  for (const [key, value] of Object.entries(withStudentsCourse)) {
    if (parseInt(key) > nextID) nextID = parseInt(key);
    // if (value.name == course.name) return res.status(401).send("already exist");
  }
  nextID++;
  console.log("nextID: " + nextID.toString());
  console.log(course);
  course["id"] = nextID.toString();
  com_withStudentsCourse[Object.keys(com_withStudentsCourse).length + 1] = {
    command: "add",
    msg: course
  };
  withStudentsCourse[nextID.toString()] = course;
  res.send("success");
});

app.post("/api/delcourse", (req, res) => {
  let body = req.body;
  let result = false;
  if (body.msg in withStudentsCourse) {
    delete withStudentsCourse[body.msg];
    com_withStudentsCourse[Object.keys(com_withStudentsCourse).length + 1] = body;
    result = true;
  }
  if (result) {
    res.send("success");
  } else {
    res.status(401).send("not exist");
  }
});

app.post("/api/updcourse", (req, res) => {
  let body = req.body;
  let course = body.msg;
  if (body.id in withStudentsCourse) {
    withStudentsCourse[body.id] = course;
    com_withStudentsCourse[Object.keys(com_withStudentsCourse).length + 1] = body;
    res.send("success");
  } else {
    res.status(401).send("not exist");
  }
});
/*以上为course增删改操作*/


/*以下为activity增删改操作*/
app.post("/api/addactivity", (req, res) => {
  let body = req.body;
  let course = body.msg;
  let nextID = 0;
  let timelist = [];
  switch (body.msg.repeat.type) {
    case "once":
      if (isTime_interval_list_Collision(() => {
        let new_list = JSON.parse(JSON.stringify(time_interval_list));
        new_list.push({
          start: dayToDate(course.repeat.day).getTime() + course.startTime * 3600 * 1000,
          end: dayToDate(course.repeat.day).getTime() + (course.startTime + 1) * 3600 * 1000
        });
        return new_list;
      })) {
        for (let i = 1; ; i++) {
          if (!isTime_interval_list_Collision(() => {
            let new_list = JSON.parse(JSON.stringify(time_interval_list));
            new_list.push({
              start: dayToDate(course.repeat.day).getTime() + (course.startTime + i) * 3600 * 1000,
              end: dayToDate(course.repeat.day).getTime() + (course.startTime + 1 + i) * 3600 * 1000
            });
            return new_list;
          })) {
            let new_course = JSON.parse(JSON.stringify(course));
            let newDate = new Date(dayToDate(course.repeat.day).getTime() + (course.startTime + i) * 3600 * 1000);
            new_course.repeat.day = {
              year: newDate.getFullYear(),
              month: newDate.getMonth(),//如果出现了月份对不上的情况，可能需要回到这里+1
              day: newDate.getDate()
            }
            new_course.startTime = newDate.getHours();
            timelist.push(new_course);
            if (timelist.length == 3) return res.send(timelist);//这是返回三个可行的时间，返回的形式是发了三种不同的Activity类
          }
        }
      }
      // if(timelist.length!=0) return res.status(400).send(timelist);//如果冲突，就返回三个可行时间，形式为请求时间的增量，如返回[1,2,4]，则表示可行时间为请求时间的后一小时，后两小时，后四小时
      //因为接口没有一个好的时间接口，返回Date对象又过于臃肿，因此返回增量;todo，修改返回形式
      break;
    case "weekly":
      
      break;
    case "daily":
      for (let i = (dayToDate(body.msg.repeat.startDay).getTime() - dayToDate(schedule.firstDay).getTime()) / (3600 * 1000 * 24);
        i <= (dayToDate(body.msg.repeat.endDay).getTime() - dayToDate(schedule.firstDay).getTime()) / (3600 * 1000 * 24);
        i++)
        available[24 * i + body.msg.startTime] = false;//check
      break;
  }

  for (const [key, value] of Object.entries(withStudentsActivity)) {
    if (parseInt(key) > nextID) nextID = parseInt(key);
    // if (value.name == course.name) return res.status(401).send("already exist");
  }
  nextID++;
  console.log("nextID: " + nextID.toString());
  console.log(course);
  course["id"] = nextID.toString();
  com_withStudentsActivity[Object.keys(com_withStudentsActivity).length + 1] = {
    command: "add",
    msg: course
  };
  withStudentsActivity[nextID.toString()] = course;
  res.send("success");
});

app.post("/api/delactivity", (req, res) => {
  let body = req.body;
  let result = false;
  if (body.msg in withStudentsActivity) {
    delete withStudentsActivity[body.msg];
    com_withStudentsActivity[Object.keys(com_withStudentsActivity).length + 1] = body;
    result = true;
  }
  if (result) {
    res.send("success");
  } else {
    res.status(401).send("not exist");
  }
});

app.post("/api/updactivity", (req, res) => {
  let body = req.body;
  let course = body.msg;
  if (body.id in withStudentsActivity) {
    withStudentsActivity[body.id] = course;
    com_withStudentsActivity[Object.keys(com_withStudentsActivity).length + 1] = body;
    res.send("success");
  } else {
    res.status(401).send("not exist");
  }

});
/*以上为activity增删改操作*/


/*以下为tempwork增删改操作*/
app.post("/api/addtempwork", (req, res) => {
  let body = req.body;
  let course = body.msg;
  let nextID = 0;
  for (const [key, value] of Object.entries(withStudentsTempwork)) {
    if (parseInt(key) > nextID) nextID = parseInt(key);
    // if (value.name == course.name) return res.status(401).send("already exist");
  }
  nextID++;
  console.log("nextID: " + nextID.toString());
  console.log(course);
  course["id"] = nextID.toString();
  com_withStudentsTempwork[Object.keys(com_withStudentsTempwork).length + 1] = {
    command: "add",
    msg: course
  };
  withStudentsTempwork[nextID.toString()] = course;
  res.send("success");
});

app.post("/api/deltempwork", (req, res) => {
  let body = req.body;
  let result = false;
  if (body.msg in withStudentsTempwork) {
    delete withStudentsTempwork[body.msg];
    com_withStudentsTempwork[Object.keys(com_withStudentsTempwork).length + 1] = body;
    result = true;
  }
  if (result) {
    res.send("success");
  } else {
    res.status(401).send("not exist");
  }
});

app.post("/api/updtempwork", (req, res) => {
  let body = req.body;
  let course = body.msg;
  if (body.id in withStudentsTempwork) {
    withStudentsTempwork[body.id] = course;
    com_withStudentsTempwork[Object.keys(com_withStudentsTempwork).length + 1] = body;
    res.send("success");
  } else {
    res.status(401).send("not exist");
  }

});
/*以上为tempwork增删改操作*/

app.get("/api/savechanges", (req, res) => {
  // console.log(com_withStudentsActivity);
  Promise.all([
    fse.writeJSON("src/server/com_withStudentCourse.json", com_withStudentsCourse),
    fse.writeJSON("src/server/com_withStudentActivity.json", com_withStudentsActivity),
    fse.writeJSON("src/server/com_withStudentTempwork.json", com_withStudentsTempwork)
  ]).then(() => {
    res.send("success");
  })
})

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);

/*----------以下是用到的工具函数----------*/

//构造schedule
function structSchedule(id: String): Schedule {
  let mySchedule = JSON.parse(JSON.stringify(schedule));
  for (const [key, value] of Object.entries(withStudentsCourse)) {
    for (const student of value.students) {
      if (student.id == id) {
        if (isAtPresent && value.name.includes("喵喵")) continue;
        value["id"] = key;
        mySchedule.courses.push(value);

        for (let i = value.startWeek; i <= value.endWeek; i++)
          time_interval_list.push({
            start: dayToDate(schedule.firstDay).getTime() + i * 7 * 24 * 3600 * 1000 + value.weekday * 24 * 3600 * 1000 + value.startTime * 3600 * 1000,
            end: dayToDate(schedule.firstDay).getTime() + i * 7 * 24 * 3600 * 1000 + value.weekday * 24 * 3600 * 1000 + (value.startTime + value.duration) * 3600 * 1000
          });
        if (value.examInfo)
          time_interval_list.push({
            start: dayToDate(value.examInfo.day).getDate() + value.examInfo.startTime * 3600 * 1000,
            end: dayToDate(value.examInfo.day).getDate() + (value.examInfo.startTime + value.examInfo.duration) * 3600 * 1000
          });
      }
    }
  }
  for (const [key, value] of Object.entries(withStudentsActivity)) {
    for (const student of value.students) {
      if (student.id == id) {
        if (isAtPresent && value.name.includes("喵喵")) continue;
        value["id"] = key;
        mySchedule.activities.push(value);
        switch (value.repeat.type) {
          case "once":
            time_interval_list.push({
              start: dayToDate(value.repeat.day).getTime() + value.startTime * 3600 * 1000,
              end: dayToDate(value.repeat.day).getTime() + (value.startTime + 1) * 3600 * 1000
            });
            break;
          case "weekly":
            for (let i = value.repeat.startWeek; i <= value.repeat.endWeek; i++)
              time_interval_list.push({
                start: dayToDate(schedule.firstDay).getTime() + i * 7 * 24 * 3600 * 1000 + value.repeat.weekday * 24 * 3600 * 1000 + value.startTime * 3600 * 1000,
                end: dayToDate(schedule.firstDay).getTime() + i * 7 * 24 * 3600 * 1000 + value.repeat.weekday * 24 * 3600 * 1000 + (value.startTime + 1) * 3600 * 1000
              });
            break;
          case "daily":
            for (let i = dayToDate(value.repeat.startDay).getTime(); i <= dayToDate(value.repeat.endDay).getTime(); i += 24 * 3600 * 1000)
              time_interval_list.push({
                start: i + value.startTime * 3600 * 1000,
                end: i + (value.startTime + 1) * 3600 * 1000
              });
            break;
        }
      }
    }
  }
  for (const [key, value] of Object.entries(withStudentsTempwork)) {
    for (const student of value.students) {
      if (student.id == id) {
        if (isAtPresent && value.name.includes("喵喵")) continue;
        value["id"] = key;
        mySchedule.tempworks.push(value);
        time_interval_list.push({
          start: dayToDate(value.day).getTime() + value.time * 3600 * 1000,
          end: dayToDate(value.day).getTime() + (value.time + 1) * 3600 * 1000
        });
      }
    }
  }
  time_interval_list.sort((a, b) => a.start - b.start);//基于start升序排列
  return mySchedule;
}

function isTime_interval_list_Collision(generateMore: () => time_interval[]): boolean {
  let new_list = generateMore();
  new_list.sort((a, b) => a.start - b.start);
  for (let i = 1; i < new_list.length; i++) {
    if (new_list[i].start < new_list[i - 1].end) return true;
  }
  return false;
}

