<template>
  <el-dialog v-model="visible" title="选课学生列表">
    <el-scrollbar height="400px">
      <el-checkbox-group v-model="selected">
        <el-checkbox v-for="i in students" :key="i.id" :label="i.name">
          {{ i.name }}
        </el-checkbox>
      </el-checkbox-group>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped></style>
<script lang="ts">
import { User } from '../../common/definitions';
import data from '../services/data';
import { dialogs } from '../services/dialogs';

export default {
  data() {
    return {
      visible: false,
      students: [] as User[],
      selected: [] as number[],
      callback: null as (null | ((res: number[]) => Promise<boolean>)),
    }
  },
  methods: {
    open(selected: number[], callback: (res: number[]) => Promise<boolean>) {
      this.selected = selected;
      this.callback = callback;
    },
    async confirm() {
      if (this.callback && await this.callback(this.selected)) this.visible = false;
    }
  },
  async mounted() {
    dialogs.studentListDialog = this;
    this.students = await data.getUsers();
  },
}
</script>