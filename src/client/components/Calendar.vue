<template>
  <FullCalendar ref="fullCalendar" :options="calendarOptions" />
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
    schedule: Object as PropType<Schedule | null>,
    now: { type: Number, default: Date.now },
  },
  data() {
    const self = this;
    return {
      calendarOptions: {
        plugins: [timeGridPlugin, dayGridPlugin, listPlugin],
        initialView: 'dayGridMonth',
        customButtons: {
          myToday: {
            text: '跳转到当天',
            click: () => {
              const api = (self.$refs.fullCalendar as InstanceType<typeof FullCalendar>).getApi();
              api.gotoDate(self.now);
            }
          }
        },
        buttonText: {
          listDay: '日列表',
          listWeek: '周列表',
        },
        headerToolbar: {
          left: 'prev,next myToday',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listDay,listWeek'
        },
        locales: [zhcnLocale],
        locale: 'zh-cn',
        allDaySlot: false,
        aspectRatio: 1.5,
      } as CalendarOptions
    }
  },
  watch: {
    schedule() {
      let todayIndicatorEvent = {
        start: this.now,
        allDay: true,
        display: 'background',
        backgroundColor: 'rgba(255,220,40,0.5)'
      }
      const events: EventInput[] = [todayIndicatorEvent];
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
      this.calendarOptions.events = events;
    },
    now(now: number) {
      let events: any = this.calendarOptions.events;
      if (events && events[0]) {
        events[0].start = now;
      }
    }
  },
}
</script>
<style>
:root {
  --fc-today-bg-color: rgba(0, 0, 0, 0) !important;
}
</style>