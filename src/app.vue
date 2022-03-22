<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<style>
#app {
  font-family: 'Panton', sans-serif;
}
</style>

<script>
export default {
  name: 'app',
  computed: {
    layout() {
      const layout = this.$route.meta.layout || 'empty';
      return `${layout}-layout`;
    },
  },
};
</script>
