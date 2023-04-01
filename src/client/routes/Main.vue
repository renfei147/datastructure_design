<template>
  <div class="container">
    <h1 class="title">学生日程管理系统</h1>
    <div>学生1</div>
    <Calendar />
  </div>
</template>

<style scoped>
.container{
  min-width: 800px;
}
.title {
  font-size: 2rem;
  text-align: center;
}
</style>

<script lang="ts">
import Calendar from '../components/Calendar.vue'
export default {
  components: {
    Calendar
  },
  data() {
    return {
    }
  }
}
</script>