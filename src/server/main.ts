import express from "express";
import ViteExpress from "vite-express";
import { Activity, Course, Schedule, User, Tempwork } from "../common/definitions";
import { HashTable } from "./HashTable";
import { findShortestPath } from "./ShortestPath";
import { TSP } from "../common/definitions";
import fse from "fs-extra";
import { findTSP } from "./TSP";
import { Day, dayToDate } from "../common/day";
import { id } from "element-plus/es/locale";

interface time_interval {
  start: number;
  end: number;//保存时间戳
}
let time_interval_list: time_interval[] = [];
let url = require("url");
// console.log(new Date());
const isAtPresent = false;
let is_time_interval_list_structed = false;
let recentID = 0;
let inDealingTempwork = false;
let inDealingActivity = false;
const app = express();

let users: User[];
let schedule: Schedule;
// let time_event_reference:{
//   [key:number]:{
//     kind:"activity"|"tempwork"|"course";
//     id:string;
//   }
// };
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

app.get("/api/log",(req,res)=>{
  res.send({
    log_activity:com_withStudentsActivity,
    log_tempwork:com_withStudentsTempwork,
    log_course:com_withStudentsCourse
  })
});

app.get("/api/users", (_, res) => {
  res.send(users);
});

app.get("/api/schedule", (req, res) => {
  console.log(withStudentsActivity);
  let params = url.parse(req.url, true).query;
  recentID = parseInt(params.id);
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

let mymap: Location[] = [];
fse.readFile("src/server/map.json").then((data) => {
  mymap = (JSON.parse(data.toString()));
  // console.log(findTSP([mymap[1],mymap[92],mymap[97],mymap[123],mymap[57],mymap[2],mymap[91],mymap[125],mymap[90],mymap[129]]));
});
//tsp api
app.post("/api/tsp", (req, res) => {
  let body = req.body.idlist;
  let locations: Location[] = [];
  for (let i = 0; i < body.length; i++) {
    locations.push(mymap[body[i]]);
  }
  findTSP(locations).then((data) => {
    res.send(data);
  });
})

/*以下为course增删改操作*/
//course需要冲突检测功能。具体的需求为，如果没产生冲突，那还好，如果产生了冲突，就要把冲突的活动和临时事务冲掉——假如是和其他课程冲突，那就返回备选方案。
/*
细化来说，有几点：
要在structSchedule时，建立一个starttime与事件一一对应的表，这样才能在产生冲突时，将冲突的starttime记下来然后得到冲突的事件。
流程应该是这样的：收到事件后检查冲突，这里的检查函数应该用定制的，在产生冲突后返回一个list包含冲突事件的starttime。如果产生冲突，就遍历这些starttime得到对应的事件，如果
包含课程，对复用下面的代码返回备选方案。如果不包含课程，就删除这些事件（包含删除withstudentsxxx，以及将删除命令存入com里面。）然后返回success，与删掉的事件id。

*/
app.post("/api/addcourse", (req, res) => {
  let body = req.body;
  let course:Course&{students:User[]} = body.msg;
  let nextID = 0;
  
  inDealingTempwork =inDealingActivity= true;
  structSchedule("-1");//强制算一遍没有tempwork和activity的time_interval_list
  //不对，应该用一个可以返回所有课程的函数，这个函数构造的schedule是所有的course，产生的time_interval_list是所有的course的time_interval_list
  inDealingTempwork =inDealingActivity= false;
  let proposedTimeIntervals = [];
  let alternativeTimeIntervals = [];
  for (let i = course.startWeek; i <= course.endWeek; i++) {
    proposedTimeIntervals.push(TimeStampConvertToTimeInterval(dayToDate(schedule.firstDay).getTime() + i * 7 * 24 * 3600 * 1000 + course.weekday * 24 * 3600 * 1000 + course.startTime * 3600 * 1000, course.duration));
  }
  // proposedTimeIntervals.push(convertToTimeInterval(course.day, course.time, course.duration));
  console.log(proposedTimeIntervals);
  if (isTimeIntervalCollision([...time_interval_list, ...proposedTimeIntervals])) {
    let i;
    for (i = 1; alternativeTimeIntervals.length <= 3; i++) {
      // let alternativeTimeInterval = convertToTimeInterval(course.day, course.time + i, 1);
      let alternativeTimeInterval = [];
      for (let TimeIntervalCount = 0; TimeIntervalCount < proposedTimeIntervals.length; TimeIntervalCount++) 
        alternativeTimeInterval.push({ start: proposedTimeIntervals[TimeIntervalCount].start + 3600 * 1000 * i, end: proposedTimeIntervals[TimeIntervalCount].end + 3600 * 1000 * i });
      if (!isTimeIntervalCollision([...time_interval_list, ...alternativeTimeInterval])) {
        let newDay = new Date(alternativeTimeInterval[0].start);
        let newCourse = { ...course };
        newCourse.weekday = newDay.getDay() - 1;//这个方法返回一周中的第几天
        if (newCourse.weekday == -1) newCourse.weekday = 6;//这是为了让周一变成0，周日变成6
        newCourse.startTime = newDay.getHours();
        alternativeTimeIntervals.push(newCourse);
      }
    }
    return res.send(alternativeTimeIntervals);
    // return dealAlternativeSend(alternativeTimeIntervals,i,course,res);
  }
  else {
    for(const student of course.students){
    structSchedule(student.id);//强制算一遍有tempwork和course的time_interval_list
    if (!isTimeIntervalCollision([...time_interval_list, ...proposedTimeIntervals]))
      time_interval_list.push(...proposedTimeIntervals);
    }
  }


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
    res.send("not exist");
  }
});

app.post("/api/updcourse", (req, res) => {
  let body = req.body;
  let course:Course&{students:User[]} = body.msg;
  if (course.id in withStudentsCourse) {
  let oldCourse = JSON.parse(JSON.stringify(withStudentsCourse[course.id]));
  delete withStudentsCourse[course.id];
  inDealingTempwork =inDealingActivity= true;
  structSchedule("-1");//强制算一遍没有tempwork和activity的time_interval_list
  //不对，应该用一个可以返回所有课程的函数，这个函数构造的schedule是所有的course，产生的time_interval_list是所有的course的time_interval_list
  inDealingTempwork =inDealingActivity= false;
  let proposedTimeIntervals = [];
  let alternativeTimeIntervals = [];
  for (let i = course.startWeek; i <= course.endWeek; i++) {
    proposedTimeIntervals.push(TimeStampConvertToTimeInterval(dayToDate(schedule.firstDay).getTime() + i * 7 * 24 * 3600 * 1000 + course.weekday * 24 * 3600 * 1000 + course.startTime * 3600 * 1000, course.duration));
  }
  // proposedTimeIntervals.push(convertToTimeInterval(course.day, course.time, course.duration));
  console.log(proposedTimeIntervals);
  if (isTimeIntervalCollision([...time_interval_list, ...proposedTimeIntervals])) {
    let i;
    for (i = 1; alternativeTimeIntervals.length <= 3; i++) {
      // let alternativeTimeInterval = convertToTimeInterval(course.day, course.time + i, 1);
      let alternativeTimeInterval = [];
      for (let TimeIntervalCount = 0; TimeIntervalCount < proposedTimeIntervals.length; TimeIntervalCount++) 
        alternativeTimeInterval.push({ start: proposedTimeIntervals[TimeIntervalCount].start + 3600 * 1000 * i, end: proposedTimeIntervals[TimeIntervalCount].end + 3600 * 1000 * i });
      if (!isTimeIntervalCollision([...time_interval_list, ...alternativeTimeInterval])) {
        let newDay = new Date(alternativeTimeInterval[0].start);
        let newCourse = { ...course };
        newCourse.weekday = newDay.getDay() - 1;//这个方法返回一周中的第几天
        if (newCourse.weekday == -1) newCourse.weekday = 6;//这是为了让周一变成0，周日变成6
        newCourse.startTime = newDay.getHours();
        alternativeTimeIntervals.push(newCourse);
      }
    }
    withStudentsCourse[course.id] = oldCourse;
    return res.send(alternativeTimeIntervals);
    // return dealAlternativeSend(alternativeTimeIntervals,i,course,res);
  }
  else {
    for(const student of course.students){
    structSchedule(student.id);//强制算一遍有tempwork和course的time_interval_list
    if (!isTimeIntervalCollision([...time_interval_list, ...proposedTimeIntervals]))
      time_interval_list.push(...proposedTimeIntervals);
    }
  }



    withStudentsCourse[course.id] = course;
    com_withStudentsCourse[Object.keys(com_withStudentsCourse).length + 1] = body;
    res.send("success");
  } else {
    res.send("not exist");
  }
});
/*以上为course增删改操作*/


/*以下为activity增删改操作*/
app.post("/api/addactivity", (req, res) => {
  let body = req.body;
  let course = body.msg ;
  let nextID = 0;
  let proposedTimeIntervals = [];
  let alternativeTimeIntervals = [];
  structSchedule(recentID.toString());//强制算一遍time_interval_list
  console.log("enter activity");
  switch (course.repeat.type) {
    case "once":
      console.log(time_interval_list);
      proposedTimeIntervals.push(convertToTimeInterval(course.repeat.day, course.startTime, 1));
      let i;
      if (isTimeIntervalCollision([...time_interval_list, ...proposedTimeIntervals])) {
        for (i = 1; alternativeTimeIntervals.length <= 3; i++) {
          console.log("p1 " + i);
          if(!isSameDay(course.repeat.day,course.startTime + i)) break;
          let alternativeTimeInterval: time_interval[] = [];
          alternativeTimeInterval.push(convertToTimeInterval(course.repeat.day, course.startTime + i, 1));
          // console.log(alternativeTimeInterval);
          // console.log(time_interval_list);
          if (!isTimeIntervalCollision([...time_interval_list, ...alternativeTimeInterval])) {
            console.log("p2 " + i);
            let newDay = new Date(alternativeTimeInterval[0].start);
            let newCourse = { ...course };
            newCourse.repeat.day = {
              year: newDay.getFullYear(),
              month: newDay.getMonth(),
              day: newDay.getDate()
            };
            newCourse.startTime = newDay.getHours();
            alternativeTimeIntervals.push(newCourse);
          }
        }
        // function dealAlternativeSend(alternativeTimeIntervals:any[],i:number,course:any){}
        // return dealAlternativeSend(alternativeTimeIntervals,i,course,res);
        return res.send(alternativeTimeIntervals);
      }
      else time_interval_list.push(...proposedTimeIntervals);
      break;

    case "weekly":
      console.log("dealing weekly");
      for (let i = course.repeat.startWeek; i <= course.repeat.endWeek; i++) {
        console.log("p1 " + i);
        proposedTimeIntervals.push(TimeStampConvertToTimeInterval(dayToDate(schedule.firstDay).getTime() + i * 7 * 24 * 3600 * 1000 + course.repeat.weekday * 24 * 3600 * 1000 + course.startTime * 3600 * 1000, 1));
      }
      if (isTimeIntervalCollision([...time_interval_list, ...proposedTimeIntervals])) {
        console.log("p2");
        let i=0;
        for (i = 1; alternativeTimeIntervals.length <= 3; i++) {
          console.log("p3 " + i);
          let alternativeTimeInterval = [];
          for (let TimeIntervalCount = 0; TimeIntervalCount < proposedTimeIntervals.length; TimeIntervalCount++) {
            alternativeTimeInterval.push({ start: proposedTimeIntervals[TimeIntervalCount].start + 3600 * 1000 * i, end: proposedTimeIntervals[TimeIntervalCount].end + 3600 * 1000 * i })
            console.log("p4 " + i);
            // if(!(i%5)) console.log(alternativeTimeInterval);
          }
          console.log("p5 ");
          if (!isTimeIntervalCollision([...time_interval_list, ...alternativeTimeInterval])) {
            let newDay = new Date(alternativeTimeInterval[0].start);
            let newCourse = { ...course };
            newCourse.repeat.weekday = newDay.getDay() - 1;//这个方法返回一周中的第几天
            if (newCourse.repeat.weekday == -1) newCourse.repeat.weekday = 6;//这是为了让周一变成0，周日变成6
            //我认为startweek和endweek应该不变，毕竟总能排到晚上去，如果要检查周数太麻烦了，先挖坑在此
            newCourse.startTime = newDay.getHours();
            alternativeTimeIntervals.push(newCourse);
          }
        }
        return res.send(alternativeTimeIntervals);
        // return dealAlternativeSend(alternativeTimeIntervals,i,course,res);
      }
      else time_interval_list.push(...proposedTimeIntervals);
      break;
    case "daily":
      for (let i = (dayToDate(course.repeat.endDay).getTime() - dayToDate(course.repeat.startDay).getTime()) / (24 * 3600 * 1000); i >= 0; i--)
        proposedTimeIntervals.push(convertToTimeInterval(course.repeat.startDay, course.startTime + 24 * i, 1));
      if (isTimeIntervalCollision([...time_interval_list, ...proposedTimeIntervals])) {
        let i;
        for (i = 1; alternativeTimeIntervals.length <= 3; i++) {
          let alternativeTimeInterval = [];
          for (let TimeIntervalCount = 0; TimeIntervalCount < proposedTimeIntervals.length; TimeIntervalCount++) alternativeTimeInterval.push({ start: proposedTimeIntervals[TimeIntervalCount].start + 3600 * 1000 * i, end: proposedTimeIntervals[TimeIntervalCount].end + 3600 * 1000 * i })
          if (!isTimeIntervalCollision([...time_interval_list, ...alternativeTimeInterval])) {
            let newDay = new Date(alternativeTimeInterval[0].start);
            let newCourse = { ...course };
            newCourse.repeat.startDay = {
              year: newDay.getFullYear(),
              month: newDay.getMonth(),
              day: newDay.getDate()
            };
            newDay = new Date(alternativeTimeInterval[alternativeTimeInterval.length - 1].start);
            newCourse.repeat.endDay = {
              year: newDay.getFullYear(),
              month: newDay.getMonth(),
              day: newDay.getDate()
            };
            newCourse.startTime = newDay.getHours();
            alternativeTimeIntervals.push(newCourse);
          }
        }
        return res.send(alternativeTimeIntervals);
        // return dealAlternativeSend(alternativeTimeIntervals,i,course,res);
      }
      else time_interval_list.push(...proposedTimeIntervals);
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
    res.send("not exist");
  }
});

app.post("/api/updactivity", (req, res) => {
  let body = req.body;
  let course = body.msg;
  //以下开始检测


  if (course.id in withStudentsActivity) {
    //先复制一份活动，然后把这个活动删掉，检测新的活动有没有时间冲突，如果有，再把老活动加回去；如果没冲突，就把新活动加进去
    let oldCourse = JSON.parse(JSON.stringify(withStudentsActivity[course.id]));
    delete withStudentsActivity[course.id];
    console.log(time_interval_list.length);
    structSchedule(recentID.toString());//这是在删除活动后，强制地再算一次time_interval_list
    let proposedTimeIntervals = [];
    let alternativeTimeIntervals = [];
    console.log("enter activity");
    switch (body.msg.repeat.type) {
      case "once":
        proposedTimeIntervals.push(convertToTimeInterval(course.repeat.day, course.startTime, 1));
        if (isTimeIntervalCollision([...time_interval_list, ...proposedTimeIntervals])) {
          let i;
          for (i = 1; alternativeTimeIntervals.length <= 3; i++) {
            let alternativeTimeInterval = convertToTimeInterval(course.repeat.day, course.startTime + i, 1);
            if (!isTimeIntervalCollision([...time_interval_list, alternativeTimeInterval])) {
              let newDay = new Date(alternativeTimeInterval.start);
              let newCourse = { ...course };
              newCourse.repeat.day = {
                year: newDay.getFullYear(),
                month: newDay.getMonth(),
                day: newDay.getDate()
              };
              newCourse.startTime = newDay.getHours();
              alternativeTimeIntervals.push(newCourse);
            }
          }
          withStudentsActivity[course.id] = oldCourse;
          return res.send(alternativeTimeIntervals);
          // return dealAlternativeSend(alternativeTimeIntervals,i,course,res);
        }
        else time_interval_list.push(...proposedTimeIntervals);
        break;

      case "weekly":
        console.log("dealing weekly");
        for (let i = course.repeat.startWeek; i <= course.repeat.endWeek; i++) {
          console.log("p1 " + i);
          proposedTimeIntervals.push(TimeStampConvertToTimeInterval(dayToDate(schedule.firstDay).getTime() + i * 7 * 24 * 3600 * 1000 + course.repeat.weekday * 24 * 3600 * 1000 + course.startTime * 3600 * 1000, 1));
        }
        if (isTimeIntervalCollision([...time_interval_list, ...proposedTimeIntervals])) {
          console.log("p2");
          let i;
          for (i = 1; alternativeTimeIntervals.length <= 3; i++) {
            console.log("p3 " + i);
            let alternativeTimeInterval = [];
            for (let TimeIntervalCount = 0; TimeIntervalCount < proposedTimeIntervals.length; TimeIntervalCount++) {
              alternativeTimeInterval.push({ start: proposedTimeIntervals[TimeIntervalCount].start + 3600 * 1000 * i, end: proposedTimeIntervals[TimeIntervalCount].end + 3600 * 1000 * i })
              console.log("p4 " + i);
              // if(!(i%5)) console.log(alternativeTimeInterval);
            }
            console.log("p5 ");
            if (!isTimeIntervalCollision([...time_interval_list, ...alternativeTimeInterval])) {
              let newDay = new Date(alternativeTimeInterval[0].start);
              let newCourse = { ...course };
              newCourse.repeat.weekday = newDay.getDay() - 1;//这个方法返回一周中的第几天
              if (newCourse.repeat.weekday == -1) newCourse.repeat.weekday = 6;//这是为了让周一变成0，周日变成6
              //我认为startweek和endweek应该不变，毕竟总能排到晚上去，如果要检查周数太麻烦了，先挖坑在此
              newCourse.startTime = newDay.getHours();
              alternativeTimeIntervals.push(newCourse);
            }
          }
          withStudentsActivity[course.id] = oldCourse;
          return res.send(alternativeTimeIntervals);
          // return dealAlternativeSend(alternativeTimeIntervals,i,course,res);
        }
        else time_interval_list.push(...proposedTimeIntervals);
        break;
      case "daily":
        for (let i = (dayToDate(course.repeat.endDay).getTime() - dayToDate(course.repeat.startDay).getTime()) / (24 * 3600 * 1000); i >= 0; i--)
          proposedTimeIntervals.push(convertToTimeInterval(course.repeat.startDay, course.startTime + 24 * i, 1));
        if (isTimeIntervalCollision([...time_interval_list, ...proposedTimeIntervals])) {
          let i;
          for (i = 1; alternativeTimeIntervals.length <= 3; i++) {
            let alternativeTimeInterval = [];
            for (let TimeIntervalCount = 0; TimeIntervalCount < proposedTimeIntervals.length; TimeIntervalCount++) alternativeTimeInterval.push({ start: proposedTimeIntervals[TimeIntervalCount].start + 3600 * 1000 * i, end: proposedTimeIntervals[TimeIntervalCount].end + 3600 * 1000 * i })
            if (!isTimeIntervalCollision([...time_interval_list, ...alternativeTimeInterval])) {
              let newDay = new Date(alternativeTimeInterval[0].start);
              let newCourse = { ...course };
              newCourse.repeat.startDay = {
                year: newDay.getFullYear(),
                month: newDay.getMonth(),
                day: newDay.getDate()
              };
              newDay = new Date(alternativeTimeInterval[alternativeTimeInterval.length - 1].start);
              newCourse.repeat.endDay = {
                year: newDay.getFullYear(),
                month: newDay.getMonth(),
                day: newDay.getDate()
              };
              newCourse.startTime = newDay.getHours();
              alternativeTimeIntervals.push(newCourse);
            }
          }
          withStudentsActivity[course.id] = oldCourse;
          return res.send(alternativeTimeIntervals);
          // return dealAlternativeSend(alternativeTimeIntervals,i,course,res);
        }
        else time_interval_list.push(...proposedTimeIntervals);
        break;
    }

    withStudentsActivity[course.id] = course;
    com_withStudentsActivity[Object.keys(com_withStudentsActivity).length + 1] = body;
    res.send("success");
  } else {
    res.send("not exist");
  }

});
/*以上为activity增删改操作*/


/*以下为tempwork增删改操作*/
app.post("/api/addtempwork", (req, res) => {
  let body = req.body;
  let course = body.msg;
  let nextID = 0;
  inDealingTempwork = true;
  structSchedule(recentID.toString());//强制算一遍没有tempwork的time_interval_list
  inDealingTempwork = false;
  let proposedTimeIntervals = [];
  let alternativeTimeIntervals = [];
  proposedTimeIntervals.push(convertToTimeInterval(course.day, course.time, 1));
  console.log(proposedTimeIntervals);
  if (isTimeIntervalCollision([...time_interval_list, ...proposedTimeIntervals])) {
    let i;
    for (i = 1; alternativeTimeIntervals.length <= 3; i++) {
      let alternativeTimeInterval = convertToTimeInterval(course.day, course.time + i, 1);
      if (!isTimeIntervalCollision([...time_interval_list, alternativeTimeInterval])) {
        let newDay = new Date(alternativeTimeInterval.start);
        let newCourse = { ...course };
        newCourse.day = {
          year: newDay.getFullYear(),
          month: newDay.getMonth(),
          day: newDay.getDate()
        };
        newCourse.time = newDay.getHours();
        alternativeTimeIntervals.push(newCourse);
      }
    }
    return res.send(alternativeTimeIntervals);
    // return dealAlternativeSend(alternativeTimeIntervals,i,course,res);
  }
  else {
    structSchedule(recentID.toString());//强制算一遍有tempwork的time_interval_list
    // console.log("p1  time_interval_list: ");
    // console.log(time_interval_list);
    // console.log("p1  proposedTimeIntervals: " );
    // console.log(proposedTimeIntervals);
    if (!isTimeIntervalCollision([...time_interval_list, ...proposedTimeIntervals]))
      time_interval_list.push(...proposedTimeIntervals);
  }

  for (const [key, value] of Object.entries(withStudentsTempwork)) {
    if (parseInt(key) > nextID) nextID = parseInt(key);
    // if (value.name == course.name) return res.status(401).send("already exist");
  }
  nextID++;
  // console.log("nextID: " + nextID.toString());
  // console.log(course);
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
    res.send("not exist");
  }
});

app.post("/api/updtempwork", (req, res) => {
  let body = req.body;
  let course = body.msg;

  inDealingTempwork = true;
  structSchedule(recentID.toString());//强制算一遍没有tempwork的time_interval_list
  inDealingTempwork = false;
  let proposedTimeIntervals = [];
  let alternativeTimeIntervals = [];
  proposedTimeIntervals.push(convertToTimeInterval(course.day, course.time, 1));
  console.log(proposedTimeIntervals);
  if (isTimeIntervalCollision([...time_interval_list, ...proposedTimeIntervals])) {
    let i;
    for (i = 1; alternativeTimeIntervals.length <= 3; i++) {
      let alternativeTimeInterval = convertToTimeInterval(course.day, course.time + i, 1);
      if (!isTimeIntervalCollision([...time_interval_list, alternativeTimeInterval])) {
        let newDay = new Date(alternativeTimeInterval.start);
        let newCourse = { ...course };
        newCourse.day = {
          year: newDay.getFullYear(),
          month: newDay.getMonth(),
          day: newDay.getDate()
        };
        newCourse.time = newDay.getHours();
        alternativeTimeIntervals.push(newCourse);
      }
    }
    return res.send(alternativeTimeIntervals);
    // return dealAlternativeSend(alternativeTimeIntervals,i,course,res);
  }
  else {
    structSchedule(recentID.toString());//强制算一遍有tempwork的time_interval_list
    if (!isTimeIntervalCollision([...time_interval_list, ...proposedTimeIntervals]))
      time_interval_list.push(...proposedTimeIntervals);
  }

  if (course.id in withStudentsTempwork) {
    withStudentsTempwork[course.id] = course;
    com_withStudentsTempwork[Object.keys(com_withStudentsTempwork).length + 1] = body;
    res.send("success");
  } else {
    res.send("not exist");
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
  time_interval_list = [];
  let mySchedule = JSON.parse(JSON.stringify(schedule));


  if(id=="-1"){
    for(const[key,value]of Object.entries(withStudentsCourse)){
      value["id"] = key;
      mySchedule.courses.push(value);

      for (let i = value.startWeek; i <= value.endWeek; i++){
        let t={
          start: dayToDate(schedule.firstDay).getTime() + i * 7 * 24 * 3600 * 1000 + value.weekday * 24 * 3600 * 1000 + value.startTime * 3600 * 1000,
          end: dayToDate(schedule.firstDay).getTime() + i * 7 * 24 * 3600 * 1000 + value.weekday * 24 * 3600 * 1000 + (value.startTime + value.duration) * 3600 * 1000
        };
        if(!isTimeIntervalCollision([...time_interval_list,t]))
          time_interval_list.push(t);
      }
      if (value.examInfo){
        let t={
          start: dayToDate(value.examInfo.day).getDate() + value.examInfo.startTime * 3600 * 1000,
          end: dayToDate(value.examInfo.day).getDate() + (value.examInfo.startTime + value.examInfo.duration) * 3600 * 1000
        };
        if(!isTimeIntervalCollision([...time_interval_list,t]))
          time_interval_list.push(t);
      }
    }
    return mySchedule;
  }


  for (const [key, value] of Object.entries(withStudentsCourse)) {
    for (const student of value.students) {
      if (student.id == id) {
        if (isAtPresent && value.name.includes("喵喵")) continue;
        value["id"] = key;
        mySchedule.courses.push(value);
        if (!is_time_interval_list_structed) {//如果还没有构造过time_interval_list，才构造它
          for (let i = value.startWeek; i <= value.endWeek; i++){
            let t={
              start: dayToDate(schedule.firstDay).getTime() + i * 7 * 24 * 3600 * 1000 + value.weekday * 24 * 3600 * 1000 + value.startTime * 3600 * 1000,
              end: dayToDate(schedule.firstDay).getTime() + i * 7 * 24 * 3600 * 1000 + value.weekday * 24 * 3600 * 1000 + (value.startTime + value.duration) * 3600 * 1000
            };
            if(!isTimeIntervalCollision([...time_interval_list,t]))
              time_interval_list.push(t);
          }
          if (value.examInfo){
            let t={
              start: dayToDate(value.examInfo.day).getDate() + value.examInfo.startTime * 3600 * 1000,
              end: dayToDate(value.examInfo.day).getDate() + (value.examInfo.startTime + value.examInfo.duration) * 3600 * 1000
            };
            if(!isTimeIntervalCollision([...time_interval_list,t]))
              time_interval_list.push(t);
          }
        }
      }
    }
  }
  for (const [key, value] of Object.entries(withStudentsActivity)) {
    for (const student of value.students) {
      if (student.id == id) {
        if (isAtPresent && value.name.includes("喵喵")) continue;
        value["id"] = key;
        mySchedule.activities.push(value);
        if (!is_time_interval_list_structed&&!inDealingActivity) {
          switch (value.repeat.type) {
            case "once":
              let t={
                start: dayToDate(value.repeat.day).getTime() + value.startTime * 3600 * 1000,
                end: dayToDate(value.repeat.day).getTime() + (value.startTime + 1) * 3600 * 1000
              };
              if(!isTimeIntervalCollision([...time_interval_list,t]))
              time_interval_list.push(t);
              break;
            case "weekly":
              for (let i = value.repeat.startWeek; i <= value.repeat.endWeek; i++){
                let t={
                  start: dayToDate(schedule.firstDay).getTime() + i * 7 * 24 * 3600 * 1000 + value.repeat.weekday * 24 * 3600 * 1000 + value.startTime * 3600 * 1000,
                  end: dayToDate(schedule.firstDay).getTime() + i * 7 * 24 * 3600 * 1000 + value.repeat.weekday * 24 * 3600 * 1000 + (value.startTime + 1) * 3600 * 1000
                };
                if(!isTimeIntervalCollision([...time_interval_list,t]))
                  time_interval_list.push(t);
              }
              break;
            case "daily":
              for (let i = dayToDate(value.repeat.startDay).getTime(); i <= dayToDate(value.repeat.endDay).getTime(); i += 24 * 3600 * 1000){
                let t={
                  start: i + value.startTime * 3600 * 1000,
                  end: i + (value.startTime + 1) * 3600 * 1000
                };
                if(!isTimeIntervalCollision([...time_interval_list,t]))
                  time_interval_list.push(t);
              }
              break;
          }
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
        if (!is_time_interval_list_structed && !inDealingTempwork) {
          let t={
            start: dayToDate(value.day).getTime() + value.time * 3600 * 1000,
            end: dayToDate(value.day).getTime() + (value.time + 1) * 3600 * 1000
          };
          if(!isTimeIntervalCollision([...time_interval_list,t]))
            time_interval_list.push(t);
        }
      }
    }
  }
  time_interval_list.sort((a, b) => a.start - b.start);//基于start升序排列
  console.log("struct!");
  console.log(time_interval_list);
  is_time_interval_list_structed = false;
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



function convertToTimeInterval(day: Day, startTime: number, duration: number): time_interval {
  let start = dayToDate(day).getTime() + startTime * 3600 * 1000;
  let end = start + duration * 3600 * 1000;
  return { start, end };
}

function TimeStampConvertToTimeInterval(TimeStamp: number, duration: number): time_interval {
  let start = TimeStamp;
  let end = start + duration * 3600 * 1000;
  return { start, end };
}

function isTimeIntervalCollision(timeIntervals: time_interval[]): boolean {
  let sortedIntervals = [...timeIntervals].sort((a, b) => a.start - b.start);
  // console.log(sortedIntervals);
  for (let i = 1; i < sortedIntervals.length; i++) {
    // if(sortedIntervals[i].start==sortedIntervals[i-1].start&&sortedIntervals[i].end==sortedIntervals[i-1].end) continue;
    if (sortedIntervals[i].start < sortedIntervals[i - 1].end) return true;
  }
  return false;
}

function isSameDay(day:Day, startTime:number):boolean{
  let start = dayToDate(day).getTime() + startTime * 3600 * 1000;
  let Day1=new Date(start);
  let Day2=dayToDate(day);
  return Day1.getFullYear()==Day2.getFullYear()&&Day1.getMonth()==Day2.getMonth()&&Day1.getDate()==Day2.getDate();
}

function countCollision(timeIntervals: time_interval[]):number{
  let sortedIntervals = [...timeIntervals].sort((a, b) => a.start - b.start);
  let count=0;
  for (let i = 1; i < sortedIntervals.length; i++) {
    if (sortedIntervals[i].start < sortedIntervals[i - 1].end) count++;
  }
  return count;
}

// function dealAlternativeSend(alternativeTimeIntervals:any[],i:number,course:Activity|Tempwork|Course&{students:User[]},res:any){
//   let collisionCountList:{"time":number,"count":number}[] = [];
//         if(alternativeTimeIntervals.length == 0){
//           switch(course.collective){
//           case true:
//           // for(const student of course.students){//我的期望是通过循环传入的其中的各个学生，来实现构造不同的time_interval_list
//             for(let j=1;j<i;j++){
//               collisionCountList.push({
//                 count:countCollision([...time_interval_list,convertToTimeInterval(course.repeat.day, course.startTime + j, 1)]),
//                 time:convertToTimeInterval(course.repeat.day, course.startTime + j, 1).start
//               });//等会通过改代码来实现在父函数中直接把多个convertToTimeInterval的结果传入的功能。因为不同类型的时间表示方法不统一
//               collisionCountList.sort((a,b)=>a.count-b.count);
//               for(let k=0;k<3;k++){
//                 let newDay = new Date(collisionCountList[k].time);
//                 let newCourse = { ...course };
//                 newCourse.repeat.day = {
//                   year: newDay.getFullYear(),
//                   month: newDay.getMonth(),
//                   day: newDay.getDate()
//                 };
//                 newCourse.startTime = newDay.getHours();//输出格式等会根据course的不同类型来分别实现
//                 alternativeTimeIntervals.push(newCourse);
//               }
//               return res.send(alternativeTimeIntervals);
//             }
//           case false:
//             return res.send("no alternative");
//           }
//       }
//       else
//         return res.send(alternativeTimeIntervals);
// }