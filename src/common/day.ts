export interface Day {
    year: number;
    month: number;
    day: number;
}

export function dateToDay(day: Date): Day {
    return {
        year: day.getFullYear(),
        month: day.getMonth(),
        day: day.getDate()
    }
}

export function dayToDate(day: Day) {
    return new Date(day.year, day.month, day.day);
}

export function dayToStr(day: Day) {
    return `${day.month + 1}月${day.day}日`;
}