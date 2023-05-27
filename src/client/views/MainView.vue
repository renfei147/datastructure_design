<template>
  <el-menu class="header" mode="horizontal" default-active="1">
    <el-icon>
      <User />
    </el-icon>
    {{ username }}
    <el-button text @click="logout">退出</el-button>
    <div class="flex-grow"></div>
    <el-menu-item class="menu-item" index="1" @click="activeTab = 'calendar'">日程表</el-menu-item>
    <el-menu-item class="menu-item" index="2" @click="activeTab = 'management'">事务管理</el-menu-item>
    <el-menu-item class="menu-item" index="3" @click="activeTab = 'map'">地图</el-menu-item>
    <div class="flex-grow"></div>
    <el-icon>
      <Clock />
    </el-icon>
    {{ new Date(now).toLocaleString() }}
    <el-button-group>
      <el-button text @click="toggleTimer">
        {{ timerRunning ? '暂停' : '开始' }}
      </el-button>
      <el-button text @click="nextHour">快进一小时</el-button>
      <el-button text @click="setTime"> 设置时间 </el-button>
    </el-button-group>
  </el-menu>

  <div class="container">
    <div v-if="activeTab === 'calendar'">
      <Calendar class="small" :events="scheduler?.events" :now="now" />
    </div>
    <div v-else-if="activeTab === 'management'">
      <div style="display:flex;">
        <el-popover width="200px">
          <template #reference>
            <el-button type="primary">
              <el-icon>
                <Plus />
              </el-icon>
              添加
            </el-button>
          </template>
          <div>
            <el-button-group>
              <el-button @click="addActivity">课外活动</el-button>
              <el-button @click="addTempwork">临时事务</el-button>
            </el-button-group>
          </div>
        </el-popover>
        <el-input class="flex-grow" style="margin-left: 10px;" v-model="searchInput" placeholder="查找名称">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>
      <el-table :data="filterTableData" stripe>
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="name" label="名称" width="200" />
        <el-table-column prop="time" label="时间" />
        <el-table-column prop="place" label="地点" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <template v-if="scope.row.type == '课外活动'">
              <el-button link type="primary" @click="editActivity(scope.row.source)">编辑</el-button>
              <el-button link type="danger" @click="delActivity(scope.row.source)">删除</el-button>
            </template>
            <template v-else>
              <el-button link type="primary" @click="editTempwork(scope.row.source)">编辑</el-button>
              <el-button link type="danger" @click="delTempwork(scope.row.source)">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      <MapComponent />
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="设置时间" width="400px">
    <el-date-picker v-model="pickerDate" type="datetime" :clearable="false" />
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmTimeChange">确认</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  width: 65%;
  margin: 0 auto;
  padding-top: 60px;
}

.small {
  font-size: 80%;
}

.header {
  display: flex;
  align-items: center;
  padding: 0px 20px;
  width: 100%;
  position: fixed;
  background-color: #ffffff;
  z-index: 100;
}

.menu-item {
  height: 45px;
}

.flex-grow {
  text-align: center;
  flex-grow: 1;
}

.info {
  margin-bottom: 10px;
}
</style>

<script lang="ts">
import { ElMessageBox } from 'element-plus';
import Calendar from '../components/Calendar.vue'
import MapComponent from '../components/MapComponent.vue'
import { Alarm, Scheduler } from '../services/core';
import data from '../services/data';
import { User, Clock, Search, Plus } from '@element-plus/icons-vue'
import { Activity, Schedule, Tempwork } from '../../common/definitions';
import { dayToStr } from '../../common/day';
import { dialogs } from '../services/dialogs'

export default {
  components: {
    Calendar,
    User,
    Clock,
    Search,
    Plus,
    MapComponent,
  },
  data() {
    return {
      username: '',
      schedule: null as Schedule | null,
      scheduler: null as Scheduler | null,
      now: Date.now(),
      pickerDate: new Date(),
      timer: 0,
      timerRunning: false,
      dialogVisible: false,
      activeName: 'first',
      activeTab: 'calendar' as ('calendar' | 'management' | 'map'),
      searchInput: '',
    }
  },
  computed: {
    tableData() {
      if (!this.schedule) return [];
      const result = [];
      const localWeekday = ['一', '二', '三', '四', '五', '六', '日'];
      for (const i of this.schedule.tempworks) {
        result.push({
          source: i,
          type: '临时事务',
          name: i.name,
          time: `${dayToStr(i.day)} ${i.time}:00`,
          place: i.placeInfo.type === 'online'
            ? `线上 ${i.placeInfo.link}`
            : `${i.placeInfo.id}${i.placeInfo.detail}`,
        })
      }
      for (const i of this.schedule.activities) {
        result.push({
          source: i,
          type: '课外活动',
          name: i.name,
          time: (i.repeat.type === 'once'
            ? dayToStr(i.repeat.day)
            : i.repeat.type === 'daily'
              ? `${dayToStr(i.repeat.startDay)}-${dayToStr(i.repeat.endDay)}`
              : `第${i.repeat.startWeek}周到第${i.repeat.endWeek}周 每周${localWeekday[i.repeat.weekday]}`)
            + ' ' + `${i.startTime}:00-${i.startTime + 1}:00`,
          place: i.placeInfo.type === 'online'
            ? `线上 ${i.placeInfo.link}`
            : `${i.placeInfo.id}${i.placeInfo.detail}`,
        })
      }
      return result;
    },
    filterTableData() {
      return this.tableData.filter(
        (data) =>
          !this.searchInput ||
          data.name.toLowerCase().includes(this.searchInput.toLowerCase())
      )
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
    },
    async addActivity() {
      const newActivity = await dialogs.detailDialog?.open('activity', 'new') as Activity;
      await data.addActivity({
        ...newActivity,
        students: [{
          id: data.getUserId(),
          name: this.username
        }]
      });
      this.reloadSchedule();
    },
    async editActivity(activity: Activity) {
      const newActivity = await dialogs.detailDialog?.open('activity', 'edit', activity) as Activity;
      await data.updateActivity({
        ...newActivity,
        students: [{
          id: data.getUserId(),
          name: this.username
        }]
      });
      this.reloadSchedule();
    },
    async delActivity(activity: Activity) {
      await data.delActivity(activity.id);
      this.reloadSchedule();
    },
    async addTempwork() {
      const newTempwork = await dialogs.detailDialog?.open('tempwork', 'new') as Tempwork;
      await data.addTempwork({
        ...newTempwork,
        students: [{
          id: data.getUserId(),
          name: this.username
        }]
      });
      this.reloadSchedule();
    },
    async editTempwork(tempwork: Tempwork) {
      const newTempwork = await dialogs.detailDialog?.open('tempwork', 'edit', tempwork) as Tempwork;
      await data.updateTempwork({
        ...newTempwork,
        students: [{
          id: data.getUserId(),
          name: this.username
        }]
      });
      this.reloadSchedule();
    },
    async delTempwork(tempwork: Tempwork) {
      await data.delTempwork(tempwork.id);
      this.reloadSchedule();
    },
    async reloadSchedule() {
      this.schedule = await data.getSchedule();
      this.scheduler = new Scheduler(this.schedule, this.now);
    },
  },

  async mounted() {
    const user = data.currentUser;
    if (user === null) {
      this.$router.replace('/login');
    } else {
      this.username = user.name;
      await this.reloadSchedule();
      this.toggleTimer();
    }
  },

  unmounted() {
    if (this.timerRunning) {
      this.toggleTimer();
    }
  },
}
</script>