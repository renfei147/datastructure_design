import express from "express";
import ViteExpress from "vite-express";
import { Course, Schedule, User } from "../common/definitions";
import { HashTable } from "./HashTable";
import fse from "fs-extra";
let url = require("url");

const isAtPresent = 1;

const app = express();

let users: User[];

let schedule: Schedule;
let withStudentsCourse: {
  [key:string]:
  Course & { students: User[] }
};
// let withStudentsCourse: Map<string, Course & { students: User[] }>;

let myHashTable = new HashTable();
myHashTable.put("shedule", "my shedule");
console.log(myHashTable.find("shedule"));


// console.log(JSON.stringify(users));
fse.readJSON("src/server/schedule.json").then((data) => {
  schedule = data;
});

fse.readJSON("src/server/users.json").then((data) => {
  users = data;
  users.splice(4, 5);
});

fse.readJSON("src/server/withStudentCourse.json").then((data) => {
  withStudentsCourse = data;
  // let a = withStudentsCourse.get('1');
});

//构造schedule
function structSchedule(id: String): Schedule {
  let mySchedule = JSON.parse(JSON.stringify(schedule));
  for(const [key,value] of Object.entries(withStudentsCourse)){
    for(const student of value.students){
      if(student.id == id){
        if(isAtPresent && value.name == "喵喵叫小课堂") continue;
        mySchedule.courses.push(value);
      }
    }
  }
  // withStudentsCourse.forEach((course) => {
  //   course.students.forEach((student) => {
  //     if (student.id == id) {
  //       if (isAtPresent && course.name == "喵喵叫小课堂") return;
  //       mySchedule.courses.push(course);
  //     }
  //   });
  // });
  return mySchedule;
}

app.use(express.json())

app.get("/api/users", (_, res) => {
  res.send(users);
});

app.get("/api/schedule", (req, res) => {
  // res.send(schedule);
  let params = url.parse(req.url, true).query;
  res.send(structSchedule(params.id));
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
