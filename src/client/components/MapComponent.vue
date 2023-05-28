<template>
  <div>
    <svg width="1000" height="1408">
      <image href="public/xtc.jpg" height="100%" width="100%" x="-10" y="-10" />
      <line v-for="i of lines" :x1="i[0].x" :y1="i[0].y" :x2="i[1].x" :y2="i[1].y" stroke="#33f1ff" stroke-width="2" />
      <ellipse v-for="i of points" :cx="i.x" :cy="i.y" rx="4" ry="4" fill="#ff3333" @click="clickPoint(i)"/>
      <!-- <text v-for="i of points" text-anchor="middle" :x="i.x" :y="i.y + 4" font-size="8">{{ i.name }}</text> -->
    </svg>
  </div>
</template>

<style></style>

<script lang="ts">
import { ElMessageBox } from 'element-plus';
import mapInfo from '../assets/map.json'

export default {
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
      lines
    }
  },
  methods:{
    clickPoint(point: typeof this.points[0]){
      ElMessageBox.alert(`${point.id} ${point.name}`);
    }
  }
}
</script>