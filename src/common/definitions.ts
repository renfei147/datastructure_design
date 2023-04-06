import { Day } from "./day";

export interface User {
    id: string;
    name: string;
}

export interface Schedule {
    firstDay: Day;//学期开始第一周的第一天（需要保证是周一）
    courses: Course[];
    activities: Activity[];
    tempworks: Tempwork[];
}

export interface OnlinePlace {
    type: 'online';
    link: string;
}

export interface OfflinePlace {
    type: 'offline';
    placeId: number;
    placeDetail: string;
}

export interface Course {
    id: string;
    name: string;
    startTime: number;//开始时刻（小时）
    duration: number;//持续时间（小时，可为1，2，3）
    weekday: number;//在周几上课
    startWeek: number;//从第几周开始上课
    endWeek: number;//到第几周结束
    placeInfo: OnlinePlace | OfflinePlace;
    examInfo?: {
        day: Day;
        startTime: number;
        duration: number;
        place: number;
    }
}

export interface Activity {
    id: string;
    name: string;
    startTime: number;//开始时刻（小时），课外活动始终持续一小时
    repeat: {
        type: 'once';
        day: Day;
    } | {
        type: 'daily';
        startDay: Day;
        endDay: Day;
    }
    | {
        type: 'weekly';
        weekday: number;
        startWeek: number;
        endWeek: number;
    }
    placeInfo: OnlinePlace | OfflinePlace;
}

export interface Tempwork {
    id: string;
    name: string;
    day: Day;
    time: number;//在这一小时内完成
    placeInfo: OnlinePlace | OfflinePlace;
}