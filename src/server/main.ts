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
let com_withStudentsCourse: {
  [key: string]:
  {
    command: "add" | "upd";
    msg: Course & { students: User[] }&{id:string};
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
    msg: Activity & { students: User[] }&{id:string};
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
  for (const [key, value] of Object.entries(withStudentsCourse)) {
    if (parseInt(key) > nextID) nextID = parseInt(key);
    if (value.name == course.name) return res.status(401).send("already exist");
  }
  nextID++;
  console.log("nextID: " + nextID.toString());
  console.log(course);
  course["id"]=nextID.toString();
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
  for (const [key, value] of Object.entries(withStudentsActivity)) {
    if (parseInt(key) > nextID) nextID = parseInt(key);
    if (value.name == course.name) return res.status(401).send("already exist");
  }
  nextID++;
  console.log("nextID: " + nextID.toString());
  console.log(course);
  course["id"]=nextID.toString();
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
    if (value.name == course.name) return res.status(401).send("already exist");
  }
  nextID++;
  console.log("nextID: " + nextID.toString());
  console.log(course);
  course["id"]=nextID.toString();
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
  ]).then(()=>{
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


