import { dayToDate } from "../../common/day";
import { Activity, Course, Schedule, Tempwork } from "../../common/definitions";

export type Event = { start: number, end: number } & (
  { sourceType: 'course', source: Course } |
  { sourceType: 'activity', source: Activity } |
  { sourceType: 'tempwork', source: Tempwork }
)

export interface Alarm {
  description: string;
  event?: Event;
}

const hour = 1000 * 60 * 60;
const day = hour * 24;
const week = day * 7;

export class Scheduler {
  readonly events: Event[];
  private nextEvent: number;

  constructor(private schedule: Schedule, private now: number) {
    const baseDate = dayToDate(this.schedule.firstDay);
    if (baseDate.getDay() !== 1) throw new Error("Not Monday");
    const baseTime = baseDate.getTime();

    this.events = [];
    for (const i of this.schedule.courses) {
      for (let w = i.startWeek; w <= i.endWeek; w++) {
        const start = baseTime + (w - 1) * week + i.weekday * day + i.startTime * hour;
        this.events.push({
          start,
          end: start + i.duration * hour,
          sourceType: 'course',
          source: i,
        });
      }
    }
    for (const i of this.schedule.activities) {
      if (i.repeat.type === 'once') {
        const start = dayToDate(i.repeat.day).getTime() + i.startTime * hour;
        this.events.push({
          start,
          end: + start + hour,
          sourceType: 'activity',
          source: i,
        });
      } else if (i.repeat.type === 'daily') {
        const startDay = dayToDate(i.repeat.startDay).getTime();
        const endDay = dayToDate(i.repeat.endDay).getTime();
        for (let d = startDay; d <= endDay; d += day) {
          const start = d + i.startTime * hour;
          this.events.push({
            start,
            end: + start + hour,
            sourceType: 'activity',
            source: i,
          });
        }
      } else if (i.repeat.type === 'weekly') {
        for (let w = i.repeat.startWeek; w <= i.repeat.endWeek; w++) {
          const start = baseTime + (w - 1) * week + i.repeat.weekday * day + i.startTime * hour;
          this.events.push({
            start,
            end: start + hour,
            sourceType: 'activity',
            source: i,
          });
        }
      }
    }
    for (const i of this.schedule.tempworks) {
      const start = dayToDate(i.day).getTime() + i.time * hour;
      this.events.push({
        start,
        end: start + hour,
        sourceType: 'tempwork',
        source: i,
      });
    }
    this.events.sort((a, b) => a.start - b.start);

    this.nextEvent = 0;
    while (this.nextEvent < this.events.length && this.events[this.nextEvent].start - hour <= now) {
      this.nextEvent++;
    }
  }

  resetNow(now: number) {
    this.now = now;
    this.nextEvent = 0;
    while (this.nextEvent < this.events.length && this.events[this.nextEvent].start - hour <= now) {
      this.nextEvent++;
    }
  }

  advanceNow(now: number) {
    if (now < this.now) throw new Error("Now is not increasing")
    const alarms: Alarm[] = [];
    while (this.nextEvent < this.events.length && this.events[this.nextEvent].start - hour <= now) {
      const source = this.events[this.nextEvent].source;
      let description = this.events[this.nextEvent].source.name + '将在一小时后开始';
      if (source.placeInfo.type === 'online') {
        description += ' 在线链接为' + source.placeInfo.link;
      } else {
        description += ' 地点为' + source.placeInfo.id + source.placeInfo.detail;
      }
      alarms.push({
        description,
        event: this.events[this.nextEvent]
      });
      this.nextEvent++;
    }
    if (new Date(this.now).getHours() < 21 && new Date(now).getHours() >= 21) {
      const tmp = new Date(now + day * 2);
      tmp.setHours(0, 0, 0, 0);
      const endOfTomorrow = tmp.getTime();
      const tomorrowCourseList = [];
      for (let i = this.nextEvent; i < this.events.length && this.events[i].start < endOfTomorrow; i++) {
        if (this.events[i].sourceType === 'course') {
          tomorrowCourseList.push(this.events[i].source.name);
        }
      }
      if (tomorrowCourseList.length > 0) {
        alarms.push({
          description: '明天的课程有 ' + tomorrowCourseList.join(', ') + ' 请做好准备'
        });
      }
    }
    this.now = now;
    return alarms;
  }
}