<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import { CalendarOptions, EventInput } from '@fullcalendar/core'
import zhcnLocale from '@fullcalendar/core/locales/zh-cn'
import { Schedule } from '../../common/definitions';
import { PropType } from 'vue';
import { dayToDate } from '../../common/day';
export default {
  components: {
    FullCalendar
  },
  props: {
    schedule: {
      type: Object as PropType<Schedule | null>,
      default: { courses: [] }
    },
  },
  data() {
    return {
    }
  },
  computed: {
    calendarOptions(): CalendarOptions {
      const events = [];
      if (this.schedule) {
        const date = dayToDate(this.schedule.firstDay);
        if (date.getDay() !== 1) throw new Error("Not Monday");
        const baseTime = date.getTime();
        const hour = 1000 * 60 * 60;
        const day = hour * 24;
        const week = day * 7;
        for (const i of this.schedule.courses) {
          for (let w = i.startWeek; w <= i.endWeek; w++) {
            const start = baseTime + (w - 1) * week + i.weekday * day + i.startTime * hour;
            events.push({
              title: i.name,
              start,
              end: start + i.duration * hour,
            });
          }
        }
        for (const i of this.schedule.activities) {
          if (i.repeat.type === 'once') {
            const start = dayToDate(i.repeat.day).getTime() + i.startTime * hour;
            events.push({
              title: i.name,
              start,
              end: + start + hour,
              backgroundColor: '#ff00aa'
            });
          } else if (i.repeat.type === 'daily') {
            const startDay = dayToDate(i.repeat.startDay).getTime();
            const endDay = dayToDate(i.repeat.endDay).getTime();
            for (let d = startDay; d <= endDay; d += day) {
              const start = d + i.startTime * hour;
              events.push({
                title: i.name,
                start,
                end: + start + hour,
                backgroundColor: '#ff00aa'
              });
            }
          } else if (i.repeat.type === 'weekly') {
            for (let w = i.repeat.startWeek; w <= i.repeat.endWeek; w++) {
              const start = baseTime + (w - 1) * week + i.repeat.weekday * day + i.startTime * hour;
              events.push({
                title: i.name,
                start,
                end: start + hour,
                backgroundColor: '#ff00aa'
              });
            }
          }
        }
        for (const i of this.schedule.tempworks) {
          const start = dayToDate(i.day).getTime() + i.time * hour;
          events.push({
            title: i.name,
            start,
            end: start + hour,
            backgroundColor: '#55dd55'
          });
        }
      }
      return {
        plugins: [timeGridPlugin, dayGridPlugin, listPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listDay,listWeek'
        },
        locales: [zhcnLocale],
        locale: 'zh-cn',
        allDaySlot: false,
        events,
        aspectRatio: 1.5,
      }
    }
  }
}
</script>