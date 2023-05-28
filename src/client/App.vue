<template>
  <RouterView />
  <DetailDialog />
  <TomorrowDialog />
  <AlarmDialog />
  <StudentListDialog />
</template>

<script lang="ts">
import DetailDialog from './components/DetailDialog.vue';
import TomorrowDialog from './components/TomorrowDialog.vue';
import AlarmDialog from './components/AlarmDialog.vue';
import StudentListDialog from './components/StudentListDialog.vue';

export default {
  components: {
    DetailDialog,
    TomorrowDialog,
    AlarmDialog,
    StudentListDialog
  },
}
</script>
