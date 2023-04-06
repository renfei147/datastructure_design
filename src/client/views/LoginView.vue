<template>
  <h1 class="title">学生日程管理系统</h1>
  <h2 class="title">选择用户</h2>
  <div class="container">
    <p v-if="loading">加载中</p>
    <el-button v-for="user in users" @click="login(user)">
      {{ user.name }}
    </el-button>
  </div>
</template>
<style scoped>
.title {
  text-align: center;
}
</style>
<script lang="ts">
import { User } from '../../common/definitions';
import data from '../services/data';

export default {
  data() {
    return {
      users: [] as User[],
      loading: true,
    }
  },
  async created() {
    this.users = await data.getUsers$();
    this.loading = false;
  },
  methods: {
    login(user: User) {
      data.currentUser = user;
      this.$router.push('/');
    }
  }
}
</script>