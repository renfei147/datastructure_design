import express from "express";
import ViteExpress from "vite-express";
import { Activity, Course, Schedule, User,Tempwork } from "../common/definitions";
import { HashTable } from "./HashTable";
import { findShortestPath } from "./ShortestPath";
import fse from "fs-extra";

let url = require("url");

const isAtPresent = 0;

const app = express();

let users: User[];
let schedule: Schedule;
let withStudentsCourse: {
  [key:string]:
  Course & { students: User[] }
};
let withStudentsActivity: {
  [key:string]:
  Activity&{students:User[]}
};
let withStudentsTempwork: {
  [key:string]:
  Tempwork&{students:User[]}
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
  if(isAtPresent) users.splice(4, 5);
});

fse.readJSON("src/server/withStudentCourse.json").then((data) => {
  withStudentsCourse = data;
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

/*
app.post("/api/login", (req, res) => {
  let user = req.body;
  let result = users.find((u) => u.id == user.id);
  if (result) {
    res.send(result);
  } else {
    res.status(401).send("用户名或密码错误");
  }
});
*/

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);

/*----------以下是用到的工具函数----------*/ 

//构造schedule
function structSchedule(id: String): Schedule {
  let mySchedule = JSON.parse(JSON.stringify(schedule));
  for(const [key,value] of Object.entries(withStudentsCourse)){
    for(const student of value.students){
      if(student.id == id){
        if(isAtPresent && value.name.includes("喵喵")) continue;
        mySchedule.courses.push(value);
      }
    }
  }
  for(const [key,value] of Object.entries(withStudentsActivity)){
    for(const student of value.students){
      if(student.id == id){
        if(isAtPresent && value.name.includes("喵喵")) continue;
        mySchedule.activities.push(value);
        console.log(JSON.stringify(value));
      }
    }
  }
  for(const [key,value] of Object.entries(withStudentsTempwork)){
    for(const student of value.students){
      if(student.id == id){
        if(isAtPresent && value.name.includes("喵喵")) continue;
        mySchedule.tempworks.push(value);
      }
    }
  }
  return mySchedule;
}


