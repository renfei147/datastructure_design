<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import { CalendarOptions } from '@fullcalendar/core'
import zhcnLocale from '@fullcalendar/core/locales/zh-cn'
export default {
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
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
      } as CalendarOptions
    }
  }
}
</script>