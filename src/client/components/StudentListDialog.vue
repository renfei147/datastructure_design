<template>
  <el-dialog v-model="visible" title="编辑选课学生">
    <div class="container">
      <el-transfer v-model="selected" :data="students" :titles="['未选课学生', '已选课学生']" filterable />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped>
.container {
  text-align: center;
}
</style>
<script lang="ts">
import data from '../services/data';
import { dialogs } from '../services/dialogs';

interface Option {
  key: string
  label: string
  disabled: boolean
}

export default {
  data() {
    return {
      visible: false,
      students: [] as Option[],
      selected: [] as string[],
      callback: null as (null | ((res: string[]) => Promise<boolean>)),
    }
  },
  methods: {
    open(selected: string[], callback: (res: string[]) => Promise<boolean>) {
      this.visible = true;
      this.selected = selected;
      this.callback = callback;
    },
    async confirm() {
      if (this.callback && await this.callback(this.selected)) this.visible = false;
    }
  },
  async mounted() {
    dialogs.studentListDialog = this;
    this.students = (await data.getUsers()).map(i => ({
      key: i.id,
      label: i.name,
      disabled: false,
    }));
  },
}
</script>