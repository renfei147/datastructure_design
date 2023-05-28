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
import { PropType } from 'vue';
import { Event } from '../services/core'
import { dialogs } from '../services/dialogs';
export default {
  components: {
    FullCalendar
  },
  props: {
    events: Object as PropType<Event[] | null>,
    now: { type: Number, default: Date.now },
  },
  data() {
    const self = this;
    return {
      calendarOptions: {
        plugins: [timeGridPlugin, dayGridPlugin, listPlugin],
        initialView: 'timeGridWeek',
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
        eventClick(info) {
          dialogs.detailDialog?.open(info.event.extendedProps['sourceType'], 'readonly', info.event.extendedProps['source'], async () => true);
        }
      } as CalendarOptions
    }
  },
  watch: {
    events: {
      immediate: true,
      handler() {
        let todayIndicatorEvent = {
          start: this.now,
          allDay: true,
          display: 'background',
          backgroundColor: 'rgba(255,220,40,0.5)',
        }
        const calendarEvents: EventInput[] = [todayIndicatorEvent];
        if (this.events) {
          for (const i of this.events) {
            calendarEvents.push({
              ...i,
              title: i.source.name,
              start: i.start,
              end: i.end,
              backgroundColor: i.sourceType == 'course' ? undefined : (i.sourceType == 'activity' ? '#ff00aa' : '#55dd55'),
            })
          }
        }
        this.calendarOptions.events = calendarEvents;
      }
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