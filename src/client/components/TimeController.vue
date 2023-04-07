<template>
  当前时间：
  <el-date-picker :modelValue="time" @update:modelValue="time = $event.getTime()" type="datetime" :clearable="false" />
  <!-- {{ new Date(time).toLocaleString() }} -->
  <el-button @click="toggle">
    {{ running ? '暂停' : '开始' }}
  </el-button>
  <!-- <el-button @click="setTime"> 设置时间 </el-button> -->
  <el-button @click="fastForward">快进一小时</el-button>
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
    },
    fastForward() {
      this.time += 60000 * 60;
    },
    setTime() {

    },
    datePickerChange(e: Date) {
      console.log(e);
      this.time = e.getTime()
    }
  },
  mounted() {
    timer = window.setInterval(this.tick, 10000 / 60);
  },
  watch: {
    time() {
      this.$emit('timeChange', this.time);
    }
  }
}
</script>