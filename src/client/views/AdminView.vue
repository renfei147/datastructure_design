<template>
  <div class="container">
    <h2 class="title">课程管理员系统</h2>
    <div class="title">
      <el-button type="primary" @click="addCourse">
        <el-icon>
          <Plus />
        </el-icon>
        添加课程
      </el-button>
      <el-button @click="logout">退出</el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="编号" width="100" />
      <el-table-column prop="name" label="名称" width="150" />
      <el-table-column prop="time" label="上课时间" />
      <el-table-column prop="place" label="上课地点" />
      <el-table-column prop="exam" label="考试" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link type="primary" @click="editCourse(scope.row.source)">编辑</el-button>
          <el-button link type="danger" @click="delCourse(scope.row.source)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style scoped>
.container {
  width: 80%;
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
import { Course } from '../../common/definitions'
import data from '../services/data';
import { dialogs } from '../services/dialogs';
import { Plus } from '@element-plus/icons-vue'
export default {
  components: {
    Plus,
  },
  data() {
    return {
      courses: [] as Course[]
    }
  },
  computed: {
    tableData() {
      const localWeekday = ['一', '二', '三', '四', '五', '六', '日'];
      return this.courses.map(i => ({
        source: i,
        id: i.id,
        name: i.name,
        time: `第${i.startWeek}周-第${i.endWeek}周 每周${localWeekday[i.weekday]} ${i.startTime}:00-${i.startTime + i.duration}:00`,
        place: i.placeInfo.type === 'online'
          ? `线上 ${i.placeInfo.link}`
          : `${i.placeInfo.id}${i.placeInfo.detail}`,
        exam: i.examInfo === null
          ? '未安排'
          : `已安排`
      }))
    }
  },
  async created() {
    data.currentUser = { id: '1', name: 'a' };
    await this.reload();
  },
  methods: {
    logout() {
      data.currentUser = null;
      this.$router.push('/login');
    },
    async reload() {
      this.courses = (await data.getSchedule()).courses;
    },
    async addCourse() {
      const newCourse = await dialogs.detailDialog?.open('course', 'new') as Course;
      await data.addCourse({
        ...newCourse,
        students: await data.getUsers()
      });
      this.reload();
    },
    async editCourse(course: Course) {
      const newCourse = await dialogs.detailDialog?.open('course', 'edit', course) as Course;
      await data.updateCourse({
        ...newCourse,
        students: await data.getUsers()
      });
      this.reload();
    },
    async delCourse(id: string) {
      await data.delCourse(id);
      this.reload();
    }
  }
}
</script>