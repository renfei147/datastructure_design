<template>
  当前时间：{{ new Date(time).toLocaleString() }}
  <el-button @click="toggle()">
    {{ running ? '暂停' : '开始' }}
  </el-button>
  <el-button>设置时间</el-button>
  <el-button @click="fastForward()">快进一小时</el-button>
</template>

<script lang="ts">
let timer: number;
export default {
  emits: ['timeChange'],
  data() {
    return {
      running: true,
      time: Date.now(),
    }
  },
  methods: {
    toggle() {
      if (this.running) {
        this.running = false;
        window.clearInterval(timer);
      } else {
        this.running = true;
        timer = window.setInterval(this.tick, 10000 / 60);
      }
    },
    tick() {
      this.time += 60000;
      this.$emit('timeChange', this.time);
    },
    fastForward() {
      this.time += 60000 * 60;
      this.$emit('timeChange', this.time);
    }
  },
  mounted() {
    this.$emit('timeChange', this.time);
    timer = window.setInterval(this.tick, 10000 / 60);
  }
}
</script>