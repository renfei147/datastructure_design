export interface Day {
    year: number;
    month: number;
    day: number;
}

export function dayToDate(day: Day) {
    return new Date(day.year, day.month, day.day);
}

export function dayToStr(day: Day) {
    return `${day.month + 1}/${day.day}`;
}