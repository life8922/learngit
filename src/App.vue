<template>
  <div id="app">
    <router-view></router-view>
    <footer-guide></footer-guide>
  </div>
</template>
<script>
import FooterGuide from './components/FooterGuide/FooterGuide.vue'
export default {
  components: {
    FooterGuide
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>
