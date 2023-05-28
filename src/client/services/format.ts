import { dayToStr } from "../../common/day";
import { Activity, Course, Tempwork, PlaceInfo } from "../../common/definitions";
import { mapInfo } from "./map";

export const localWeekday = ['一', '二', '三', '四', '五', '六', '日'];

export function courseToString(i: Course) {
  return `第${i.startWeek}周-第${i.endWeek}周 每周${localWeekday[i.weekday]} ${i.startTime}:00-${i.startTime + i.duration}:00`;
}

export function activityToString(i: Activity) {
  let s = '';
  if (i.repeat.type === 'once') {
    s += dayToStr(i.repeat.day);
  } else if (i.repeat.type === 'daily') {
    s += `${dayToStr(i.repeat.startDay)}-${dayToStr(i.repeat.endDay)}`;
  } else {
    s += `第${i.repeat.startWeek}周到第${i.repeat.endWeek}周 每周${localWeekday[i.repeat.weekday]}`;
  }
  return s + ` ${i.startTime}:00-${i.startTime + 1}:00`;
}

export function tempworkToString(i: Tempwork) {
  return `${dayToStr(i.day)} ${i.time}:00`;
}


export function placeToStr(place: PlaceInfo) {
  if (place.type === 'online') {
    return `线上 ${place.link}`;
  }
  else {
    return `${mapInfo[place.id].name} ${place.detail}`;
  }
}

export function typeToStr(type: 'course' | 'activity' | 'tempwork') {
  if (type == 'course') return '课程';
  if (type == 'activity') return '课外活动';
  return '临时事务';
}