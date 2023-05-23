<template>
  <RouterView />
  <DetailDialog />
</template>
<script lang="ts">
import DetailDialog from './components/DetailDialog.vue';
export default {
  components: {
    DetailDialog
  },
}
</script>
