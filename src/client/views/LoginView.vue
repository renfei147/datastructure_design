<template>
  <div class="container">
    <h1 class="title">学生日程管理系统</h1>
    <h2 class="title">选择用户</h2>
    <p v-if="loading">加载中</p>
    <div v-else>
      <div class="admin-login-button-container">
        <el-button class="login-button" @click="loginAsAdmin">
          管理员登录
        </el-button>
      </div>
      <div>
        <el-button class="login-button" v-for="user in users" @click="login(user)">
          {{ user.name }}
        </el-button>
      </div>
    </div>
  </div>

  <div>{{ shortest }}</div>
</template>
<style scoped>
.container {
  width: 60%;
  margin: 0 auto;
}

.title {
  text-align: center;
}

.admin-login-button-container {
  text-align: center;
}

.login-button {
  margin: 5px;
}


</style>
<script lang="ts">
import { User, ShortestPath} from '../../common/definitions';
import data from '../services/data';

export default {
  data() {
    return {
      users: [] as User[],
      loading: true,
      shortest:{} as ShortestPath
    }
  },
  async created() {
    this.users = await data.getUsers();
    this.loading = false;
    this.shortest = await data.getShortestPath$(1,0);
  },
  methods: {
    login(user: User) {
      data.currentUser = user;
      this.$router.push('/');
    },
    loginAsAdmin() {
      this.$router.push('/admin');
    }
  }
}
</script>