<template>
  <h1 class="title">学生日程管理系统</h1>
  当前用户：{{ username }}
  <el-button @click="logout()">退出</el-button>
  <br>
  当前时间：
  {{ new Date(now).toLocaleString() }}
  <el-button @click="toggleTimer">
    {{ timerRunning ? '暂停' : '开始' }}
  </el-button>
  <el-button @click="nextHour">快进一小时</el-button>
  <el-button @click="setTime"> 设置时间 </el-button>
  <Calendar class="small" :events="scheduler?.events" :now="now" />

  <el-dialog v-model="dialogVisible" title="设置时间" width="400px">
    <el-date-picker class="date-picker" v-model="pickerDate" type="datetime" :clearable="false" />
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmTimeChange">确认</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.small {
  font-size: 80%;
}

.date-picker {
  text-align: center;
}

.title {
  text-align: center;
}

.info {
  margin-bottom: 10px;
}
</style>

<script lang="ts">
import { ElMessageBox, Action, ElMessage } from 'element-plus';
import Calendar from '../components/Calendar.vue'
import { Alarm, Scheduler } from '../services/core';
import data from '../services/data';
export default {
  components: {
    Calendar
  },
  data() {
    return {
      username: '',
      scheduler: null as Scheduler | null,
      now: Date.now(),
      pickerDate: new Date(),
      timer: 0,
      timerRunning: false,
      dialogVisible: false,
    }
  },
  methods: {
    logout() {
      data.currentUser = null;
      this.$router.push('/login');
    },
    timeChange(time: number) {
      this.now = time;
    },
    toggleTimer() {
      if (this.timerRunning) {
        this.timerRunning = false;
        window.clearInterval(this.timer);
      } else {
        this.timerRunning = true;
        this.timer = window.setInterval(this.tick, 10000 / 60);
      }
    },
    tick() {
      this.now += 60000;
      const alarms = this.scheduler?.advanceNow(this.now);
      if (alarms && alarms.length) this.raiseAlarms(alarms);
    },
    nextHour() {
      this.now += 60000 * 60;
      const alarms = this.scheduler?.advanceNow(this.now);
      if (alarms && alarms.length) this.raiseAlarms(alarms);
    },
    setTime() {
      if (this.timerRunning) this.toggleTimer();
      this.pickerDate = new Date(this.now);
      this.dialogVisible = true;
    },
    confirmTimeChange() {
      this.dialogVisible = false;
      this.now = this.pickerDate.getTime();
      this.scheduler?.resetNow(this.now);
    },
    raiseAlarms(alarms: Alarm[]) {
      for (const i of alarms) {
        ElMessageBox.alert(i.description, '提醒')
      }
    }
  },
  async mounted() {
    const user = data.currentUser;
    if (user === null) {
      this.$router.replace('/login');
    } else {
      this.username = user.name;
      const schedule = await data.getSchedule$();
      this.scheduler = new Scheduler(schedule, this.now);
      this.toggleTimer();
    }
  }
}
</script>