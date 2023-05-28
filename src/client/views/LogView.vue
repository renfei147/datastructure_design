<template>
  <h2 class="title">日志</h2>
  <div class="container">
    <div class="title">
      <el-button @click="back">
        返回
      </el-button>
    </div>
    <p v-for="i in list">
      {{ i.time }}
      {{ i.content.msg.duration ? '管理员' : i.content.command == 'del' ? '' : i.content.msg.students[0].name }}
      {{ i.content.command == 'add' ? '添加了' : i.content.command == 'update' ? '更新了' : '删除了' }}
    <pre>{{ i.content.msg }}</pre>
    </p>
  </div>
</template>
<style scoped>
.container {
  width: 60%;
  margin: 0 auto;
}

.title {
  text-align: center;
}
</style>
<script lang="ts">
import data from '../services/data';

export default {
  data() {
    return {
      log: '',
      list: [] as any[],
    };
  },
  methods: {
    back() {
      this.$router.back();
    },
  },
  async mounted() {
    this.list = await data.getLog();
    this.log = JSON.stringify(this.list, null, 2);
  },
};
</script>