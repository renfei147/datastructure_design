<template>
  <el-dialog v-model="visible" :title="title">
    <el-form ref="form" :model="formData" :rules="rules" label-width="120px" :disabled="mode === 'readonly'">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" style="width:400px;" />
      </el-form-item>
      <el-form-item label="上课日期" v-if="type === 'course'">
        从第
        <el-input-number v-model="formData.startWeek" controls-position="right" :min="1" :max="12"
          style="width:80px;margin:0 10px;" />
        周到第
        <el-input-number v-model="formData.endWeek" controls-position="right" :min="1" :max="12"
          style="width:80px;margin:0 10px;" />
        周
        <el-select v-model="formData.weekday" style="width:100px; margin:0 10px;">
          <el-option v-for="i of week" :key="i.key" :value="i.key" :label="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="上课时间" v-if="type === 'course'">
        <el-time-select v-model="formData.startTime" start="8:00" step="1:00" end="19:00" format="H:mm" :clearable="false"
          style="width:120px;" />
        <span style="margin: 0 10px;">-</span>
        <el-time-select v-model="formData.endTime" :min-time="formData.startTime" start="8:00" step="01:00" end="20:00"
          format="H:mm" :clearable="false" style="width:120px;" />
      </el-form-item>
      <template v-if="type === 'activity'">
        <el-form-item label="重复方式">
          <el-radio-group v-model="formData.repeat">
            <el-radio label="once">单次</el-radio>
            <el-radio label="daily">每日</el-radio>
            <el-radio label="weekly">每周</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="日期" v-if="formData.repeat === 'once'">
          <el-date-picker v-model="formData.day" type="date" :clearable="false" />
        </el-form-item>
        <el-form-item label="日期" v-if="formData.repeat === 'daily'">
          <el-date-picker v-model="formData.startDay" type="date" :clearable="false" />
          <span style="margin: 0 10px;">-</span>
          <el-date-picker v-model="formData.endDay" type="date" :clearable="false" />
        </el-form-item>
        <el-form-item label="日期" v-if="formData.repeat === 'weekly'">
          从第
          <el-input-number v-model="formData.startWeek" controls-position="right" :min="1" :max="12"
            style="width:80px;margin:0 10px;" />
          周到第
          <el-input-number v-model="formData.endWeek" controls-position="right" :min="1" :max="12"
            style="width:80px;margin:0 10px;" />
          周
          <el-select v-model="formData.weekday" style="width:100px; margin:0 10px;">
            <el-option v-for="i of week" :key="i.key" :value="i.key" :label="i.value" />
          </el-select>
        </el-form-item>
      </template>
      <el-form-item label="时间" v-if="type !== 'course'">
        <el-time-select v-model="formData.startTime" start="8:00" step="1:00" end="19:00" format="H:mm" :clearable="false"
          style="width:120px;" />
        <span style="margin: 0 10px;">-</span>
        <el-time-select v-model="formData.endTime" :min-time="formData.startTime" start="8:00" step="01:00" end="20:00"
          format="H:mm" :clearable="false" disabled style="width:120px;" />
      </el-form-item>
      <el-form-item label="线下/线上">
        <el-radio-group v-model="formData.placeType">
          <el-radio label="offline">线下</el-radio>
          <el-radio label="online">线上</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="地点" v-if="formData.placeType == 'offline'">
        <el-select v-model="formData.placeId" filterable placeholder="选择地点" style="width:150px;margin-right: 10px;">
          <el-option v-for="i in displayLocations" :key="i.id" :label="i.name" :value="i.id" />
        </el-select>
        <el-input v-model="formData.placeDetail" style="width:150px;" placeholder="备注（如教室号）" />
      </el-form-item>
      <el-form-item label="在线链接" v-if="formData.placeType == 'online'">
        <el-input v-model="formData.placeLink" style="width:400px;" />
      </el-form-item>
      <el-form-item label="考试安排" v-if="type === 'course'">
        <el-radio-group v-model="formData.exam.exist">
          <el-radio :label="false">无</el-radio>
          <el-radio :label="true">有</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="formData.exam.exist">
        <el-form-item label="考试日期">
          <el-date-picker v-model="formData.exam.day" type="date" :clearable="false" />
        </el-form-item>
        <el-form-item label="考试时间">
          <el-time-select v-model="formData.exam.startTime" start="8:00" step="1:00" end="19:00" format="H:mm"
            :clearable="false" style="width:120px;" />
          <span style="margin: 0 10px;">-</span>
          <el-time-select v-model="formData.exam.endTime" :min-time="formData.exam.startTime" start="8:00" step="01:00"
            end="20:00" format="H:mm" :clearable="false" style="width:120px;" />
        </el-form-item>
        <el-form-item label="线下/线上考试">
          <el-radio-group v-model="formData.exam.placeType">
            <el-radio label="offline">线下</el-radio>
            <el-radio label="online">线上</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="考试地点" v-if="formData.exam.placeType == 'offline'">
          <el-select v-model="formData.exam.placeId" filterable placeholder="选择地点"
            style="width:150px;margin-right: 10px;">
            <el-option v-for="i in displayLocations" :key="i.id" :label="i.name" :value="i.id" />
          </el-select>
          <el-input v-model="formData.exam.placeDetail" style="width:150px;" placeholder="备注（如教室号）" />
        </el-form-item>
        <el-form-item label="考试链接" v-if="formData.exam.placeType == 'online'">
          <el-input v-model="formData.exam.placeLink" />
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false" v-if="mode !== 'readonly'">取消</el-button>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { Activity, Course, Tempwork } from '../../common/definitions';
import { dialogs } from '../services/dialogs';
import { dayToDate, dateToDay } from '../../common/day';
import { FormInstance } from 'element-plus';
import { displayLocations } from '../services/map'

const initialFormData = {
  id: '',
  name: '',
  startTime: '8:00',
  endTime: '9:00',
  weekday: 0,
  startWeek: 1,
  endWeek: 1,
  placeType: 'offline',
  placeLink: '',
  placeId: 0,
  placeDetail: '',
  repeat: 'once' as 'once' | 'daily' | 'weekly',
  day: new Date(),
  startDay: new Date(),
  endDay: new Date(),
  exam: {
    exist: false,
    day: new Date(),
    startTime: '8:00',
    endTime: '9:00',
    placeType: 'offline',
    placeLink: '',
    placeId: 0,
    placeDetail: '',
  }
}

export default {
  events: ['cancel', 'confirm'],
  data() {
    const newFormData = { ...initialFormData };
    newFormData.exam = { ...initialFormData.exam };
    return {
      visible: false,
      type: 'course' as 'course' | 'activity' | 'tempwork',
      mode: 'readonly' as 'readonly' | 'edit' | 'new',
      title: '',
      formData: newFormData,
      week: [
        { key: 0, value: '周一' },
        { key: 1, value: '周二' },
        { key: 2, value: '周三' },
        { key: 3, value: '周四' },
        { key: 4, value: '周五' },
        { key: 5, value: '周六' },
        { key: 6, value: '周日' }
      ],
      callback: null as (null | ((res: any) => Promise<boolean>)),
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { max: 50, message: '长度不能超过50字符', trigger: 'blur' },
        ],
      },
      displayLocations
    }
  },
  methods: {
    open(type: 'course' | 'activity' | 'tempwork',
      mode: 'readonly' | 'edit' | 'new',
      init: Course | Activity | Tempwork | null,
      callback: (res: any) => Promise<boolean>) {
      this.visible = true;
      this.type = type;
      this.mode = mode;
      this.title = (mode === 'new' ? '新建' : mode === 'edit' ? '编辑' : '查看')
        + (type === 'course' ? '课程' : type === 'activity' ? '课外活动' : '临时事务')

      const newFormData = { ...initialFormData };
      newFormData.exam = { ...initialFormData.exam };
      this.formData = newFormData;
      if (mode !== 'new' && init !== null) {
        this.formData.id = init.id;
        this.formData.name = init.name;
        this.formData.placeType = init.placeInfo.type;
        if (init.placeInfo.type === 'offline') {
          this.formData.placeId = init.placeInfo.id;
          this.formData.placeDetail = init.placeInfo.detail;
        } else {
          this.formData.placeLink = init.placeInfo.link;
        }
        if (type === 'course') {
          const course = init as Course;
          this.formData.startTime = course.startTime + ':00';
          this.formData.endTime = (course.startTime + course.duration) + ':00'
          this.formData.startWeek = course.startWeek;
          this.formData.endWeek = course.endWeek;
          this.formData.weekday = course.weekday;
          if (course.examInfo) {
            this.formData.exam.exist = true;
            this.formData.exam.day = dayToDate(course.examInfo.day);
            this.formData.exam.startTime = course.examInfo.startTime + ':00';
            this.formData.exam.endTime = (course.examInfo.startTime + course.examInfo.duration) + ':00';
            this.formData.exam.placeType = course.examInfo.placeInfo.type;
            if (course.examInfo.placeInfo.type === 'offline') {
              this.formData.exam.placeId = course.examInfo.placeInfo.id;
              this.formData.exam.placeDetail = course.examInfo.placeInfo.detail;
            } else {
              this.formData.exam.placeLink = course.examInfo.placeInfo.link;
            }
          }
        } else if (type === 'activity') {
          const activity = init as Activity;
          this.formData.startTime = activity.startTime + ':00';
          this.formData.repeat = activity.repeat.type;
          if (activity.repeat.type === 'once') {
            this.formData.day = dayToDate(activity.repeat.day);
          } else if (activity.repeat.type === 'daily') {
            this.formData.startDay = dayToDate(activity.repeat.startDay);
            this.formData.endDay = dayToDate(activity.repeat.endDay);
          } else if (activity.repeat.type === 'weekly') {
            this.formData.startWeek = activity.repeat.startWeek;
            this.formData.endWeek = activity.repeat.endWeek;
            this.formData.weekday = activity.repeat.weekday;
          }
        } else {
          const tempwork = init as Tempwork;
          this.formData.startTime = tempwork.time + ':00';
          this.formData.day = dayToDate(tempwork.day);
        }
      }
      this.callback = callback;
    },
    async confirm() {
      if (!await (this.$refs.form as FormInstance).validate()) return;
      const result: any = {
        id: this.formData.id,
        name: this.formData.name,
        placeInfo: {
          type: this.formData.placeType,
          id: this.formData.placeId,
          link: this.formData.placeLink,
          detail: this.formData.placeDetail,
        }
      };
      if (this.type === 'course') {
        result.startTime = this.strToTime(this.formData.startTime);
        result.duration = this.strToTime(this.formData.endTime) - result.startTime;
        result.startWeek = this.formData.startWeek;
        result.endWeek = this.formData.endWeek;
        result.weekday = this.formData.weekday;
        if (this.formData.exam.exist) {
          result.examInfo = {
            day: dateToDay(this.formData.exam.day),
            startTime: this.strToTime(this.formData.exam.startTime),
            duration: this.strToTime(this.formData.exam.endTime) - this.strToTime(this.formData.exam.startTime),
            placeInfo: {
              type: this.formData.exam.placeType,
              id: this.formData.exam.placeId,
              link: this.formData.exam.placeLink,
              detail: this.formData.exam.placeDetail,
            }
          }
        }
      } else if (this.type === 'activity') {
        result.startTime = this.strToTime(this.formData.startTime);
        result.repeat = { type: this.formData.repeat };
        if (this.formData.repeat === 'once') {
          result.repeat.day = dateToDay(this.formData.day);
        } else if (this.formData.repeat === 'daily') {
          result.repeat.startDay = dateToDay(this.formData.startDay);
          result.repeat.endDay = dateToDay(this.formData.endDay);
        }
        else if (this.formData.repeat === 'weekly') {
          result.repeat.startWeek = this.formData.startWeek;
          result.repeat.endWeek = this.formData.endWeek;
          result.repeat.weekday = this.formData.weekday;
        }
      } else {
        result.time = this.strToTime(this.formData.startTime);
        result.day = dateToDay(this.formData.day);
      }
      if (this.callback && await this.callback(result)) this.visible = false;

    },
    strToTime(str: string) {
      return parseInt(str.substring(0, str.length - 3));
    }
  },
  watch: {
    'formData.startTime'() {
      if (this.type !== 'course' || this.strToTime(this.formData.endTime) <= this.strToTime(this.formData.startTime)) {
        this.formData.endTime = (this.strToTime(this.formData.startTime) + 1) + ':00';
      }
    },
    'formData.exam.startTime'() {
      if (this.strToTime(this.formData.exam.endTime) <= this.strToTime(this.formData.exam.startTime)) {
        this.formData.exam.endTime = (this.strToTime(this.formData.exam.startTime) + 1) + ':00';
      }
    },
    'formData.startWeek'() {
      if (this.formData.endWeek < this.formData.startWeek) {
        this.formData.endWeek = this.formData.startWeek;
      }
    },
  },
  mounted() {
    dialogs.detailDialog = this;
  }
}   
</script>