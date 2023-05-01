import express from "express";
import ViteExpress from "vite-express";
import { Schedule, User } from "../common/definitions";

const app = express();

const users: User[] = [
  { name: '张三', id: '1' },
  { name: '李四', id: '2' },
  { name: '法伍', id: '3' },
  { name: '可爱软萌的猫娘女仆yya', id: '4' }];

const schedule: Schedule = {
  firstDay: { year: 2023, month: 3, day: 3 },
  courses: [
    {
      id: '1',
      name: '喵喵叫小课堂',
      startTime: 8,
      duration: 3,
      weekday: 2,
      startWeek: 1,
      endWeek: 10,
      placeInfo: {
        type: 'online',
        link: 'https://example.com',
      }
    }
  ],
  activities: [
    {
      id: '1',
      name: '练习喵喵叫',
      startTime: 13,
      repeat: {
        type: 'weekly',
        weekday: 4,
        startWeek: 1,
        endWeek: 10,
      },
      placeInfo: {
        type: 'online',
        link: 'https://example.com',
      }
    }
  ],
  tempworks: [
    {
      id: '1',
      name: '一个临时事务',
      day: { year: 2023, month: 3, day: 6 },
      time: 10,
      placeInfo: {
        type: 'online',
        link: 'https://example.com',
      }
    }
  ]
};

app.get("/api/users", (_, res) => {
  res.send(users);
});

app.get("/api/schedule", (_, res) => {
  res.send(schedule);
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
