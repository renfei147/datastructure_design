import express from "express";
import ViteExpress from "vite-express";
import { Schedule, User } from "../common/definitions";
import { HashTable } from "./HashTable";
import fse from "fs-extra";


const app = express();

let users: User[] ;

let schedule: Schedule ;

let myHashTable=new HashTable();
myHashTable.put("shedule","my shedule");
console.log(myHashTable.find("shedule"));

// console.log(JSON.stringify(users));
fse.readJSON("src/server/schedule.json").then((data)=>{
  schedule=data;
});

fse.readJSON("src/server/users.json").then((data)=>{
  users=data;
});

app.use(express.json())

app.get("/api/users", (_, res) => {
  res.send(users);
});

app.get("/api/schedule", (_, res) => {
  res.send(schedule);
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
