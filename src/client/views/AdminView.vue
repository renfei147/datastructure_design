<template>
  <div class="container">
    <div>
      <h2 class="title">课程管理员系统</h2>
    </div>
    <div style="display: flex;">
      <el-button type="primary" @click="addCourse">
        <el-icon>
          <Plus />
        </el-icon>
        添加课程
      </el-button>
      <el-input class="flex-grow" style="margin-left: 10px;margin-right: 10px;" v-model="searchInput" placeholder="查找名称">
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>
      <el-button @click="logout">退出</el-button>
    </div>
    <el-table :data="filteredTableData" stripe style="width: 100%">
      <el-table-column prop="id" label="编号" width="100" sortable />
      <el-table-column prop="name" label="名称" sortable />
      <el-table-column prop="time" label="上课时间" width="250" sortable />
      <el-table-column prop="place" label="上课地点" width="250" sortable />
      <el-table-column prop="exam" label="考试" width="250" sortable />
      <el-table-column fixed="right" label="操作" width="180">
        <template #default="scope">
          <el-button link type="primary" @click="editStudents(scope.row.source)">选择学生</el-button>
          <el-button link type="primary" @click="editCourse(scope.row.source)">编辑</el-button>
          <el-button link type="danger" @click="delCourse(scope.row.source)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style scoped>
.container {
  width: 90%;
  margin: 0 auto;
}

.title {
  text-align: center;
}

.header {
  display: flex;
  align-items: center;
  padding: 0px 20px;
  width: 100%;
  position: fixed;
  background-color: #ffffff;
  z-index: 100;
  height: 45px;
}

.menu-item {
  height: 45px;
}

.flex-grow {
  text-align: center;
  flex-grow: 1;
}
</style>
<script lang="ts">
import { ElMessageBox } from 'element-plus';
import { Course, User } from '../../common/definitions'
import { courseToString, placeToStr } from '../services/format'
import data from '../services/data';
import { dialogs } from '../services/dialogs';
import { Plus, Search } from '@element-plus/icons-vue'
import { dayToStr } from '../../common/day';
import { h } from 'vue';
export default {
  components: {
    Plus,
    Search,
  },
  data() {
    return {
      courses: [] as (Course & { students: User[] })[],
      searchInput: ''
    }
  },
  computed: {
    tableData() {
      return this.courses.map(i => ({
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
    filteredTableData() {
      return this.tableData.filter(
        (data) =>
          !this.searchInput ||
          data.name.toLowerCase().includes(this.searchInput.toLowerCase())
      )
    },
  },
  async created() {
    data.currentUser = { id: '-1', name: 'admin' };
    await this.reload();
  },
  methods: {
    logout() {
      data.currentUser = null;
      this.$router.push('/login');
    },
    async reload() {
      //@ts-ignore
      this.courses = (await data.getSchedule()).courses;
    },
    addCourse() {
      dialogs.detailDialog?.open('course', 'new', null,
        async (newCourse: Course) => {
          const res = await data.add('course', {
            ...newCourse,
            students: await data.getUsers()
          });
          if (res == true) {
            this.reload();
            return true;
          } else {
            const alt = res as Course[];
            let ps = [h('p', {}, '时间冲突，以下是备选时间：')];
            for (const i of alt) {
              ps.push(h('p', {}, courseToString(i)));
            }
            ElMessageBox.alert(h('div', {}, ps), '冲突提醒', { center: true });
            return false;
          }
        });
    },

    editStudents(course: Course & { students: User[] }) {
      dialogs.studentListDialog?.open(course.students.map(i => i.id),
        async (selected: string[]) => {
          const res = await data.update('course', {
            ...course,
            students: selected.map(i => ({ id: i, name: '' }))
          });
          if (res == true) {
            this.reload();
            return true;
          } else {
            const alt = res as Course[];
            let ps = [h('p', {}, '时间冲突，以下是备选时间：')];
            for (const i of alt) {
              ps.push(h('p', {}, courseToString(i)));
            }
            ElMessageBox.alert(h('div', {}, ps), '冲突提醒', { center: true });
            return false;
          }
        })
    },

    editCourse(course: Course) {
      dialogs.detailDialog?.open('course', 'edit', course,
        async (newCourse: Course) => {
          const res = await data.update('course', {
            ...newCourse,
            students: await data.getUsers()
          });
          if (res == true) {
            this.reload();
            return true;
          } else {
            const alt = res as Course[];
            let ps = [h('p', {}, '时间冲突，以下是备选时间：')];
            for (const i of alt) {
              ps.push(h('p', {}, courseToString(i)));
            }
            ElMessageBox.alert(h('div', {}, ps), '冲突提醒', { center: true });
            return false;
          }
        });
    },
    async delCourse(id: string) {
      await data.del('course', id);
      this.reload();
    }
  }
}
</script>