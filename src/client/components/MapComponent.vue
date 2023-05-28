<template>
  <svg width="1000" height="1408">
    <image href="public/xtc.jpg" height="100%" width="100%" x="-10" y="-10" />
    <path :d="pathText" stroke="#33f1ff" stroke-width="2" />
    <!-- <ellipse v-for="i of points" :cx="i.x" :cy="i.y" rx="4" ry="4" fill="#ff3333" @click="clickPoint(i)" /> -->
    <!-- <text v-for="i of points" text-anchor="middle" :x="i.x" :y="i.y + 4" font-size="8">{{ i.name }}</text> -->
  </svg>
</template>

<script lang="ts">
import { ElMessageBox } from 'element-plus';
import { displayLocations, mapInfo } from '../services/map'
import { PropType } from 'vue';

export default {
  props: {
    path: { type: Object as PropType<number[]>, default: [] },
  },
  data() {
    const points = [], lines = [];
    for (const i of mapInfo) {
      points.push({
        x: i.address[0],
        y: i.address[1],
        id: i.id,
        name: i.name
      })
    }
    for (let i = 0; i < mapInfo.length; i++) {
      for (let j of mapInfo[i].connection) {
        if (i < j) lines.push([points[i], points[j]]);
      }
    }
    return {
      points,
      lines,
      displayLocations,
      start: 10
    }
  },

  computed: {
    pathText() {
      let text = '';
      let first = true;
      for (const i of this.path) {
        if (first) {
          text += 'M ';
          first = false;
        } else {
          text += 'L ';
        }
        text += `${this.points[i].x} ${this.points[i].y}`
      }
      return text;
    }
  },

  methods: {
    clickPoint(point: typeof this.points[0]) {
      ElMessageBox.alert(`${point.id} ${point.name}`);
    }
  }
}
</script>