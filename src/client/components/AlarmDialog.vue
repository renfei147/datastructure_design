<template>
  <el-dialog v-model="visible" title="闹钟提醒">
    <template v-if="isTempwork">
      一小时后有以下临时事务：
      <p v-for="i of events">{{ i.source.name }}</p>
    </template>
    <template v-else>
      {{ message }}
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary" @click="gotoMap">路程导航</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
<script lang="ts">
import { Event } from '../services/core'
import { dialogs } from '../services/dialogs';
import { typeToStr } from '../services/format';
export default {
  data() {
    return {
      visible: false,
      events: [] as Event[],
      callback: null as null | (() => void)
    }
  },

  computed: {
    isTempwork() {
      return this.events.length > 0 && this.events[0].sourceType === 'tempwork';
    },
    message() {
      if (this.events.length === 0) return ''
      return typeToStr(this.events[0].sourceType) + ' ' + this.events[0].source.name + ' 将在一小时后开始'
    }
  },

  methods: {
    open(events: Event[], callback: () => void) {
      this.visible = true;
      this.events = events;
      this.callback = callback;
    },

    gotoMap() {
      this.visible = false;
      if (this.callback) this.callback();
    }
  },

  mounted() {
    dialogs.alarmDialog = this;
  }
}
</script>