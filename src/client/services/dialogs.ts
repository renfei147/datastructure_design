import DetailDialog from '../components/DetailDialog.vue';
import TomorrowDialog from '../components/TomorrowDialog.vue'
import AlarmDialog from '../components/AlarmDialog.vue'
import StudentListDialog from '../components/StudentListDialog.vue'

export const dialogs = {
  detailDialog: null as InstanceType<typeof DetailDialog> | null,
  tomorrowDialog: null as InstanceType<typeof TomorrowDialog> | null,
  alarmDialog: null as InstanceType<typeof AlarmDialog> | null,
  studentListDialog: null as InstanceType<typeof StudentListDialog> | null,
}