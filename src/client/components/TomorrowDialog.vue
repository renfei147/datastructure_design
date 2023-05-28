<template>
  <el-dialog v-model="visible" title="明日事件提醒">
    <el-empty v-if="events.length === 0" description="明天的你有点闲哦~" />
    <el-table v-else :data="tableData" stripe style="width: 100%">
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="time" label="时间" />
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="visible = false">确认</el-button>
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
      events: [] as Event[]
    }
  },

  computed: {
    tableData() {
      return this.events.map(i => ({
        type: typeToStr(i.sourceType),
        name: i.source.name,
        time: `${new Date(i.start).getHours()}:00 - ${new Date(i.end).getHours()}:00`
      }))
    }
  },

  methods: {
    open(events: Event[]) {
      this.visible = true;
      this.events = events;
    }
  },

  mounted() {
    dialogs.tomorrowDialog = this;
  }
}
</script>