<template>
  <el-menu class="header" mode="horizontal" default-active="1">
    <el-icon>
      <User />
    </el-icon>
    {{ username }}
    <el-button text @click="logout">退出</el-button>
    <div class="flex-grow"></div>
    <el-menu-item class="menu-item" index="1" @click="activeTab = 'calendar'">日程表</el-menu-item>
    <el-menu-item class="menu-item" index="2" @click="activeTab = 'course'">课程管理</el-menu-item>
    <el-menu-item class="menu-item" index="3" @click="activeTab = 'management'">事务管理</el-menu-item>
    <el-menu-item class="menu-item" index="4" @click="activeTab = 'map'">地图</el-menu-item>
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

  <div v-if="activeTab === 'calendar'" class="container">
    <Calendar class="small" :events="scheduler?.events" :now="now" />
  </div>
  <div v-else-if="activeTab === 'course'" class="container">
    <el-input class="flex-grow" v-model="courseSearchInput" placeholder="查找名称">
      <template #prefix>
        <el-icon>
          <Search />
        </el-icon>
      </template>
    </el-input>
    <el-table :data="courseTableData" stripe style="width: 100%">
      <el-table-column prop="id" label="编号" width="100" sortable />
      <el-table-column prop="name" label="名称" sortable />
      <el-table-column prop="time" label="上课时间" width="250" sortable />
      <el-table-column prop="place" label="上课地点" width="250" sortable />
      <el-table-column prop="exam" label="考试" width="250" sortable />
    </el-table>
  </div>
  <div v-else-if="activeTab === 'management'" class="container">
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
    <el-table :data="pagedTableData" stripe>
      <el-table-column prop="type" label="类型" width="100" sortable />
      <el-table-column prop="name" label="名称" sortable />
      <el-table-column prop="time" label="时间" width="250" sortable />
      <el-table-column prop="place" label="地点" width="250" sortable />
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
    <div style="text-align: center;">
      <el-pagination layout="prev, pager, next" v-model:currentPage="currentPage" :total="filteredTableData.length"
        :page-size="15" />
    </div>
  </div>
  <div v-else class="container">
    <div v-if="pathType != 'none'">
      <div>
        起点：
        <el-select v-model="startLocation" filterable placeholder="选择地点" style="width:150px;margin-right: 10px;">
          <el-option v-for="i in displayLocations" :key="i.id" :label="i.name" :value="i.id" />
        </el-select>
      </div>
      <div>
        {{ endOrPassLocationsText }}
      </div>
    </div>
    <div class="map-container">
      <MapComponent :path="path" />
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
  width: 80%;
  margin: 0 auto;
  padding-top: 60px;
}

.map-container {
  text-align: center;
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
import { AlarmData, Scheduler } from '../services/core';
import data from '../services/data';
import { User, Clock, Search, Plus } from '@element-plus/icons-vue'
import { Activity, Schedule, Tempwork } from '../../common/definitions';
import { dialogs } from '../services/dialogs'
import { dayToStr } from '../../common/day';
import { courseToString, tempworkToString, activityToString, placeToStr } from '../services/format';
import { displayLocations, mapInfo } from '../services/map';
import { h } from 'vue';

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
      activeTab: 'calendar' as ('calendar' | 'course' | 'management' | 'map'),
      searchInput: '',
      courseSearchInput: '',
      displayLocations,
      pathType: 'none' as 'none' | 'shortest' | 'tsp',
      startLocation: 54,
      endLocation: 0,
      passLocations: [] as number[],
      path: [] as number[],
      currentPage: 1
    }
  },
  computed: {
    courseTableData() {
      if (!this.schedule) return [];
      return this.schedule.courses.map(i => ({
        source: i,
        id: i.id,
        name: i.name,
        time: courseToString(i),
        place: placeToStr(i.placeInfo),
        exam: i.examInfo
          ? `${dayToStr(i.examInfo.day)} ${i.examInfo.startTime}:00-${i.examInfo.startTime + i.examInfo.duration}:00 ${placeToStr(i.examInfo.placeInfo)}`
          : '未安排'
      }))
    },
    filteredCourseTableData() {
      return this.courseTableData.filter(
        (data) =>
          !this.courseSearchInput ||
          data.name.toLowerCase().includes(this.courseSearchInput.toLowerCase())
      )
    },
    tableData() {
      if (!this.schedule) return [];
      const result = [];
      for (const i of this.schedule.tempworks) {
        result.push({
          source: i,
          type: '临时事务',
          name: i.name,
          time: tempworkToString(i),
          place: placeToStr(i.placeInfo)
        })
      }
      for (const i of this.schedule.activities) {
        result.push({
          source: i,
          type: '课外活动',
          name: i.name,
          time: activityToString(i),
          place: placeToStr(i.placeInfo)
        })
      }
      return result;
    },
    filteredTableData() {
      return this.tableData.filter(
        (data) =>
          !this.searchInput ||
          data.name.toLowerCase().includes(this.searchInput.toLowerCase())
      )
    },
    pagedTableData() {
      return this.filteredTableData.slice((this.currentPage - 1) * 15, this.currentPage * 15);
    },
    endOrPassLocationsText() {
      if (this.pathType == 'shortest') {
        return "终点：" + mapInfo[this.endLocation].name;
      } else {
        return "途经点：" + this.passLocations.map(i => mapInfo[i].name).join(' ');
      }
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
      if (!this.scheduler) return;
      this.now += 60000;
      this.handleAlarm(this.scheduler.advanceNow(this.now));
    },
    nextHour() {
      if (!this.scheduler) return;
      this.now += 60000 * 60;
      this.handleAlarm(this.scheduler.advanceNow(this.now));
    },
    handleAlarm(alarm: AlarmData) {
      if (alarm.tomorrowEvents.length > 0) {
        dialogs.tomorrowDialog?.open(alarm.tomorrowEvents);
      }
      if (alarm.events.length > 0) {
        this.pathType = 'none';
        dialogs.alarmDialog?.open(alarm.events, () => { this.activeTab = 'map' });
        if (alarm.events[0].sourceType != 'tempwork') {
          if (alarm.events[0].source.placeInfo.type == 'offline') {
            this.pathType = 'shortest';
            this.endLocation = alarm.events[0].source.placeInfo.id;
            this.requestPath();
          }
        } else {
          const locations = [];
          for (const i of alarm.events) {
            if (i.source.placeInfo.type == 'offline') {
              locations.push(i.source.placeInfo.id);
            }
          }
          if (locations.length > 0) {
            this.pathType = 'tsp';
            this.passLocations = locations;
            this.requestPath();
          }
        }
      }
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
    addActivity() {
      dialogs.detailDialog?.open('activity', 'new', null,
        async (newActivity: Activity) => {
          const res = await data.add('activity', {
            ...newActivity,
            students: [{
              id: data.getUserId(),
              name: this.username
            }]
          });
          if (res == true) {
            this.reloadSchedule();
            return true;
          } else {
            const alt = res as Activity[];
            let ps = [h('p', {}, '时间冲突，以下是备选时间：')];
            for (const i of alt) {
              ps.push(h('p', {}, activityToString(i)));
            }
            ElMessageBox.alert(h('div', {}, ps), '冲突提醒', { center: true });
            return false;
          }
        });
    },
    editActivity(activity: Activity) {
      dialogs.detailDialog?.open('activity', 'edit', activity,
        async (newActivity: Activity) => {
          const res = await data.update('activity', {
            ...newActivity,
            students: [{
              id: data.getUserId(),
              name: this.username
            }]
          });
          if (res == true) {
            this.reloadSchedule();
            return true;
          } else {
            const alt = res as Activity[];
            let ps = [h('p', {}, '时间冲突，以下是备选时间：')];
            for (const i of alt) {
              ps.push(h('p', {}, activityToString(i)));
            }
            ElMessageBox.alert(h('div', {}, ps), '冲突提醒', { center: true });
            return false;
          }
        }
      );
    },
    async delActivity(activity: Activity) {
      await data.del('activity', activity.id);
      this.reloadSchedule();
    },
    async addTempwork() {
      dialogs.detailDialog?.open('tempwork', 'new', null,
        async (newTempwork: Tempwork) => {
          const res = await data.add('tempwork', {
            ...newTempwork,
            students: [{
              id: data.getUserId(),
              name: this.username
            }]
          });
          if (res == true) {
            this.reloadSchedule();
            return true;
          } else {
            const alt = res as Tempwork[];
            let ps = [h('p', {}, '时间冲突，以下是备选时间：')];
            for (const i of alt) {
              ps.push(h('p', {}, tempworkToString(i)));
            }
            ElMessageBox.alert(h('div', {}, ps), '冲突提醒', { center: true });
            return false;
          }
        }
      );
    },
    async editTempwork(tempwork: Tempwork) {
      await dialogs.detailDialog?.open('tempwork', 'edit', tempwork
        , async (newTempwork: Tempwork) => {
          const res = await data.update('tempwork', {
            ...newTempwork,
            students: [{
              id: data.getUserId(),
              name: this.username
            }]
          });
          if (res == true) {
            this.reloadSchedule();
            return true;
          } else {
            const alt = res as Tempwork[];
            let ps = [h('p', {}, '时间冲突，以下是备选时间：')];
            for (const i of alt) {
              ps.push(h('p', {}, tempworkToString(i)));
            }
            ElMessageBox.alert(h('div', {}, ps), '冲突提醒', { center: true });
            return false;
          }
        }
      );
    },
    async delTempwork(tempwork: Tempwork) {
      await data.del('tempwork', tempwork.id);
      this.reloadSchedule();
    },
    async reloadSchedule() {
      this.schedule = await data.getSchedule();
      this.scheduler = new Scheduler(this.schedule, this.now);
    },
    async requestPath() {
      if (this.pathType == 'shortest') {
        this.path = (await data.getShortestPath(this.startLocation, this.endLocation)).path;
      } else if (this.pathType == 'tsp') {
        this.path = (await data.getTSP([this.startLocation, ...this.passLocations, this.startLocation])).path;
      }
    }
  },

  watch: {
    startLocation() {
      this.requestPath();
    }
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