<template>
  <h1 class="title">学生日程管理系统</h1>
  <div class="info">
    当前用户：{{ username }}<el-button @click="logout()">退出</el-button>
    <br>
    当前时间：{{ new Date().toLocaleString() }}
  </div>
  <Calendar class="small" :schedule="schedule" />
</template>

<style scoped>
.small {
  font-size: 80%;
}

.title {
  text-align: center;
}

.info {
  margin-bottom: 10px;
}
</style>

<script lang="ts">
import { Schedule } from '../../common/definitions';
import Calendar from '../components/Calendar.vue'
import data from '../services/data';
export default {
  components: {
    Calendar
  },
  data() {
    return {
      username: '',
      schedule: null as Schedule | null
    }
  },
  methods: {
    logout() {
      data.currentUser = null;
      this.$router.push('/login');
    }
  },
  async mounted() {
    const user = data.currentUser;
    if (user === null) {
      this.$router.replace('/login');
    } else {
      this.username = user.name;
      this.schedule = await data.getSchedule$();
    }
  }
}
</script>