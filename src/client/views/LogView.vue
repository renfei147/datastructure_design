<template>
  <h2 class="title">日志</h2>
  <div class="container">
    <div class="title">
      <el-button @click="back">
        返回
      </el-button>
    </div>
    <pre>
      {{ log }}
    </pre>
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
      log: ''
    };
  },
  methods: {
    back() {
      this.$router.back();
    },
  },
  async mounted() {
    this.log = JSON.stringify(await data.getLog(), null, 2);
    console.log(this.log);
  },
};
</script>