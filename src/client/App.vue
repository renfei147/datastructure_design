<template>
  <component :is="currentView" />
</template>

<script lang="ts">
import Home from './routes/Main.vue';
import Login from './routes/Login.vue';
import NotFound from './routes/NotFound.vue';
const routes: any = {
  '/': Home,
  '/login': Login
}
export default {
  data() {
    return {
      currentPath: window.location.hash
    }
  },
  computed: {
    currentView() {
      return routes[this.currentPath.slice(1) || '/'] || NotFound;
    }
  },
  mounted() {
    window.addEventListener('hashchange', () => {
      this.currentPath = window.location.hash
    })
  }
}
</script>
