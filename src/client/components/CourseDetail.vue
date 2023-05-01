<template>
  <el-dialog v-model="dialogVisible" title="课程详情">
    <el-form :model="formData" label-width="120px">
      <el-form-item label="课程编号" prop="id">
        <el-input v-model="formData.id" />
      </el-form-item>
      <el-form-item label="课程名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('cancel')">取消</el-button>
        <el-button type="primary" @click="$emit('confirm')">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { PropType } from 'vue';
import { Course } from '../../common/definitions';

export default {
  events: ['cancel', 'confirm'],
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    },
    initial: {
      type: Object as PropType<Course | null>,
      default: null
    }
  },
  data() {
    return {
      formData: {
        id: this.initial?.id || '',
        name: this.initial?.name || '',
      }
    }
  }

}
</script>