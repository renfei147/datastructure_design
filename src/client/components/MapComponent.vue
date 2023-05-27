<template>
  <div>
    <img id="map-bg" width="500" src="public/xtc.jpg">
    <svg id="map-canvas" width="500" height="704">
      <path v-for="i of lines" :d="`M ${i[0][0]} ${i[0][1]} L ${i[1][0]} ${i[1][1]}`" fill="none" stroke="#33f1ff" stroke-miterlimit="10" pointer-events="stroke"/>
      <ellipse v-for="i of mapInfo" :cx="i.address[0]" :cy="i.address[1]" rx="2" ry="2" fill="#ff3333" stroke="none" pointer-events="all"/>
    </svg>
  </div>
</template>

<style>
#map-bg {
  position: absolute;
  top: 10;
  left: 10;
  z-index: -1;
}

#map-canvas {
  position: absolute;
  top: 10;
  left: 10;
  z-index: 0;
}
</style>

<script lang="ts">
import mapInfo from '../assets/map.json'

export default {

  data() {
    for (const i of mapInfo) {
      i.address[0]  = i.address[0] * 0.5 + 5;
      i.address[1]  = i.address[1] * 0.5 + 5;
    }
    const lines = [];
    for (let i = 0; i < mapInfo.length; i++) {
      for (let j of mapInfo[i].connection) {
        if(i < j) lines.push([mapInfo[i].address, mapInfo[j].address]);
      }
    }
    return {
      mapInfo,
      lines
    }
  }
}
</script>