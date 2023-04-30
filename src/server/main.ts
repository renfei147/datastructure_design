import express from "express";
import ViteExpress from "vite-express";
import { Activity, Course, Schedule, User, Tempwork } from "../common/definitions";
import { HashTable } from "./HashTable";
import { findShortestPath } from "./ShortestPath";
import fse from "fs-extra";

let url = require("url");

const isAtPresent = 0;

const app = express();

let users: User[];
let schedule: Schedule;
let withStudentsCourse: {
  [key: string]:
  Course & { students: User[] } & { id: string }
};
let more_withStudentsCourse: {
  [key: string]:
  Course & { students: User[] }
};

let com_withStudentsCourse: {
  [key: string]:
  {
    command: "add" | "upd";
    msg: Course & { students: User[] } ;
    id: string
  } | {
    command: "del";
    msg: string
  }
};
let withStudentsActivity: {
  [key: string]:
  Activity & { students: User[] }
};
let withStudentsTempwork: {
  [key: string]:
  Tempwork & { students: User[] }
};

// let myHashTable = new HashTable();
// myHashTable.put("shedule", "my shedule");
// console.log(myHashTable.find("shedule"));

// async function test() {
//   console.log("!shortest path");
//   console.log(await findShortestPath(0, 1));
// }
// test(); 

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
      if (value.command == "add") withStudentsCourse[value.id] = value.msg;
      if (value.command == "del") delete withStudentsCourse[value.msg];
      if (value.command == "upd") withStudentsCourse[value.id] = value.msg;
    }
  });
});

fse.readJSON("src/server/withStudentActivity.json").then((data) => {
  withStudentsActivity = data;
});

fse.readJSON("src/server/withStudentTempwork.json").then((data) => {
  withStudentsTempwork = data;
});

app.use(express.json())

app.get("/api/users", (_, res) => {
  res.send(users);
});

app.get("/api/schedule", (req, res) => {
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

app.post("/api/addcourse", (req, res) => {
  let body = req.body;
  let course = body.msg;
  let nextID = 0;
  for (const [key, value] of Object.entries(withStudentsCourse)) {
    if (parseInt(key) > nextID) nextID = parseInt(key);
    if (value.name == course.name) return res.status(401).send("already exist");
  }
  nextID++;
  console.log("nextID: " + nextID.toString());
  console.log(course);
  com_withStudentsCourse[Object.keys(com_withStudentsCourse).length + 1] = {
    command: "add",
    msg: course,
    id: nextID.toString()
  };
  withStudentsCourse[nextID.toString()] = course;
  fse.writeJSON("src/server/com_withStudentCourse.json", com_withStudentsCourse);
  res.send("success");
});

app.post("/api/delcourse", (req, res) => {
  let body = req.body;
  let result = false;
  if (body.msg in withStudentsCourse) {
    delete withStudentsCourse[body.msg];
    com_withStudentsCourse[Object.keys(com_withStudentsCourse).length + 1] = body;
    result = true;
    fse.writeJSON("src/server/com_withStudentCourse.json", com_withStudentsCourse);
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
  withStudentsCourse[body.msg.id] = course;
  com_withStudentsCourse[Object.keys(com_withStudentsCourse).length + 1] = body;
  fse.writeJSON("src/server/com_withStudentCourse.json", com_withStudentsCourse);
  res.send("success");
});


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
      }
    }
  }
  for (const [key, value] of Object.entries(withStudentsActivity)) {
    for (const student of value.students) {
      if (student.id == id) {
        if (isAtPresent && value.name.includes("喵喵")) continue;
        value["id"] = key;
        mySchedule.activities.push(value);
      }
    }
  }
  for (const [key, value] of Object.entries(withStudentsTempwork)) {
    for (const student of value.students) {
      if (student.id == id) {
        if (isAtPresent && value.name.includes("喵喵")) continue;
        value["id"] = key;
        mySchedule.tempworks.push(value);
      }
    }
  }
  // console.log(mySchedule);//检查schedule的格式是怎么样的
  return mySchedule;
}


