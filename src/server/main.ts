import express from "express";
import ViteExpress from "vite-express";
import { Activity, Course, Schedule, User,Tempwork } from "../common/definitions";
import { HashTable } from "./HashTable";
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

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);


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