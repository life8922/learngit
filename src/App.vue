<template>
  <div id="app">
    <router-view/>
    <FooterGuide v-show="$route.meta.showFooter"/>
  </div>
</template>

<script>
import {mapActions, mapMutations} from 'vuex'
import FooterGuide from './components/FooterGuide/FooterGuide.vue'

export default {

  mounted () {
    // this.$store.dispatch('getAddress')
    this.getAddress()
  },

  methods: {
    ...mapActions(['getAddress', 'getUserInfo']),
    ...mapMutations(['changeName'])
  },

  components: {
    FooterGuide
  },
  created () {

  },
  updated () {
    var userInfo = sessionStorage.getItem('name')
    console.log('ahha' + userInfo)
    this.changeName(userInfo)
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .app
    width 100%
    height 100%
    background #f5f5f5
</style>
